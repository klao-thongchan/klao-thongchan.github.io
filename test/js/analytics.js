/**
 * Google Analytics 4 Custom Event Tracking Module.
 *
 * Implements isolated, privacy-compliant event tracking for the staging environment.
 * Incorporates event parameter sanitization, PII redaction, query string cleaning,
 * dynamic section-view telemetry, and click-event delegation tracking.
 *
 * @module analytics
 */

(function () {
  'use strict';

  // 1. Core Verification Helpers

  /**
   * Validates if a given event name conforms to GA4 standards (lowercase snake_case).
   *
   * Purpose:
   * Prevents malformed or non-compliant event names from being sent to GA4.
   *
   * Invocation:
   * Called internally by trackAnalyticsEvent() prior to event dispatch.
   *
   * @param {string} eventName - The name of the telemetry event.
   * @returns {boolean} True if the name is valid, otherwise false.
   */
  function isValidEventName(eventName) {
    return typeof eventName === 'string' && /^[a-z0-9_]+$/.test(eventName);
  }

  /**
   * Redacts personally identifiable information (PII) like email and phone numbers,
   * and removes query strings from URLs to preserve user privacy.
   *
   * Purpose:
   * Compliance with Google Analytics terms of service by preventing collection of user email or phone numbers.
   *
   * Invocation:
   * Called internally by sanitizeAnalyticsParameters() to clean string parameters.
   *
   * Fallback behavior:
   * If URL parsing throws an exception, falls back to returning the original string with regex redactions applied.
   *
   * Privacy implications:
   * High. Actively prevents leaking user credentials, email addresses, or phone numbers to third-party logs.
   *
   * @param {string} val - The raw parameter value to clean.
   * @returns {string} The redacted and sanitized string value.
   */
  function sanitizeAnalyticsValue(val) {
    if (typeof val !== 'string') return val;

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,4}[-.\s]??)?(\(?\d{3}\)?[-.\s]??\d{3}[-.\s]??\d{4})/g;

    let sanitized = val;
    // Redact email patterns
    sanitized = sanitized.replace(emailRegex, '[REDACTED_EMAIL]');
    // Redact phone patterns
    sanitized = sanitized.replace(phoneRegex, '[REDACTED_PHONE]');

    // Remove query parameters from URLs
    if (sanitized.includes('://') || sanitized.startsWith('/') || sanitized.startsWith('.')) {
      try {
        const base = sanitized.startsWith('/') || sanitized.startsWith('.') ? window.location.origin : undefined;
        const urlObj = new URL(sanitized, base);
        if (urlObj.search) {
          urlObj.search = '';
          sanitized = sanitized.startsWith('/') || sanitized.startsWith('.')
            ? urlObj.pathname + urlObj.hash
            : urlObj.toString();
        }
      } catch (e) {
        // Ignore URL parsing errors and keep string as-is
      }
    }

    return sanitized;
  }

  /**
   * Sanitizes all properties in the event parameters object.
   * Filters out nested structures (objects/arrays) and runs PII redaction on values.
   *
   * Purpose:
   * Ensures the GA4 payload is a flat, clean object that will not trigger Google Analytics API validation failures.
   *
   * Invocation:
   * Called internally by trackAnalyticsEvent().
   *
   * @param {Object} parameters - Raw parameters dictionary.
   * @returns {Object} A flat, sanitized parameters dictionary.
   */
  function sanitizeAnalyticsParameters(parameters) {
    const eventParams = Object.assign({}, parameters);

    for (const key in eventParams) {
      if (Object.prototype.hasOwnProperty.call(eventParams, key)) {
        const value = eventParams[key];

        // 1. Remove nested structures
        if (value !== null && typeof value === 'object') {
          console.warn(`[Analytics] Nested parameter object not allowed for key: "${key}"`);
          delete eventParams[key];
          continue;
        }

        // 2. Redact text values
        if (typeof value === 'string') {
          eventParams[key] = sanitizeAnalyticsValue(value);
        }
      }
    }

    return eventParams;
  }

  /**
   * Detects the current execution path and generates staging/environment metadata parameters.
   *
   * Purpose:
   * Segregates test/staging telemetry data from production records in reports.
   *
   * Invocation:
   * Called internally by trackAnalyticsEvent() on every dispatch.
   *
   * State read:
   * Reads `window.location.pathname`.
   *
   * @returns {Object} Staging telemetry metadata parameters.
   */
  function getCurrentEnvironmentParameters() {
    const params = {};
    const isTest = window.location.pathname.startsWith('/test');
    if (isTest) {
      params.environment = 'test';
      params.debug_mode = true;
    }
    return params;
  }

  // 2. Public Tracking Interface

  /**
   * Dispatches a custom GA4 telemetry event safely.
   *
   * Purpose:
   * Serves as the global dispatcher interface. Validates parameters and calls Google's gtag API.
   *
   * Invocation:
   * Exposed globally as `window.trackAnalyticsEvent`. Called by event delegation scripts,
   * section observers, or custom workflows.
   *
   * Browser APIs:
   * Uses `window.gtag` if available.
   *
   * External dependencies:
   * Relies on the Google Analytics global site tag script loaded asynchronously.
   *
   * Failure behavior:
   * Fails silently if `gtag` is unavailable or if event validation fails, avoiding JS crashes.
   *
   * Privacy implications:
   * Appends sanitized page paths, titles, environment flags, and redacts PII.
   *
   * @global
   * @param {string} eventName - Lowercase snake_case identifier for the GA4 event.
   * @param {Object} [parameters={}] - Key-value pair parameters containing event metadata.
   * @returns {void}
   */
  window.trackAnalyticsEvent = function (eventName, parameters) {
    if (typeof window.gtag !== 'function') {
      // In staging/test mode, log even if gtag is missing to facilitate debugging
      const isTest = window.location.pathname.startsWith('/test');
      if (isTest) {
        const devParams = Object.assign(
          getCurrentEnvironmentParameters(),
          { page_path: window.location.pathname, page_title: document.title },
          sanitizeAnalyticsParameters(parameters)
        );
        console.log(`[Analytics Event (gtag offline)] "${eventName}"`, devParams);
      }
      return;
    }

    try {
      if (!isValidEventName(eventName)) {
        console.warn(`[Analytics] Invalid event name: "${eventName}". Must be lowercase alphanumeric and snake_case.`);
        return;
      }

      // Initialize base params and layer environmental, page, and custom info
      const eventParams = Object.assign(
        {
          page_path: window.location.pathname,
          page_title: document.title
        },
        getCurrentEnvironmentParameters(),
        sanitizeAnalyticsParameters(parameters)
      );

      const isTest = window.location.pathname.startsWith('/test');
      if (isTest) {
        console.log(`[Analytics Event] "${eventName}"`, eventParams);
      }

      // Fire gtag event
      window.gtag('event', eventName, eventParams);

    } catch (error) {
      console.error('[Analytics] Error sending event:', error);
    }
  };

  // 3. Dynamic DOM Event Handlers

  /**
   * Scrapes metadata attributes formatting `data-analytics-param-*` from an element.
   *
   * Purpose:
   * Gathers declarative custom analytics variables attached directly to HTML markup.
   *
   * Invocation:
   * Called by click event delegation handler when a valid trackable target is clicked.
   *
   * @param {HTMLElement} element - The DOM element containing attributes.
   * @returns {Object} Extracted key-value pair parameters.
   */
  function collectAnalyticsDataAttributes(element) {
    const params = {};
    if (!element || !element.attributes) return params;

    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-analytics-param-')) {
        const paramName = attr.name.substring('data-analytics-param-'.length).replace(/-/g, '_');
        params[paramName] = attr.value;
      }
    });

    return params;
  }

  /**
   * Establishes a delegated click listener on the document root.
   *
   * Purpose:
   * Standardizes tracking across the entire website with zero-maintenance,
   * avoiding separate listeners on individual buttons/links.
   *
   * Invocation:
   * Called once on script execution.
   *
   * DOM dependencies:
   * - Reads click events from window.
   * - Traverses DOM up to find elements matching `[data-analytics-event]`.
   *
   * Side effects:
   * Attaches a global document click event listener.
   *
   * Failure behavior:
   * Silent. Fails without blockages if targets lack correct variables.
   *
   * @returns {void}
   */
  function initializeAnalyticsClickTracking() {
    document.addEventListener('click', function (event) {
      const trackableEl = event.target.closest('[data-analytics-event]');
      if (!trackableEl) {
        return;
      }

      const eventName = trackableEl.getAttribute('data-analytics-event');
      if (!eventName) return;

      const params = collectAnalyticsDataAttributes(trackableEl);

      // Special handling for theme_change (wait for class list update)
      if (eventName === 'theme_change') {
        setTimeout(() => {
          const isDark = document.documentElement.classList.contains('dark');
          params.selected_theme = isDark ? 'dark' : 'light';
          window.trackAnalyticsEvent(eventName, params);
        }, 0);
      } else {
        window.trackAnalyticsEvent(eventName, params);
      }
    });
  }

  /**
   * Initializes visibility trackers on portfolio sections using IntersectionObserver.
   *
   * Purpose:
   * Tracks when sections enter the visitor's view for at least 1 second.
   *
   * Invocation:
   * Called on DOMContentLoaded page load.
   *
   * DOM dependencies:
   * - Reads and observes all elements matching `[data-analytics-section]`.
   *
   * Side effects:
   * Establishes a viewport IntersectionObserver.
   * Spawns delayed timers (`setTimeout`) to record views.
   *
   * Browser APIs:
   * Uses IntersectionObserver and window.innerHeight.
   *
   * @returns {void}
   */
  function initializeSectionViewTracking() {
    if (typeof IntersectionObserver !== 'function') {
      return;
    }

    const trackedSections = new Set();
    const visibilityTimers = new Map();

    const observerOptions = {
      root: null,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const name = entry.target.getAttribute('data-analytics-section') || id;

        if (trackedSections.has(id)) {
          return;
        }

        const visibleHeight = entry.intersectionRect.height;
        const elementHeight = entry.boundingClientRect.height;
        const viewportHeight = window.innerHeight;

        const is50PercentVisible = entry.intersectionRatio >= 0.5 ||
          (elementHeight > viewportHeight && visibleHeight >= viewportHeight * 0.5);

        if (is50PercentVisible) {
          if (!visibilityTimers.has(id)) {
            const timer = setTimeout(() => {
              window.trackAnalyticsEvent('section_view', {
                section_id: id,
                section_name: name
              });
              trackedSections.add(id);
              observer.unobserve(entry.target);
              visibilityTimers.delete(id);
            }, 1000);
            visibilityTimers.set(id, timer);
          }
        } else {
          if (visibilityTimers.has(id)) {
            clearTimeout(visibilityTimers.get(id));
            visibilityTimers.delete(id);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-analytics-section]').forEach(sec => {
      observer.observe(sec);
    });
  }

  /**
   * Detects visits to the Curriculum Vitae section and dispatches attribution metadata.
   *
   * Purpose:
   * Analyzes referrers to attribute whether the visitor loaded the CV via an internal link,
   * direct URL entry, or external social media portals.
   *
   * Invocation:
   * Called on DOMContentLoaded page load.
   *
   * State read:
   * Reads `document.referrer`, `window.location.pathname`, and `window.location.hostname`.
   *
   * @returns {void}
   */
  function initializeCvTracking() {
    if (window.location.pathname.includes('/cv/')) {
      let linkLocation = 'direct';
      if (document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          if (refUrl.hostname === window.location.hostname) {
            linkLocation = refUrl.pathname;
          } else {
            linkLocation = 'external';
          }
        } catch (e) {
          linkLocation = 'unknown';
        }
      }
      window.trackAnalyticsEvent('cv_open', {
        cv_format: 'html',
        link_location: linkLocation
      });
    }
  }

  // 4. Registration bootstrap
  initializeAnalyticsClickTracking();

  document.addEventListener('DOMContentLoaded', function () {
    initializeSectionViewTracking();
    initializeCvTracking();
  });

})();

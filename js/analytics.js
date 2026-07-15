/**
 * Google Analytics 4 Custom Event Tracking Module
 * Target Environment: Test/Staging (isolated via path /test)
 */

(function () {
  'use strict';

  // 1. Safe Event Tracking Function
  window.trackAnalyticsEvent = function (eventName, parameters) {
    // Fail silently if gtag is not defined
    if (typeof window.gtag !== 'function') {
      return;
    }

    // Never cause a JS error, wrap in try-catch
    try {
      // Validate eventName: lowercase snake_case
      if (typeof eventName !== 'string' || !/^[a-z0-9_]+$/.test(eventName)) {
        console.warn(`[Analytics] Invalid event name: "${eventName}". Must be lowercase alphanumeric and snake_case.`);
        return;
      }

      // Initialize parameters object safely
      const eventParams = Object.assign({}, parameters);

      // Validate parameters (must be a clean object, no nested structures)
      for (const key in eventParams) {
        if (Object.prototype.hasOwnProperty.call(eventParams, key)) {
          if (typeof eventParams[key] === 'object' && eventParams[key] !== null) {
            console.warn(`[Analytics] Nested parameter object not allowed for key: "${key}"`);
            delete eventParams[key];
          }
        }
      }

      // Automatically attach environment parameters
      const isTest = window.location.pathname.startsWith('/test');
      if (isTest) {
        eventParams.environment = 'test';
        eventParams.debug_mode = true;
      }

      // Automatically attach page details
      eventParams.page_path = window.location.pathname;
      eventParams.page_title = document.title;

      // PII and Query String Redaction
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phoneRegex = /(\+?\d{1,4}[-.\s]??)?(\(?\d{3}\)?[-.\s]??\d{3}[-.\s]??\d{4})/g;

      for (const key in eventParams) {
        if (Object.prototype.hasOwnProperty.call(eventParams, key)) {
          let val = eventParams[key];
          if (typeof val === 'string') {
            // Redact emails
            val = val.replace(emailRegex, '[REDACTED_EMAIL]');
            // Redact phone numbers
            val = val.replace(phoneRegex, '[REDACTED_PHONE]');
            // Remove query parameters from URLs
            if (val.includes('://') || val.startsWith('/') || val.startsWith('.')) {
              try {
                // If it's a relative path, use window.location.origin as base
                const base = val.startsWith('/') || val.startsWith('.') ? window.location.origin : undefined;
                const urlObj = new URL(val, base);
                if (urlObj.search) {
                  urlObj.search = '';
                  // If it was relative, output the relative version back
                  val = val.startsWith('/') || val.startsWith('.') 
                    ? urlObj.pathname + urlObj.hash 
                    : urlObj.toString();
                }
              } catch (e) {
                // Ignore parsing errors and keep string as is
              }
            }
            eventParams[key] = val;
          }
        }
      }

      // Log info to console in test mode
      if (isTest) {
        console.log(`[Analytics Event] "${eventName}"`, eventParams);
      }

      // Fire the gtag event
      window.gtag('event', eventName, eventParams);

    } catch (error) {
      console.error('[Analytics] Error sending event:', error);
    }
  };

  // 2. Click Event Delegation Listener
  document.addEventListener('click', function (event) {
    // Find the closest ancestor (or self) that has data-analytics-event
    const trackableEl = event.target.closest('[data-analytics-event]');
    if (!trackableEl) {
      return;
    }

    const eventName = trackableEl.getAttribute('data-analytics-event');
    const params = {};

    // Gather all parameters with format data-analytics-param-*
    Array.from(trackableEl.attributes).forEach(attr => {
      if (attr.name.startsWith('data-analytics-param-')) {
        // Convert param-name-here to param_name_here
        const paramName = attr.name.substring('data-analytics-param-'.length).replace(/-/g, '_');
        params[paramName] = attr.value;
      }
    });

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

  // 3. Section View Tracking using IntersectionObserver
  const initSectionTracking = function () {
    const trackedSections = new Set();
    const visibilityTimers = new Map();

    const observerOptions = {
      root: null,
      // Provide fine-grained thresholds so we capture changes as the element enters/leaves
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const name = entry.target.getAttribute('data-analytics-section') || id;

        // Skip if already tracked
        if (trackedSections.has(id)) {
          return;
        }

        const visibleHeight = entry.intersectionRect.height;
        const elementHeight = entry.boundingClientRect.height;
        const viewportHeight = window.innerHeight;

        // Meets visibility threshold:
        // - At least 50% of the element itself is visible (entry.intersectionRatio >= 0.5)
        // - OR the element is taller than the viewport and fills at least 50% of the viewport height
        const is50PercentVisible = entry.intersectionRatio >= 0.5 ||
          (elementHeight > viewportHeight && visibleHeight >= viewportHeight * 0.5);

        if (is50PercentVisible) {
          // If visibility timer is not active, start it
          if (!visibilityTimers.has(id)) {
            const timer = setTimeout(() => {
              window.trackAnalyticsEvent('section_view', {
                section_id: id,
                section_name: name
              });
              trackedSections.add(id);
              observer.unobserve(entry.target);
              visibilityTimers.delete(id);
            }, 1000); // 1 second duration
            visibilityTimers.set(id, timer);
          }
        } else {
          // If it fell below 50% visibility, cancel and clear the timer
          if (visibilityTimers.has(id)) {
            clearTimeout(visibilityTimers.get(id));
            visibilityTimers.delete(id);
          }
        }
      });
    }, observerOptions);

    // Observe all sections designated for tracking
    document.querySelectorAll('[data-analytics-section]').forEach(sec => {
      observer.observe(sec);
    });
  };

  // 4. Page Load Actions
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize section tracking
    initSectionTracking();

    // Track cv_open if we are on the CV page
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
  });

})();

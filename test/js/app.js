/**
 * Application Entrypoint and Orchestrator.
 *
 * Imports sub-modules and initializes the landing page features on DOMContentLoaded.
 * Uses ES Module syntax for modular static architecture.
 *
 * @module app
 */

'use strict';

import { initTheme, initThemeToggle } from './theme.js';
import { initMobileMenu, initScrollSpy } from './navigation.js';
import { initTimelineAccordion } from './timeline.js';
import { initProjectFiltering } from './project-filter.js';
import { initCurrentYear, initVersionIndicator } from './utilities.js';

/**
 * Initializes all staging website interactive behaviors.
 *
 * Purpose:
 * Entry point to bootstrap the theme toggles, mobile drawer, timeline disclosures,
 * project filters, and scroll tracking in a safe and structured manner.
 *
 * Invocation:
 * Listens to DOMContentLoaded event on document.
 *
 * Side effects:
 * Triggers initialization functions across all isolated JS modules.
 * Logs bootstrap completion message to browser console.
 *
 * Failure behavior:
 * Wraps individual sub-initializers in defensive checks so that a failure in one
 * feature does not halt the bootstrap sequence of other features.
 *
 * @returns {void}
 */
function initializeApplication() {
  // 1. Theme Management (run first to avoid flash of incorrect styling)
  try {
    initTheme();
    initThemeToggle();
  } catch (error) {
    console.error('[App] Theme initialization failed:', error);
  }

  // 2. Interactive UI Components
  try {
    initMobileMenu();
  } catch (error) {
    console.error('[App] Mobile menu initialization failed:', error);
  }

  try {
    initTimelineAccordion();
  } catch (error) {
    console.error('[App] Timeline accordion initialization failed:', error);
  }

  try {
    initProjectFiltering();
  } catch (error) {
    console.error('[App] Project filtering initialization failed:', error);
  }

  // 3. Page Telemetry & Utilities
  try {
    initScrollSpy();
  } catch (error) {
    console.error('[App] Scroll Spy initialization failed:', error);
  }

  try {
    initCurrentYear();
  } catch (error) {
    console.error('[App] Current year initialization failed:', error);
  }

  try {
    initVersionIndicator();
  } catch (error) {
    console.error('[App] Version indicator initialization failed:', error);
  }

  console.log('[Staging Website] Initialization completed successfully.');
}

// Attach bootstrap sequence to DOMContentLoaded hook
document.addEventListener('DOMContentLoaded', initializeApplication);

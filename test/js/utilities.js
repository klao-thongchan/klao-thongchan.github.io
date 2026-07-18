/**
 * General Page Utilities Module.
 *
 * Provides minor helper scripts and calculations for the application UI.
 *
 * @module utilities
 */

'use strict';

import { SITE_VERSION } from './version.js';

/**
 * Dynamically computes and displays the current year in footer copyright elements.
 *
 * Purpose:
 * Keeps copyright dates up-to-date automatically without requiring manual code changes.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Reads and modifies text content of `#current-year`.
 *
 * Side effects:
 * Updates the text content of target footer elements.
 *
 * Failure behavior:
 * Fails silently if the `#current-year` element is not present.
 *
 * @returns {void}
 */
export function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Dynamically injects the website version indicator at the absolute bottom of the document body.
 *
 * Purpose:
 * Renders the single-source-of-truth website version dynamically to avoid HTML duplication.
 *
 * DOM dependencies:
 * - Appends a new child element to `document.body`.
 *
 * @returns {void}
 */
export function initVersionIndicator() {
  const versionEl = document.createElement('div');
  versionEl.className = 'site-version';
  versionEl.setAttribute('aria-label', 'Website version');
  versionEl.textContent = `Version ${SITE_VERSION}`;
  document.body.appendChild(versionEl);
}

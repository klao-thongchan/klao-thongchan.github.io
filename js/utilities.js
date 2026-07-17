/**
 * General Page Utilities Module.
 *
 * Provides minor helper scripts and calculations for the application UI.
 *
 * @module utilities
 */

'use strict';

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

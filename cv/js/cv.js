/**
 * CV Interactivity and Printing Helper Module.
 *
 * Excludes inline scripts and provides standard W3C event handling for printing behaviors.
 *
 * @module cv
 */

'use strict';

/**
 * Initializes CV-specific interactive controls (such as the print actions).
 *
 * Purpose:
 * Connects the "Print / Save as PDF" button control to standard print features
 * without utilizing inline JS attributes.
 *
 * Invocation:
 * Called once on DOMContentLoaded within cv/index.html context.
 *
 * DOM dependencies:
 * - Reads '#cv-print-btn'.
 *
 * Side effects:
 * Attaches a click event listener on the print button.
 * Triggers window.print() on activation.
 *
 * Browser APIs:
 * Uses `window.print()`.
 *
 * Failure behavior:
 * Fails silently if '#cv-print-btn' is missing from the DOM.
 *
 * Accessibility:
 * Leverages native accessibility focus tree behaviors for button clicks.
 *
 * @returns {void}
 */
function initializeCvPage() {
  const printBtn = document.getElementById('cv-print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      try {
        window.print();
      } catch (error) {
        console.error('[CV] Failed to open native browser print dialog:', error);
      }
    });
  }
}

// Bootstrap initialization on content ready
document.addEventListener('DOMContentLoaded', initializeCvPage);

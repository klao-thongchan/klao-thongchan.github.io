/**
 * CV Interactivity, Printing, and Bilingual Localization Helper Module.
 *
 * Excludes inline scripts and provides standard W3C event handling for printing
 * and Thai/English language switching behaviors.
 *
 * @module cv
 */

'use strict';

import { BUILD_META } from '../../js/version-meta.js';
import { initI18n, getUiString } from '../../js/i18n.js';

/**
 * Initializes CV-specific interactive controls (such as the print actions).
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

/**
 * Dynamically injects the website version indicator at the absolute bottom of the document body.
 *
 * @returns {void}
 */
function injectVersionIndicator() {
  try {
    const versionEl = document.createElement('div');
    versionEl.className = 'site-version';
    versionEl.setAttribute('aria-label', getUiString('version_aria'));
    
    let versionText = `v${BUILD_META.version}`;
    if (BUILD_META.environment === 'Test') {
      versionText += ` · Test`;
    }
    versionText += ` · Build ${BUILD_META.date}-${BUILD_META.commit}`;
    
    versionEl.textContent = versionText;
    document.body.appendChild(versionEl);
  } catch (error) {
    console.error('[CV] Failed to inject website version:', error);
  }
}

// Bootstrap initialization on content ready
document.addEventListener('DOMContentLoaded', () => {
  initializeCvPage();
  injectVersionIndicator();
  initI18n('cv');
});

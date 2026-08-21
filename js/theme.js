/**
 * Theme Management Module.
 *
 * Handles dark mode initialization, toggling, and persistence in local storage.
 *
 * @module theme
 */

'use strict';

/**
 * Initializes the light/dark theme based on localStorage or system preferences.
 *
 * Security boundary / Trust boundary:
 * Stored values originate from localStorage, which can be modified by the user
 * or scripts running in the same origin. Stored values must be validated.
 *
 * Accepted inputs:
 * - 'light'
 * - 'dark'
 *
 * Rejected inputs:
 * Any values other than 'light' or 'dark' (e.g. payloads, undefined, numeric).
 *
 * Failure behavior:
 * Defaults to light mode if local storage value is invalid or inaccessible.
 *
 * DOM dependencies:
 * - Modifies class list of `document.documentElement` (adding or removing 'dark').
 *
 * Side effects:
 * Alters the rendering theme of the entire DOM.
 * Reads from localStorage.
 *
 * Privacy implications:
 * Reads local storage state; does not transmit any details externally.
 * Uses isolated namespace `klao:test:theme` to prevent contamination.
 *
 * @returns {void}
 */
export function initTheme() {
  try {
    const rawTheme = localStorage.getItem('klao:test:theme');
    
    // Strict input validation for theme value
    let savedTheme = null;
    if (rawTheme === 'light' || rawTheme === 'dark') {
      savedTheme = rawTheme;
    } else if (rawTheme !== null) {
      console.warn(`[Theme] Corrupted theme storage value discarded: "${rawTheme}"`);
      localStorage.removeItem('klao:test:theme');
    }

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const htmlEl = document.documentElement;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  } catch (error) {
    console.warn('[Theme] Failed to read theme from local storage. Defaulting to light.', error);
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Connects theme toggling controls to theme change handlers.
 *
 * Security boundary / Trust boundary:
 * Stores theme preferences to the isolated client-side storage keys.
 *
 * DOM dependencies:
 * - Reads all elements matching `.theme-toggle`.
 * - Toggles 'dark' class on `document.documentElement`.
 *
 * Side effects:
 * Adds 'click' event listeners to `.theme-toggle` elements.
 * Writes to localStorage.
 *
 * Failure behavior:
 * Fails silently if theme-toggle buttons are not present in the DOM.
 * If localStorage write fails, it still toggles the class for the current session.
 *
 * Analytics:
 * The theme change click is tracked via analytics.js event delegation.
 *
 * @returns {void}
 */
export function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  if (!themeToggleBtns.length) return;

  const htmlEl = document.documentElement;

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const isDark = htmlEl.classList.contains('dark');
        if (isDark) {
          htmlEl.classList.remove('dark');
          localStorage.setItem('klao:test:theme', 'light');
        } else {
          htmlEl.classList.add('dark');
          localStorage.setItem('klao:test:theme', 'dark');
        }
      } catch (error) {
        console.error('[Theme] Failed to write theme preference to local storage.', error);
        // Fallback: toggle classes anyway even if storage is blocked
        htmlEl.classList.toggle('dark');
      }
    });
  });
}

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
 * Purpose:
 * Ensures the website renders in the correct theme mode immediately upon loading,
 * conforming to user preference or system color scheme.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Modifies class list of `document.documentElement` (adding or removing 'dark').
 *
 * Side effects:
 * Alters the rendering theme of the entire DOM.
 * Reads from localStorage.
 *
 * Failure behavior:
 * Defaults to light mode if localStorage is inaccessible (e.g., in a sandboxed iframe).
 *
 * Accessibility:
 * Correctly styles components for high contrast/dark mode preferences.
 *
 * Privacy implications:
 * Reads local storage state; does not transmit any details externally.
 *
 * @returns {void}
 */
export function initTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
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
 * Purpose:
 * Attaches event listeners to theme switcher buttons, allowing visitors to switch
 * between light and dark modes dynamically.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
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
 * Accessibility:
 * Keeps the page contrast settings synchronized with user actions.
 * Note: Screen readers will read the updated layout theme colors.
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
          localStorage.setItem('theme', 'light');
        } else {
          htmlEl.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      } catch (error) {
        console.error('[Theme] Failed to write theme preference to local storage.', error);
        // Fallback: toggle classes anyway even if storage is blocked
        htmlEl.classList.toggle('dark');
      }
    });
  });
}

/**
 * Navigation Module.
 *
 * Handles mobile menu toggle interaction, accessibility enhancements,
 * and Scroll Spy active indicators.
 *
 * @module navigation
 */

'use strict';

/**
 * Initializes the mobile navigation menu drawer, attaching event listeners.
 *
 * Purpose:
 * Connects the hamburger menu button to the drawer menu panel, toggles visibility,
 * and manages accessibility attributes (`aria-expanded`).
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Reads `#mobile-menu-btn`.
 * - Reads `#mobile-menu`.
 * - Reads all `.mobile-nav-link` elements.
 * - Updates `aria-expanded` on `#mobile-menu-btn`.
 * - Toggles 'hidden' class on `#mobile-menu`.
 *
 * Side effects:
 * Adds click event listeners to the menu button and nav links.
 * Adds keydown event listener to window for Escape key handling.
 *
 * Failure behavior:
 * Returns early without errors if navigation controls are missing.
 *
 * Accessibility:
 * Toggles `aria-expanded` status synchronously. Closes the menu automatically on Escape keypress.
 *
 * @returns {void}
 */
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileMenu) return;

  // Ensure initial accessibility setup
  mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');

  /**
   * Toggles the open/closed state of the mobile menu.
   */
  const toggleMenu = () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
  };

  /**
   * Closes the mobile menu unconditionally.
   */
  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Support Escape-key closing for accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
      mobileMenuBtn.focus();
    }
  });
}

/**
 * Initializes the Scroll Spy observer.
 *
 * Purpose:
 * Monitors viewport scroll positions and adds an `.active` class to header links
 * corresponding to the section currently visible in the viewport.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Reads all `section[id]` elements.
 * - Reads all `.nav-link` elements in the header navigation.
 * - Modifies the class list of `.nav-link` elements (adds or removes 'active').
 *
 * Side effects:
 * Creates an `IntersectionObserver` observing all page sections.
 *
 * Failure behavior:
 * Returns early and logs warning if IntersectionObserver is unsupported or elements are missing.
 *
 * Browser APIs:
 * Uses IntersectionObserver.
 *
 * Accessibility:
 * Synchronizes visible focus section tracking with visual header states.
 *
 * @returns {void}
 */
export function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  if (typeof IntersectionObserver !== 'function') {
    console.warn('[Navigation] IntersectionObserver is not supported by this browser. Scroll Spy disabled.');
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

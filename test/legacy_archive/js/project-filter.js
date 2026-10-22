/**
 * Project Tag Filtering Module.
 *
 * Handles client-side category filtering of case study cards,
 * synchronizes styling, and maintains ARIA states for assistive devices.
 *
 * @module projectFilter
 */

'use strict';

/**
 * Initializes the project-category filtering controls.
 *
 * Purpose:
 * Connects each filter button to the project-card collection and updates the
 * visible cards when the visitor selects a category.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Reads all elements matching `.filter-btn`.
 * - Reads all elements matching `.project-card`.
 * - Updates styling classes on filter buttons (active/inactive states).
 * - Toggles 'hide' class on project cards.
 * - Sets `aria-pressed` on filter buttons.
 *
 * Side effects:
 * Attaches click event listeners to filter buttons.
 *
 * Failure behavior:
 * Returns early without errors if buttons or cards are unavailable in the DOM.
 *
 * Accessibility:
 * Keeps the selected filter’s `aria-pressed` state synchronized with the visual state.
 *
 * @returns {void}
 */
export function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  // Initialize accessibility attributes
  filterBtns.forEach(btn => {
    const isActive = btn.classList.contains('bg-indigo-600');
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      if (!filterValue) return;

      // Update button styling and ARIA states
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'dark:bg-indigo-600');
        b.classList.add('bg-slate-200', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.remove('bg-slate-200', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      btn.classList.add('bg-indigo-600', 'text-white', 'dark:bg-indigo-600');
      btn.setAttribute('aria-pressed', 'true');

      // Filter project cards visibility
      projectCards.forEach(card => {
        const categoryAttr = card.getAttribute('data-category');
        if (!categoryAttr) return;

        const categories = categoryAttr.split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

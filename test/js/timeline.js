/**
 * Career Timeline Disclosures Module.
 *
 * Handles expanding and collapsing professional timeline cards,
 * maintaining accessibility attributes, and updating toggle text/icons.
 *
 * @module timeline
 */

'use strict';

/**
 * Initializes interactive accordion disclosures on career timeline items.
 *
 * Purpose:
 * Binds click events to timeline expand/collapse buttons, toggles active class names
 * on card details, updates ARIA states, and changes text/chevron icons dynamically.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Reads all elements matching `.timeline-toggle`.
 * - For each button:
 *   - Resolves closest `.timeline-card`.
 *   - Reads `.timeline-details` within the card.
 *   - Reads `.toggle-icon` and `.toggle-text` inside the button.
 *   - Updates `aria-expanded` status on the button.
 *   - Toggles 'open' class on the details container.
 *
 * Side effects:
 * Attaches click event listeners to timeline toggle buttons.
 * Stores original button text in `data-original-text` attribute for accurate restoration.
 *
 * Failure behavior:
 * Fails silently if no timeline toggle buttons are present in the DOM.
 *
 * Accessibility:
 * Correctly maintains `aria-expanded` state. Uses unique target IDs in the DOM
 * to satisfy W3C disclosure specifications (ARIA controls).
 *
 * @returns {void}
 */
export function initTimelineAccordion() {
  const toggleBtns = document.querySelectorAll('.timeline-toggle');
  if (!toggleBtns.length) return;

  // Initialize buttons with their original text so we can restore it on collapse
  toggleBtns.forEach(btn => {
    const textSpan = btn.querySelector('.toggle-text');
    if (textSpan && !btn.hasAttribute('data-original-text')) {
      btn.setAttribute('data-original-text', textSpan.textContent.trim());
    }

    // Attach click listener
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline-card');
      if (!card) return;

      const details = card.querySelector('.timeline-details');
      if (!details) return;

      const icon = btn.querySelector('.toggle-icon');
      const textSpan = btn.querySelector('.toggle-text');

      const isOpen = details.classList.contains('open');

      if (isOpen) {
        // Collapse
        details.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        
        if (icon) {
          icon.className = 'toggle-icon fas fa-chevron-down text-xs transition-transform duration-300';
        }
        if (textSpan) {
          const originalText = btn.getAttribute('data-original-text') || 'Expand Details';
          textSpan.textContent = originalText;
        }
      } else {
        // Expand
        details.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        
        if (icon) {
          icon.className = 'toggle-icon fas fa-chevron-up text-xs transition-transform duration-300';
        }
        if (textSpan) {
          textSpan.textContent = 'Collapse Details';
        }
      }
    });
  });
}

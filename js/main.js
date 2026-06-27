/**
 * Thongchan Thananate Portfolio - Interactivity Engine
 * Handles Theme Switching, Project Filtering, Accordion Disclosures, Scroll Spy, and Mobile Nav.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initTimelineAccordion();
  initProjectFiltering();
  initScrollSpy();
  initCurrentYear();
});

/* ==========================================================================
   1. Dark / Light Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const htmlEl = document.documentElement;

  // Check stored theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (htmlEl.classList.contains('dark')) {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  });
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   3. Interactive Timeline Expand / Collapse (Disclosure Pattern)
   ========================================================================== */
function initTimelineAccordion() {
  const toggleBtns = document.querySelectorAll('.timeline-toggle');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.timeline-card');
      const details = card.querySelector('.timeline-details');
      const icon = btn.querySelector('.toggle-icon');
      const textSpan = btn.querySelector('.toggle-text');

      const isOpen = details.classList.contains('open');

      if (isOpen) {
        details.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (icon) icon.className = 'toggle-icon fas fa-chevron-down text-xs transition-transform duration-300';
        if (textSpan) textSpan.textContent = 'Expand Details & ROI Metrics';
      } else {
        details.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.className = 'toggle-icon fas fa-chevron-up text-xs transition-transform duration-300';
        if (textSpan) textSpan.textContent = 'Collapse Details';
      }
    });
  });
}

/* ==========================================================================
   4. Portfolio Dynamic Tag Filtering
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'dark:bg-indigo-600');
        b.classList.add('bg-slate-200', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      });

      btn.classList.remove('bg-slate-200', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      btn.classList.add('bg-indigo-600', 'text-white', 'dark:bg-indigo-600');

      // Filter cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Scroll Spy & Active Navigation Indicator
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

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
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   6. Dynamic Footer Year
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

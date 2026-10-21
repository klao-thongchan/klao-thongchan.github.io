/** Test portfolio: native disclosures, hiring perspectives, and isolated preferences. */
import { BUILD_META } from './version-meta.js';
import { initTheme } from './theme.js';
import { initCurrentYear, initVersionIndicator } from './utilities.js';

const perspectives = {
  all: { description: 'A connected view of technical implementation, product delivery, and commercial thinking.', order: ['launch', 'analytics', 'ai'] },
  engineering: { description: 'For Forward Deployed Engineer and Solutions Engineer roles: explore AI research, data workflows, and integration delivery.', order: ['ai', 'analytics', 'launch'] },
  product: { description: 'For Product Manager and Technical Product Manager roles: explore launch ownership, commercial analytics, and AI product thinking.', order: ['launch', 'analytics', 'ai'] },
};

initTheme();
initCurrentYear();
initVersionIndicator();
document.getElementById('preview-version').textContent = `Portfolio / ${BUILD_META.version}`;
const themeButton = document.querySelector('.theme-toggle');
function syncThemeLabel() {
  themeButton.setAttribute('aria-label', document.documentElement.classList.contains('dark') ? 'Switch to light theme' : 'Switch to dark theme');
}
syncThemeLabel();
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('klao:test:theme', dark ? 'dark' : 'light'); } catch { /* The visual choice still works without persistent storage. */ }
  syncThemeLabel();
});

const roleButtons = document.querySelectorAll('[data-role]');
const caseList = document.querySelector('.case-list');
const cards = new Map([...caseList.children].map(card => [card.dataset.case, card]));
function applyPerspective(role) {
  const selected = Object.hasOwn(perspectives, role) ? role : 'all';
  roleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.role === selected)));
  document.getElementById('role-description').textContent = perspectives[selected].description;
  perspectives[selected].order.forEach(id => caseList.append(cards.get(id)));
}
function readPerspective() { applyPerspective(new URL(location.href).searchParams.get('role')); }
roleButtons.forEach(button => button.addEventListener('click', () => {
  const url = new URL(location.href);
  if (button.dataset.role === 'all') url.searchParams.delete('role');
  else url.searchParams.set('role', button.dataset.role);
  history.pushState(null, '', url);
  applyPerspective(button.dataset.role);
}));
window.addEventListener('popstate', readPerspective);
readPerspective();

// A shared project anchor opens its walkthrough, including when reached from another section.
function openLinkedProject() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  if (target?.matches('.case-card')) target.querySelector('details').open = true;
}
window.addEventListener('hashchange', openLinkedProject);
openLinkedProject();

// Optional decoration loads independently of the portfolio controls.
import('./cursor-field.js').then(({ initCursorField }) => initCursorField()).catch(() => {});

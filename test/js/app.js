/** Test portfolio: native disclosures, hiring perspectives, bilingual i18n, and isolated preferences. */
import { BUILD_META } from './version-meta.js';
import { initTheme } from './theme.js';
import { initCurrentYear, initVersionIndicator } from './utilities.js';
import { initI18n, getPerspectiveDescription, syncLocalizedThemeLabel } from './i18n.js';

const perspectives = {
  all: { order: ['launch', 'analytics', 'ai'] },
  engineering: { order: ['ai', 'analytics', 'launch'] },
  product: { order: ['launch', 'analytics', 'ai'] },
};

initTheme();
initCurrentYear();
initVersionIndicator();
initI18n('portfolio');

document.getElementById('preview-version').textContent = `Portfolio / ${BUILD_META.version}`;
const themeButton = document.querySelector('.theme-toggle');
syncLocalizedThemeLabel();
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('klao:test:theme', dark ? 'dark' : 'light'); } catch { /* The visual choice still works without persistent storage. */ }
  syncLocalizedThemeLabel();
});

const roleButtons = document.querySelectorAll('[data-role]');
const caseList = document.querySelector('.case-list');
const cards = new Map([...caseList.children].map(card => [card.dataset.case, card]));
let activeRole = 'all';

function applyPerspective(role) {
  const selected = Object.hasOwn(perspectives, role) ? role : 'all';
  activeRole = selected;
  roleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.role === selected)));
  document.getElementById('role-description').textContent = getPerspectiveDescription(selected);
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
window.addEventListener('klao:langchange', () => {
  document.getElementById('role-description').textContent = getPerspectiveDescription(activeRole);
});
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

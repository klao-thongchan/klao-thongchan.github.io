/** Test solutions portfolio: native disclosures and isolated preferences. */
import { BUILD_META } from './version-meta.js';
import { initTheme } from './theme.js';
import { initCurrentYear, initVersionIndicator } from './utilities.js';

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

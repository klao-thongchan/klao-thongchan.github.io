/** Test capabilities showcase: domain filtering, deep-link awareness, bilingual i18n, and isolated preferences. */
import { BUILD_META } from './version-meta.js';
import { initTheme } from './theme.js';
import { initCurrentYear, initVersionIndicator } from './utilities.js';
import { initI18n, getDomainDescription, syncLocalizedThemeLabel } from './i18n.js';

const validDomains = new Set(['all', 'ai', 'analytics', 'launch', 'architecture']);

initTheme();
initCurrentYear();
initVersionIndicator();
initI18n('capabilities');

const previewVer = document.getElementById('preview-version');
if (previewVer) {
  previewVer.textContent = `Capabilities / ${BUILD_META.version}`;
}

const themeButton = document.querySelector('.theme-toggle');
syncLocalizedThemeLabel();

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('klao:test:theme', dark ? 'dark' : 'light');
    } catch {
      /* The visual choice still works without persistent storage. */
    }
    syncLocalizedThemeLabel();
  });
}

const domainButtons = document.querySelectorAll('[data-domain]');
const showcaseCards = document.querySelectorAll('.showcase-card[data-capability-domain]');
const domainDescEl = document.getElementById('domain-description');
let activeDomain = 'all';

function applyDomainFilter(domain) {
  const selected = validDomains.has(domain) ? domain : 'all';
  activeDomain = selected;
  domainButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.domain === selected));
  });
  if (domainDescEl) {
    domainDescEl.textContent = getDomainDescription(selected);
  }
  showcaseCards.forEach(card => {
    const matches = selected === 'all' || card.dataset.capabilityDomain === selected;
    card.hidden = !matches;
  });
}

function readDomainFromUrl() {
  const params = new URL(location.href).searchParams;
  applyDomainFilter(params.get('domain'));
}

domainButtons.forEach(button => {
  button.addEventListener('click', () => {
    const url = new URL(location.href);
    if (button.dataset.domain === 'all') {
      url.searchParams.delete('domain');
    } else {
      url.searchParams.set('domain', button.dataset.domain);
    }
    history.pushState(null, '', url);
    applyDomainFilter(button.dataset.domain);
  });
});

function revealHashTarget() {
  const id = location.hash.slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (target && target.classList.contains('showcase-card') && target.hidden) {
    applyDomainFilter('all');
  }
}

window.addEventListener('popstate', readDomainFromUrl);
window.addEventListener('hashchange', revealHashTarget);
window.addEventListener('klao:langchange', () => {
  if (domainDescEl) {
    domainDescEl.textContent = getDomainDescription(activeDomain);
  }
});
readDomainFromUrl();
revealHashTarget();

// Optional decoration loads independently of the page controls.
import('./cursor-field.js').then(({ initCursorField }) => initCursorField()).catch(() => {});

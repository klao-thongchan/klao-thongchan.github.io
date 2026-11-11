/** Test capabilities showcase: domain filtering, deep-link awareness, and isolated preferences. */
import { BUILD_META } from './version-meta.js';
import { initTheme } from './theme.js';
import { initCurrentYear, initVersionIndicator } from './utilities.js';

const domainDescriptions = {
  all: 'Showing all 4 capability pillars with visual previews, deliverables, and system workflow diagrams.',
  ai: 'Applied AI & Agentic Systems: retrieval-augmented generation (RAG), OpenAI/n8n orchestration, evaluation harnesses, and human-in-the-loop guardrails.',
  analytics: 'Data & ML Analytics: behavioral user segmentation (9 clusters / 100M+ users), BigQuery/SQL/Python ETL pipelines, and acquisition cost optimization.',
  launch: 'Product Launch & Integrations: end-to-end market readiness, multi-language localization workflows, cross-team UAT, and third-party payment gateways.',
  architecture: 'Cloud Infrastructure & Zero-Trust Architecture: NGINX/Cloudflare edge filtering, Node.js 22 LTS stateless HMAC services, and parameterized data layers.'
};

initTheme();
initCurrentYear();
initVersionIndicator();

const previewVer = document.getElementById('preview-version');
if (previewVer) {
  previewVer.textContent = `Capabilities / ${BUILD_META.version}`;
}

const themeButton = document.querySelector('.theme-toggle');
function syncThemeLabel() {
  if (!themeButton) return;
  themeButton.setAttribute(
    'aria-label',
    document.documentElement.classList.contains('dark') ? 'Switch to light theme' : 'Switch to dark theme'
  );
}
syncThemeLabel();

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('klao:test:theme', dark ? 'dark' : 'light');
    } catch {
      /* The visual choice still works without persistent storage. */
    }
    syncThemeLabel();
  });
}

const domainButtons = document.querySelectorAll('[data-domain]');
const showcaseCards = document.querySelectorAll('.showcase-card[data-capability-domain]');
const domainDescEl = document.getElementById('domain-description');

function applyDomainFilter(domain) {
  const selected = Object.hasOwn(domainDescriptions, domain) ? domain : 'all';
  domainButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.domain === selected));
  });
  if (domainDescEl) {
    domainDescEl.textContent = domainDescriptions[selected];
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
readDomainFromUrl();
revealHashTarget();

// Optional decoration loads independently of the page controls.
import('./cursor-field.js').then(({ initCursorField }) => initCursorField()).catch(() => {});

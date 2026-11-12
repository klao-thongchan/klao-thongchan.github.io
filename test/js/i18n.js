/**
 * Bilingual (Thai / English) Localization & Language Switcher Module (Test Environment).
 *
 * Handles browser language negotiation (navigator.languages / navigator.language),
 * isolated localStorage persistence ('klao:test:lang'), URL query overrides (?lang=th|en),
 * DOM and SVG diagram localization, and accessible language toggle controls.
 *
 * @module i18n
 */

'use strict';

import { TRANSLATIONS } from './i18n-data.js';

const STORAGE_KEY = 'klao:test:lang';
const SUPPORTED_LANGS = new Set(['en', 'th']);

let currentLang = 'en';
let activeNamespace = 'portfolio';
let domCacheInitialized = false;

const initialTextCache = new WeakMap();
const initialHtmlCache = new WeakMap();
const initialAriaCache = new WeakMap();
const initialAltCache = new WeakMap();
const initialSvgCache = new WeakMap();
let initialTitle = '';
let initialMetaDesc = '';

/**
 * Negotiates the default language from the browser's language settings.
 * Checks `navigator.languages` in priority order before falling back to `navigator.language`.
 *
 * @returns {'en' | 'th'}
 */
export function detectBrowserLanguage() {
  try {
    const candidates = Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : (navigator.language ? [navigator.language] : []);

    for (const rawLocale of candidates) {
      if (typeof rawLocale !== 'string') continue;
      const normalized = rawLocale.trim().toLowerCase();
      if (normalized === 'th' || normalized.startsWith('th-')) {
        return 'th';
      }
      if (normalized === 'en' || normalized.startsWith('en-')) {
        return 'en';
      }
    }
  } catch {
    // Default safely to English if navigator is unavailable
  }
  return 'en';
}

/**
 * Determines the initial language using priority:
 * 1. URL query parameter (`?lang=th` or `?lang=en`)
 * 2. Isolated localStorage preference (`klao:test:lang`)
 * 3. Browser language preference (`detectBrowserLanguage()`)
 *
 * @returns {{ lang: 'en' | 'th', fromUrl: boolean }}
 */
export function detectInitialLanguage() {
  try {
    const urlLang = new URL(window.location.href).searchParams.get('lang');
    if (urlLang && SUPPORTED_LANGS.has(urlLang.toLowerCase())) {
      return { lang: /** @type {'en'|'th'} */ (urlLang.toLowerCase()), fromUrl: true };
    }
  } catch {
    // Ignore URL parsing errors
  }

  try {
    const rawSaved = localStorage.getItem(STORAGE_KEY);
    if (rawSaved && SUPPORTED_LANGS.has(rawSaved)) {
      return { lang: /** @type {'en'|'th'} */ (rawSaved), fromUrl: false };
    } else if (rawSaved !== null) {
      console.warn(`[i18n] Corrupted language storage value discarded: "${rawSaved}"`);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage access blocked; fall back to browser language
  }

  return { lang: detectBrowserLanguage(), fromUrl: false };
}

/**
 * Caches the initial English DOM text, markup, and attributes before first translation
 * so switching back to English ('en') is 100% lossless.
 */
function cacheInitialDomState() {
  if (domCacheInitialized) return;
  domCacheInitialized = true;

  initialTitle = document.title;
  const metaDescEl = document.querySelector('meta[name="description"]');
  if (metaDescEl) {
    initialMetaDesc = metaDescEl.getAttribute('content') || '';
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    initialTextCache.set(el, el.textContent);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    initialHtmlCache.set(el, el.innerHTML);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    initialAriaCache.set(el, el.getAttribute('aria-label') || '');
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    initialAltCache.set(el, el.getAttribute('alt') || '');
  });

  document.querySelectorAll('img[data-i18n-svg]').forEach(img => {
    initialSvgCache.set(img, img.getAttribute('src') || '');
  });
}

/**
 * Resolves a translation string for the active page namespace or common namespace.
 *
 * @param {string} key
 * @param {'en' | 'th'} lang
 * @returns {string | null}
 */
function lookupTranslation(key, lang) {
  const dict = TRANSLATIONS[lang];
  if (!dict) return null;
  if (dict[activeNamespace] && Object.hasOwn(dict[activeNamespace], key)) {
    return dict[activeNamespace][key];
  }
  if (dict.common && Object.hasOwn(dict.common, key)) {
    return dict.common[key];
  }
  return null;
}

/**
 * Returns the currently active language code ('en' or 'th').
 *
 * @returns {'en' | 'th'}
 */
export function getCurrentLanguage() {
  return currentLang;
}

/**
 * Returns a localized UI string (such as theme toggle or version aria-label).
 *
 * @param {string} key
 * @param {'en' | 'th'} [lang]
 * @returns {string}
 */
export function getUiString(key, lang = currentLang) {
  return TRANSLATIONS[lang]?.ui?.[key] ?? TRANSLATIONS.en.ui[key] ?? '';
}

/**
 * Returns the localized perspective description for `test/index.html`.
 *
 * @param {string} role
 * @param {'en' | 'th'} [lang]
 * @returns {string}
 */
export function getPerspectiveDescription(role, lang = currentLang) {
  return TRANSLATIONS[lang]?.perspectives?.[role] ?? TRANSLATIONS.en.perspectives[role] ?? '';
}

/**
 * Returns the localized capability domain description for `test/capabilities/index.html`.
 *
 * @param {string} domain
 * @param {'en' | 'th'} [lang]
 * @returns {string}
 */
export function getDomainDescription(domain, lang = currentLang) {
  return TRANSLATIONS[lang]?.domains?.[domain] ?? TRANSLATIONS.en.domains[domain] ?? '';
}

/**
 * Synchronizes the accessible label on `.theme-toggle` controls in the current language.
 */
export function syncLocalizedThemeLabel() {
  const isDark = document.documentElement.classList.contains('dark');
  const label = isDark ? getUiString('theme_to_light') : getUiString('theme_to_dark');
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', label);
  });
}

/**
 * Synchronizes all `.lang-toggle` buttons with the active language state.
 */
function syncLangToggleButtons() {
  const nextLabel = currentLang === 'th' ? getUiString('lang_to_en', 'th') : getUiString('lang_to_th', 'en');
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.setAttribute('aria-label', nextLabel);
    btn.setAttribute('data-active-lang', currentLang);
    btn.querySelectorAll('[data-lang-opt]').forEach(opt => {
      const isCurrent = opt.getAttribute('data-lang-opt') === currentLang;
      opt.classList.toggle('active', isCurrent);
    });
  });
}

/**
 * Applies the specified language ('en' or 'th') across the document, inline SVGs,
 * external SVG diagrams, and metadata.
 *
 * @param {'en' | 'th'} lang
 * @param {{ persist?: boolean }} [options]
 * @returns {void}
 */
export function applyLanguage(lang, { persist = false } = {}) {
  const validLang = SUPPORTED_LANGS.has(lang) ? lang : 'en';
  cacheInitialDomState();
  currentLang = validLang;

  // 1. Update <html lang="...">
  document.documentElement.setAttribute('lang', validLang);

  // 2. Update document title & meta description
  const metaTitleKey = `${activeNamespace}_title`;
  const metaDescKey = `${activeNamespace}_desc`;
  if (validLang === 'th' && TRANSLATIONS.th.meta[metaTitleKey]) {
    document.title = TRANSLATIONS.th.meta[metaTitleKey];
  } else if (initialTitle) {
    document.title = initialTitle;
  }

  const metaDescEl = document.querySelector('meta[name="description"]');
  if (metaDescEl) {
    if (validLang === 'th' && TRANSLATIONS.th.meta[metaDescKey]) {
      metaDescEl.setAttribute('content', TRANSLATIONS.th.meta[metaDescKey]);
    } else if (initialMetaDesc) {
      metaDescEl.setAttribute('content', initialMetaDesc);
    }
  }

  // 3. Update plain text elements ([data-i18n]) including SVG <title> and <text>
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (validLang === 'th') {
      const translated = lookupTranslation(key, 'th');
      if (translated !== null) {
        // Unescape &amp; / &lt; / &gt; for textContent assignment
        el.textContent = translated
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      }
    } else if (initialTextCache.has(el)) {
      el.textContent = initialTextCache.get(el);
    }
  });

  // 4. Update trusted static HTML elements ([data-i18n-html])
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (validLang === 'th') {
      const translated = lookupTranslation(key, 'th');
      if (translated !== null) {
        el.innerHTML = translated;
      }
    } else if (initialHtmlCache.has(el)) {
      el.innerHTML = initialHtmlCache.get(el);
    }
  });

  // 5. Update accessible labels ([data-i18n-aria-label])
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (validLang === 'th') {
      const translated = lookupTranslation(key, 'th');
      if (translated !== null) {
        el.setAttribute('aria-label', translated.replace(/&amp;/g, '&'));
      }
    } else if (initialAriaCache.has(el)) {
      el.setAttribute('aria-label', initialAriaCache.get(el));
    }
  });

  // 6. Update image alt texts ([data-i18n-alt])
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (validLang === 'th') {
      const translated = lookupTranslation(key, 'th');
      if (translated !== null) {
        el.setAttribute('alt', translated.replace(/&amp;/g, '&'));
      }
    } else if (initialAltCache.has(el)) {
      el.setAttribute('alt', initialAltCache.get(el));
    }
  });

  // 7. Swap localized SVG showcase diagrams (img[data-i18n-svg])
  document.querySelectorAll('img[data-i18n-svg]').forEach(img => {
    const enSrc = initialSvgCache.get(img) || img.getAttribute('data-i18n-svg') || '';
    if (validLang === 'th' && enSrc.endsWith('.svg') && !enSrc.endsWith('-th.svg')) {
      img.setAttribute('src', enSrc.replace(/\.svg$/, '-th.svg'));
    } else if (enSrc) {
      img.setAttribute('src', enSrc);
    }
  });

  // 8. Sync language toggle buttons, theme toggle aria-label, and version footer aria-label
  syncLangToggleButtons();
  syncLocalizedThemeLabel();

  const versionEl = document.querySelector('.site-version');
  if (versionEl) {
    versionEl.setAttribute('aria-label', getUiString('version_aria', validLang));
  }

  // 9. Persist preference to isolated test localStorage key when requested
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, validLang);
    } catch {
      // Visual language switch still works when storage is restricted
    }
  }

  // 10. Notify page controllers (e.g. role perspective / domain filter descriptions)
  window.dispatchEvent(new CustomEvent('klao:langchange', { detail: { lang: validLang } }));
}

/**
 * Initializes bilingual localization and connects `.lang-toggle` buttons.
 *
 * @param {'portfolio' | 'capabilities' | 'cv'} [pageNamespace='portfolio']
 * @returns {'en' | 'th'} The resolved initial language.
 */
export function initI18n(pageNamespace = 'portfolio') {
  activeNamespace = pageNamespace;
  cacheInitialDomState();

  const { lang, fromUrl } = detectInitialLanguage();
  applyLanguage(lang, { persist: fromUrl });

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextLang = currentLang === 'th' ? 'en' : 'th';
      applyLanguage(nextLang, { persist: true });
    });
  });

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY && event.newValue && SUPPORTED_LANGS.has(event.newValue)) {
      if (event.newValue !== currentLang) {
        applyLanguage(/** @type {'en'|'th'} */ (event.newValue), { persist: false });
      }
    }
  });

  return currentLang;
}

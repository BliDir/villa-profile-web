import en from '../locales/en.json';
import id from '../locales/id.json';

const LOCALES = { en, id };
const STORAGE_KEY = 'villa-locale';
const SUPPORTED = ['en', 'id'];

function getLocale() {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param && SUPPORTED.includes(param)) return param;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  return 'en';
}

function t(key) {
  const locale = getLocale();
  const dict = LOCALES[locale] ?? LOCALES.en;
  const parts = key.split('.');
  let val = dict;
  for (const p of parts) val = val?.[p];
  if (val === undefined) {
    let fallback = LOCALES.en;
    for (const p of parts) fallback = fallback?.[p];
    return fallback ?? key;
  }
  return val;
}

function applyTranslations() {
  const locale = getLocale();
  document.documentElement.lang = locale;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'TITLE') {
      document.title = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  updateSwitcher(locale);
}

function updateSwitcher(locale) {
  document.querySelectorAll('.lang-switcher__option').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === locale);
    btn.setAttribute('aria-pressed', btn.dataset.lang === locale ? 'true' : 'false');
  });
}

function setLocale(locale) {
  if (!SUPPORTED.includes(locale)) return;
  localStorage.setItem(STORAGE_KEY, locale);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  history.replaceState(null, '', url.toString());
  applyTranslations();
}

function addHreflang() {
  const base = window.location.pathname;
  SUPPORTED.forEach(lang => {
    const existing = document.querySelector(`link[hreflang="${lang}"]`);
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    link.href = url.toString();
    document.head.appendChild(link);
  });
  const xDefault = document.createElement('link');
  xDefault.rel = 'alternate';
  xDefault.hreflang = 'x-default';
  xDefault.href = window.location.origin + base;
  document.head.appendChild(xDefault);
}

export { t };

export function initI18n() {
  addHreflang();
  applyTranslations();

  document.querySelectorAll('.lang-switcher__option').forEach(btn => {
    btn.addEventListener('click', () => setLocale(btn.dataset.lang));
  });
}

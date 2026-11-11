/* Static links, search form and footer are present in the HTML of every permalink. */
(() => {
  const header = document.getElementById('sm-article-header');
  if (!header) return;
  const panel = header.querySelector('.smx-panel');
  const menu = header.querySelector('.smx-menu');
  const search = header.querySelector('input[type="search"]');
  const labels = [...header.querySelectorAll('[data-sm-en-label]')].map(el => [el, el.getAttribute('aria-label'), el.dataset.smEnLabel]);
  const es = document.getElementById('btn-es'), en = document.getElementById('btn-en');
  function syncLanguage() {
    const english = document.body.classList.contains('show-en');
    es.setAttribute('aria-pressed', String(!english));
    en.setAttribute('aria-pressed', String(english));
    labels.forEach(([el, spanish, translated]) => el.setAttribute('aria-label', english ? translated : spanish));
    search.placeholder = english ? 'Search…' : 'Buscar…';
  }
  function selectLanguage(lang) {
    if (typeof window.setLang === 'function') window.setLang(lang);
    syncLanguage();
  }
  es.addEventListener('click', () => selectLanguage('es'));
  en.addEventListener('click', () => selectLanguage('en'));
  const fromLink = new URLSearchParams(location.search).get('lang');
  if (fromLink === 'es' || fromLink === 'en') selectLanguage(fromLink);
  else syncLanguage();
  header.classList.add('smx-ready');
  function setMenu(open) {
    header.classList.toggle('smx-open', open);
    menu.setAttribute('aria-expanded', String(open));
  }
  menu.addEventListener('click', () => {
    const open = !header.classList.contains('smx-open');
    setMenu(open);
    if (open) panel.querySelector('a').focus();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('smx-open')) {
      setMenu(false); menu.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) setMenu(false);
  });
  header.addEventListener('focusout', e => {
    if (e.relatedTarget && !header.contains(e.relatedTarget)) setMenu(false);
  });
  window.matchMedia('(max-width:760px)').addEventListener('change', () => setMenu(false));
  header.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const q = search.value.trim();
    if (!q) { search.focus(); return; }
    window.location.assign('/?lang=' + (document.documentElement.lang === 'en' ? 'en' : 'es') + '#/buscar/' + encodeURIComponent(q));
  });
})();

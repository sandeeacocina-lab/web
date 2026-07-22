(function () {
  'use strict';

  var GA_ID = 'G-27S0EYQ2MR';
  var CONSENT_KEY = 'sm-cookie-consent-v1';
  var BANNER_ID = 'sm-cookie-banner';

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (window.__smAnalyticsLoaded) return;
    window.__smAnalyticsLoaded = true;
    window['ga-disable-' + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
  }

  function disableAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    var names = document.cookie ? document.cookie.split(';') : [];
    for (var i = 0; i < names.length; i++) {
      var name = names[i].split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + location.hostname + '; SameSite=Lax';
      }
    }
  }

  function removeBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
  }

  function choose(value) {
    saveConsent(value);
    if (value === 'accepted') loadAnalytics();
    else disableAnalytics();
    removeBanner();
  }

  function showBanner() {
    removeBanner();

    var banner = document.createElement('section');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'sm-cookie-title');
    banner.setAttribute('aria-describedby', 'sm-cookie-copy');
    banner.innerHTML =
      '<div class="sm-cookie-inner">' +
        '<div class="sm-cookie-copy">' +
          '<h2 id="sm-cookie-title">Tu privacidad</h2>' +
          '<p id="sm-cookie-copy">Usamos Google Analytics únicamente si nos das permiso. Puedes aceptar o rechazar la analítica; el contenido educativo y los recursos incrustados seguirán disponibles.</p>' +
          '<a href="/privacidad/">Más información sobre privacidad y cookies</a>' +
        '</div>' +
        '<div class="sm-cookie-actions">' +
          '<button type="button" data-cookie-reject>Rechazar</button>' +
          '<button type="button" data-cookie-accept>Aceptar</button>' +
        '</div>' +
      '</div>';

    var style = document.getElementById('sm-cookie-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'sm-cookie-style';
      style.textContent =
        '#sm-cookie-banner{position:fixed;z-index:2147483646;left:16px;right:16px;bottom:16px;margin:auto;max-width:980px;background:#fff;color:#26343b;border:1px solid #cfe0e6;border-radius:14px;box-shadow:0 18px 55px rgba(22,36,42,.26);font-family:"Source Sans 3",system-ui,sans-serif}' +
        '#sm-cookie-banner *{box-sizing:border-box}' +
        '.sm-cookie-inner{display:flex;align-items:center;gap:28px;padding:22px 24px}' +
        '.sm-cookie-copy{flex:1 1 520px}.sm-cookie-copy h2{margin:0 0 6px;font:700 24px/1.15 "Zilla Slab",Georgia,serif;color:#1f2a30}.sm-cookie-copy p{margin:0 0 8px;font-size:15px;line-height:1.5;color:#52636d}.sm-cookie-copy a{color:#147f8d;font-weight:700;text-underline-offset:3px}' +
        '.sm-cookie-actions{display:flex;gap:10px;flex:0 0 auto}.sm-cookie-actions button{min-width:118px;border:0;border-radius:999px;padding:12px 20px;color:#fff;font:700 14px "Source Sans 3",system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 16px rgba(31,42,48,.18)}.sm-cookie-actions [data-cookie-reject]{background:#1f2a30}.sm-cookie-actions [data-cookie-accept]{background:#1f94a3}.sm-cookie-actions button:focus-visible{outline:3px solid #e85c6c;outline-offset:3px}' +
        '@media(max-width:720px){#sm-cookie-banner{left:10px;right:10px;bottom:10px}.sm-cookie-inner{align-items:stretch;flex-direction:column;gap:16px;padding:19px}.sm-cookie-actions{width:100%}.sm-cookie-actions button{flex:1;min-width:0}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-reject]').addEventListener('click', function () { choose('rejected'); });
    banner.querySelector('[data-cookie-accept]').addEventListener('click', function () { choose('accepted'); });
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest && event.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    event.preventDefault();
    showBanner();
  });

  var consent = getConsent();
  if (consent === 'accepted') loadAnalytics();
  else disableAnalytics();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (!consent) showBanner();
    });
  } else if (!consent) {
    showBanner();
  }
})();

(() => {
  'use strict';
  let modal;
  let returnFocus;
  function imageModal() {
    if (modal) return modal;
    modal = document.createElement('dialog');
    modal.id = 'sm-teaching-gallery';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Cerrar imagen';
    const picture = document.createElement('img');
    picture.alt = '';
    modal.append(close, picture);
    document.body.appendChild(modal);
    close.addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => {
      if (event.target === modal) modal.close();
    });
    modal.addEventListener('close', () => {
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    });
    return modal;
  }
  document.addEventListener('click', event => {
    const button = event.target.closest && event.target.closest('.teaching-article .image-button');
    if (!button) return;
    const picture = button.querySelector('img');
    const dialog = imageModal();
    const language = button.closest('[lang]');
    const english = language && language.lang === 'en';
    dialog.setAttribute('aria-label', english ? 'Enlarged image' : 'Imagen ampliada');
    dialog.querySelector('button').textContent = english ? 'Close image' : 'Cerrar imagen';
    dialog.querySelector('img').src = picture.src;
    dialog.querySelector('img').alt = picture.alt;
    returnFocus = button;
    dialog.showModal();
  });
  function initialise() {
    document.querySelectorAll('.teaching-article .carousel:not([data-ready])').forEach(carousel => {
      carousel.dataset.ready = 'true';
      const track = carousel.querySelector('.slides');
      const items = [...carousel.querySelectorAll('.slide')];
      const tabs = [...carousel.querySelectorAll('.slide-tab')];
      const prev = carousel.querySelector('.carousel-prev');
      const next = carousel.querySelector('.carousel-next');
      const count = carousel.querySelector('.slide-counter');
      let current = 0;
      let ticking = false;
      function update(index) {
        current = Math.max(0, Math.min(items.length - 1, index));
        tabs.forEach((tab, i) => tab.setAttribute('aria-current', String(i === current)));
        prev.disabled = current === 0;
        next.disabled = current === items.length - 1;
        const label = (current + 1) + ' / ' + items.length + ' · ' + tabs[current].textContent;
        if (count.textContent !== label) count.textContent = label;
      }
      function go(index) {
        const target = Math.max(0, Math.min(items.length - 1, index));
        update(target);
        track.scrollTo({ left: target * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
      tabs.forEach((tab, i) => tab.addEventListener('click', () => go(i)));
      prev.addEventListener('click', () => go(current - 1));
      next.addEventListener('click', () => go(current + 1));
      track.addEventListener('scroll', () => {
        if (!ticking && track.clientWidth > 0) {
          ticking = true;
          requestAnimationFrame(() => {
            if (track.clientWidth > 0) update(Math.round(track.scrollLeft / track.clientWidth));
            ticking = false;
          });
        }
      }, { passive: true });
      track.addEventListener('keydown', event => {
        let target = null;
        if (event.key === 'ArrowRight') target = current + 1;
        else if (event.key === 'ArrowLeft') target = current - 1;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = items.length - 1;
        if (target !== null) { event.preventDefault(); go(target); }
      });
      if ('ResizeObserver' in window) {
        new ResizeObserver(() => {
          if (track.clientWidth > 0) track.scrollTo({ left: current * track.clientWidth, behavior: 'instant' });
        }).observe(track);
      }
      update(0);
    });
  }
  function start() {
    initialise();
    let scheduled = false;
    new MutationObserver(records => {
      if (!scheduled && records.some(record => [...record.addedNodes].some(node => node.nodeType === 1))) {
        scheduled = true;
        requestAnimationFrame(() => { scheduled = false; initialise(); });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

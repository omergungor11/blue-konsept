(() => {

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[fs-list-element="filters"]');
  const list = document.querySelector('[fs-list-element="list"]');
  if (!form || !list) return;

  const EASE = {
    ease: 'ease',
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    inQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
    inOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.dropdown2_component.is-filters5').forEach((dd) => {
    const toggle = dd.querySelector('.w-dropdown-toggle');
    const ddList = dd.querySelector('.w-dropdown-list');
    const icon = dd.querySelector('.dropdown-chevron-plus');
    if (!toggle || !ddList) return;

    let isOpen = false, iconAnim, opAnim, trAnim, hideTimer;
    const cur = (el, p) => getComputedStyle(el)[p];

    const rotate = (deg, duration, easing, fromDeg) => {
      if (!icon) return;
      const t = cur(icon, 'transform');
      const from = fromDeg !== undefined ? `rotate(${fromDeg}deg)` : (t === 'none' ? 'rotate(0deg)' : t);
      if (iconAnim) iconAnim.cancel();
      iconAnim = icon.animate([{ transform: from }, { transform: `rotate(${deg}deg)` }],
        { duration, easing, fill: 'both' });
    };

    const animList = (op, opDur, opEase, y, yDur, yEase, yDelay = 0) => {
      const fromOp = cur(ddList, 'opacity');
      const t = cur(ddList, 'transform');
      if (opAnim) opAnim.cancel();
      if (trAnim) trAnim.cancel();
      opAnim = ddList.animate([{ opacity: fromOp }, { opacity: op }],
        { duration: opDur, easing: opEase, fill: 'both' });
      trAnim = ddList.animate(
        [{ transform: t === 'none' ? 'translate3d(0,0,0)' : t }, { transform: `translate3d(0,${y}rem,0)` }],
        { duration: yDur, easing: yEase, delay: yDelay, fill: 'both' });
    };

    const open = () => {
      if (isOpen) return;
      isOpen = true;
      clearTimeout(hideTimer);
      ddList.classList.add('is-visible');
      rotate(45, 200, EASE.ease);
      animList(1, 200, EASE.ease, 0, 500, EASE.outQuart);
    };
    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      rotate(0, 200, EASE.ease);
      animList(0, 200, EASE.ease, 3, 300, EASE.inQuart, 200);
      hideTimer = setTimeout(() => { if (!isOpen) ddList.classList.remove('is-visible'); }, 500);
    };

    new MutationObserver(() => {
      toggle.classList.contains('w--open') ? open() : close();
    }).observe(toggle, { attributes: true, attributeFilter: ['class'] });

    dd.addEventListener('mouseenter', () => { if (!isOpen) rotate(90, 500, EASE.inOutQuart, 0); });
    dd.addEventListener('mouseleave', () => { if (!isOpen) rotate(0, 500, EASE.inOutQuart); });
  });

  const clearAllBtn = document.querySelector('.clear-link[fs-list-element="clear"]');
  const syncUI = () => {
    form.querySelectorAll('input[type="checkbox"]').forEach((i) => {
      const ic = i.parentElement.querySelector('.w-checkbox-input');
      if (ic) ic.classList.toggle('w--redirected-checked', i.checked);
    });
    if (clearAllBtn) clearAllBtn.classList.toggle('is-visible', !!form.querySelector('input:checked'));
  };
  syncUI();
  setTimeout(syncUI, 1000); 

  const OUT = reduceMotion ? 0 : 250;
  let listFade = null, safety, bypassUntil = 0;

  const fadeOut = () => {
    if (reduceMotion) return;
    if (listFade) listFade.cancel();
    listFade = list.animate([{ opacity: getComputedStyle(list).opacity }, { opacity: 0 }],
      { duration: OUT, easing: 'ease', fill: 'forwards' });
  };
  const restoreList = () => {
    clearTimeout(safety);
    if (listFade) { listFade.cancel(); listFade = null; }
  };
  const later = (fn) => {
    fadeOut();
    setTimeout(() => {
      bypassUntil = Date.now() + 600;
      fn();
      setTimeout(syncUI, 100);
      safety = setTimeout(restoreList, 400);
    }, OUT);
  };

  ['input', 'change'].forEach((type) =>
    window.addEventListener(type, (e) => {
      if (Date.now() < bypassUntil || !e.isTrusted) return;
      if (!form.contains(e.target) || e.target.type !== 'checkbox') return;
      e.stopImmediatePropagation();
      syncUI(); 
      if (type === 'change') later(() => {
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        e.target.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }, true)
  );

  window.addEventListener('click', (e) => {
    if (Date.now() < bypassUntil || !e.isTrusted) return;
    const btn = e.target.closest('[fs-list-element="clear"]');
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    later(() => btn.click());
  }, true);

  let added = [], removed = false, timer;
  const animateIn = () => {
    restoreList();
    syncUI();
    if (!reduceMotion) {
      const cards = removed ? [...list.children] : added.filter((n) => n.isConnected);
      cards.forEach((card, i) => {
        card.getAnimations().forEach((a) => a.cancel());
        card.animate(
          [
            { opacity: 0, transform: 'translate3d(0, 2rem, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' },
          ],
          { duration: 600, delay: Math.min(i, 8) * 60, easing: EASE.outQuart, fill: 'both' }
        );
      });
    }
    added = [];
    removed = false;
  };

  new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((n) => n.nodeType === 1 && added.push(n));
      if (m.removedNodes.length) removed = true;
    });
    clearTimeout(timer);
    timer = setTimeout(animateIn, 50);
  }).observe(list, { childList: true });
});

})();

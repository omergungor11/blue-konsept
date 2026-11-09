(() => {
  function animateIntroCopy() {
    const section = document.querySelector('.section_layout484');
    if (!section || !window.SplitType || !window.gsap || !window.ScrollTrigger) return;
    if (!section.querySelector('.layout484_text')) return;

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.matchMedia().add(
      { mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' },
      ({ conditions }) => {
        const text = new window.SplitType(section.querySelector('.layout484_text'), { types: 'words' });
        window.gsap.from(text.words, {
          opacity: 0.25,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: conditions.mobile ? 'top 35%' : 'top center',
            end: conditions.mobile ? 'bottom 60%' : 'bottom center',
            scrub: 2,
          },
        });
        return () => text.revert();
      },
    );
  }

  function rotateProjectTabs() {
    document.querySelectorAll('.project-tabs_tabs-menu').forEach((menu) => {
      const tabs = [...menu.querySelectorAll('.project-tabs_tab-link')];
      if (tabs.length < 2) return;

      let timeout;
      let lastAutomaticChange;
      const interval = 6000;

      function schedule(delay = interval) {
        clearTimeout(timeout);
        timeout = setTimeout(advance, delay);
      }

      function advance() {
        const current = tabs.findIndex((tab) => tab.classList.contains('w--current'));
        if (!document.querySelector('.w-nav-button.w--open')) {
          tabs[(current + 1) % tabs.length].click();
          lastAutomaticChange = performance.now();
        }
        schedule();
      }

      function waitAfterSelection() {
        if (lastAutomaticChange === undefined) {
          schedule(interval * 2);
          return;
        }
        const phase = (performance.now() - lastAutomaticChange) % interval;
        schedule(interval * 2 - phase);
      }

      menu.addEventListener('click', (event) => {
        if (event.target.closest('.project-tabs_tab-link')) waitAfterSelection();
      });
      menu.addEventListener('keydown', (event) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
          waitAfterSelection();
        }
      });

      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', () => schedule(), { once: true });
    });
  }

  function initProductCards() {
    document.querySelectorAll('.layout423_row').forEach((row) => {
      const cards = [...row.querySelectorAll('.layout423_card')].map((card) => ({
        card,
        title: card.querySelector('.layout423_card-title-preview'),
        summary: card.querySelector('.layout423_card-content-top'),
        actions: card.querySelector('.layout423_card-content-bottom'),
        overlay: card.querySelector('.layout423_overlay'),
      }));

      function selectCard(selected) {
        for (const { card, title, summary, actions, overlay } of cards) {
          const active = card === selected;
          for (const item of [card, title, summary, actions, overlay]) {
            item?.classList.toggle('active', active);
          }
          if (title) {
            title.tabIndex = active ? -1 : 0;
            title.setAttribute('aria-hidden', String(active));
            title.setAttribute('aria-expanded', String(active));
          }
          if (summary) summary.inert = !active;
          if (actions) actions.inert = !active;
        }
      }

      const initiallyActive = cards.find(({ card }) => card.classList.contains('active'));
      if (initiallyActive) selectCard(initiallyActive.card);

      for (const { card, title, actions } of cards) {
        card.addEventListener('click', () => selectCard(card));
        title?.setAttribute('role', 'button');
        title?.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          selectCard(card);
          actions?.querySelector('a')?.focus({ preventScroll: true });
        });
      }
    });
  }

  function findBackground(element) {
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const color = getComputedStyle(ancestor).backgroundColor;
      if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color;
    }
    return '#fff';
  }

  function initLogoMasks() {
    const grid = 5;
    const tileSize = 50;

    document.querySelectorAll('.logobox').forEach((box) => {
      const mask = box.querySelector('.mask');
      if (!mask) return;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = grid * tileSize;
      canvas.setAttribute('aria-hidden', 'true');
      Object.assign(canvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '10',
      });

      const context = canvas.getContext('2d');
      if (!context) return;
      if (getComputedStyle(mask).position === 'static') mask.style.position = 'relative';
      mask.append(canvas);
      context.fillStyle = findBackground(box);
      context.fillRect(0, 0, canvas.width, canvas.height);

      let animation = 0;
      function reveal(show) {
        const currentAnimation = ++animation;
        const tiles = Array.from({ length: grid * grid }, (_, index) => index);
        for (let index = tiles.length - 1; index > 0; index--) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [tiles[index], tiles[randomIndex]] = [tiles[randomIndex], tiles[index]];
        }

        function drawTile() {
          if (currentAnimation !== animation) return;
          const index = tiles.pop();
          const x = (index % grid) * tileSize;
          const y = Math.floor(index / grid) * tileSize;
          if (show) context.clearRect(x, y, tileSize, tileSize);
          else context.fillRect(x, y, tileSize, tileSize);
          if (tiles.length) setTimeout(() => requestAnimationFrame(drawTile), 10);
        }

        requestAnimationFrame(drawTile);
      }

      box.addEventListener('mouseenter', () => reveal(true));
      box.addEventListener('mouseleave', () => reveal(false));
    });
  }

  function initSections() {
    initProductCards();
    initLogoMasks();
    rotateProjectTabs();
    animateIntroCopy();
  }

  if (document.readyState === 'complete') initSections();
  else document.addEventListener('DOMContentLoaded', initSections, { once: true });
})();

(() => {

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.layout410_card');
  const stackedDistance = 32; // 32px = 2rem
  const maxOffsetRem = (cards.length - 1) * 2; 

  function resetMobileCards() {
    cards.forEach(card => {
      card.style.position = '';
      card.style.top = '';
      card.style.zIndex = '';
      card.style.marginBottom = '';
      card.style.transform = '';
      card.style.filter = '';
    });
  }

  function setupDesktopCards() {
    if (window.innerWidth >= 768) {
      cards.forEach((card, index) => {
        card.style.position = 'sticky';
        card.style.top = `calc(15vh + ${index * 2}rem)`;
        card.style.zIndex = index;
        
        const marginBottom = maxOffsetRem - (index * 2);
        card.style.marginBottom = `${marginBottom}rem`;
      });
      animateCardsOnScroll();
    } else {
      resetMobileCards();
    }
  }

  function animateCardsOnScroll() {
    if (window.innerWidth < 768) return;

    const overlaps = [];
    const maxDistance = window.innerHeight * 0.8; 

    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      const nextCard = cards[i + 1];
      const cardRect = card.getBoundingClientRect();
      const nextRect = nextCard.getBoundingClientRect();
      
      const distance = nextRect.top - cardRect.top;

      let progress = 1 - ((distance - stackedDistance) / (maxDistance - stackedDistance));
      progress = Math.max(0, Math.min(1, progress));
      overlaps.push(progress);
    }

    cards.forEach((card, i) => {
      if (i === cards.length - 1) {
        card.style.transform = `scale(1)`;
        card.style.filter = `brightness(1)`;
        return; 
      }

      let totalWeight = 0;
      for (let j = i; j < overlaps.length; j++) {
        totalWeight += overlaps[j];
      }

      const scaleReductionPerLayer = 0.04; 
      const brightnessReductionPerLayer = 0.15; 

      const scale = 1 - (totalWeight * scaleReductionPerLayer);
      const brightness = 1 - (totalWeight * brightnessReductionPerLayer);

      card.style.transform = `scale(${scale})`;
      card.style.filter = `brightness(${brightness})`;
    });
  }

  window.addEventListener('scroll', animateCardsOnScroll, { passive: true });
  window.addEventListener('resize', setupDesktopCards);

  setupDesktopCards(); 
});

})();
(() => {

(() => {
  const WRAPPER_SELECTOR = '[fs-tabs-element="menu"]';
  const ITEM_SELECTOR = '.fs-benefits_tab-item';
  const ACTIVE_ITEM_CLASS = 'is-tab-active';
  const DESC_SELECTOR = '.benefits_tab_description_wrapper';
  const ACTIVE_DESC_CLASS = 'active';

  function syncActiveDescriptions(root) {
    const items = root.querySelectorAll(ITEM_SELECTOR);
    items.forEach(item => {
      const desc = item.querySelector(DESC_SELECTOR);
      if (!desc) return;

      const isActive = item.classList.contains(ACTIVE_ITEM_CLASS);
      desc.classList.toggle(ACTIVE_DESC_CLASS, isActive);
    });
  }

  function init(root) {
    syncActiveDescriptions(root);

    root.addEventListener('click', (e) => {
      const tabItem = e.target.closest(ITEM_SELECTOR);
      if (!tabItem || !root.contains(tabItem)) return;

      requestAnimationFrame(() => syncActiveDescriptions(root));
    });

    const mo = new MutationObserver(() => syncActiveDescriptions(root));
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(WRAPPER_SELECTOR).forEach(init);
  });
})();

})();

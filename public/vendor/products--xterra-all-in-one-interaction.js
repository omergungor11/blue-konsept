(() => {

(() => {
  const WRAPPER_SELECTOR = '[fs-tabs-element="menu"]';
  const LIST_SELECTOR = '.fs-benefits_tab-list';
  const ITEM_SELECTOR = '.fs-benefits_tab-item';
  const ACTIVE_ITEM_CLASS = 'is-tab-active';

  function scrollContainerToActive(root) {
    const list = root.querySelector(LIST_SELECTOR);
    const activeItem = root.querySelector(`${ITEM_SELECTOR}.${ACTIVE_ITEM_CLASS}`);
    if (!list || !activeItem) return;

    requestAnimationFrame(() => {
      const containerTop = list.getBoundingClientRect().top;
      const containerHeight = list.clientHeight;
      
      const itemTop = activeItem.getBoundingClientRect().top - containerTop + list.scrollTop;
      const itemHeight = activeItem.clientHeight;

      const targetScroll = itemTop - (containerHeight / 2) + (itemHeight / 2);

      list.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  }

  function init(root) {
    root.addEventListener('click', (e) => {
      const tabItem = e.target.closest(ITEM_SELECTOR);
      if (!tabItem || !root.contains(tabItem)) return;

      scrollContainerToActive(root);
    });

    const mo = new MutationObserver((mutations) => {
      const hasNewActive = mutations.some(m => 
        m.attributeName === 'class' && 
        m.target.matches(ITEM_SELECTOR) && 
        m.target.classList.contains(ACTIVE_ITEM_CLASS)
      );
      
      if (hasNewActive) {
        scrollContainerToActive(root);
      }
    });

    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(WRAPPER_SELECTOR).forEach(init);
  });
})();

})();

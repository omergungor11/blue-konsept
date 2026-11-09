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

(() => {

document.addEventListener('DOMContentLoaded', function() {
// Function to check if the viewport width is 767px or less
function isMobile() {
  return window.innerWidth <= 767;
}

// Split text into individual words
const layoutText = new SplitType(".layout484_text", { types: "words" });
const layoutTL = gsap.timeline();

// Define different start and end values for mobile devices
let startValue = isMobile() ? "top 35%" : "top center";
let endValue = isMobile() ? "bottom 60%" : "bottom center";

layoutTL.from(layoutText.words,{
  // Initial opacity for each word
  opacity: 0.25,
  // Stagger animation of each word
  stagger: 0.1,
  scrollTrigger: { 
    trigger: ".section_layout484",
    // Trigger animation when .section_layout484 reaches certain part of the viewport
    start: startValue,
    // End animation when .section_layout484 reaches certain part of the viewport
    end: endValue,
    // Smooth transition based on scroll position
    scrub: 2 
  }
});
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

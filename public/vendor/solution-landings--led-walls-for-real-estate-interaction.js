(() => {

document.addEventListener('DOMContentLoaded', function() {
  const INNER_SELECTORS = [
    '.layout423_card-title-preview',
    '.layout423_overlay',
    '.layout423_card-content-top',
    '.layout423_card-content-bottom'
  ];
  
  function setActive(card, isActive) {
    card.classList.toggle('active', isActive);
    INNER_SELECTORS.forEach(sel => {
      const el = card.querySelector(sel);
      if (el) el.classList.toggle('active', isActive);
    });
  }
  
  const rows = document.querySelectorAll('.layout423_row');
  
  rows.forEach(row => {
    const cards = row.querySelectorAll('.layout423_card');
    
    if (!cards.length) return;
    
    cards.forEach((card, i) => setActive(card, i === 0));
    
    cards.forEach(card => {
      card.addEventListener('click', function() {
        cards.forEach(c => setActive(c, c === this));
      });
    });
  });
});

})();
(() => {

// To prevent Alphabets from Phone Input
  document.querySelectorAll('[data-input="phone-only"]').forEach(input => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  });

})();
(() => {

// Custom Select Dropdown
$(document).ready(function () {

  $('[data-select="option"]').on('click', function (e) {
    e.preventDefault();

    const $wrap = $(this).closest('[data-select="wrapper"]');
    const value = $(this).text().trim();

    $wrap.find('[data-select="label"]').text(value);
    $wrap.find('[data-select="input"]').val(value);

    // close dropdown
    $wrap.find('[data-select="toggle"]').trigger('w-close');
  });

});

})();

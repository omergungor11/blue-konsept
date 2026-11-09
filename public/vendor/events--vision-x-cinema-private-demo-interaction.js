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

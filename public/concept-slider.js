(() => {
  if (!window.Swiper) return;

  document.querySelectorAll('[fs-slider-instance="fs-slider-1"]').forEach((instance) => {
    const element = (name) => instance.querySelector(`[fs-slider-element="${name}"]`);
    const container = element('list-wrapper');
    const list = element('list');
    const slide = element('slide');
    if (!container || !list || !slide || container.swiper) return;

    new window.Swiper(container, {
      wrapperClass: list.classList[0],
      slideClass: slide.classList[0],
      slideActiveClass: 'is-slide-active',
      slidePrevClass: 'is-slide-previous',
      slideNextClass: 'is-slide-next',
      speed: 300,
      breakpoints: {
        768: { slidesPerView: 'auto', spaceBetween: 16 },
      },
      navigation: {
        prevEl: element('previous'),
        nextEl: element('next'),
        addIcons: false,
        disabledClass: 'is-nav-disabled',
      },
      a11y: { enabled: true },
    });
  });
})();

(() => {
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector(".header");
  if (header) {
    const sections = [...document.querySelectorAll("section, footer")];
    let pending = false;
    function updateHeader() {
      pending = false;
      const visible = sections.findLast((section) => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= 25 && bottom > 25;
      });
      const dark = Boolean(visible?.classList.contains("dark"));
      header.classList.toggle("dark", dark);
      header.classList.toggle("base", !dark);
      header.classList.toggle("is-blur", window.scrollY > 160);
    }
    function scheduleHeaderUpdate() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(updateHeader);
    }
    updateHeader();
    addEventListener("scroll", scheduleHeaderUpdate, { passive: true });
    addEventListener("resize", scheduleHeaderUpdate, { passive: true });
  }

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (window.Lenis && window.gsap && !matchMedia("(hover: none), (max-width: 991px)").matches && !reducedMotion.matches) {
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.8, smoothTouch: false });
    lenis.on("scroll", () => window.ScrollTrigger?.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const videos = document.querySelectorAll('video:has(source[data-lazysrc]:not([data-lazysrc=""]))');
  const loaded = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    for (const { target: video, isIntersecting } of entries) {
      if (!isIntersecting || video.closest(".is-tab-hidden")) {
        video.pause();
        continue;
      }
      if (!loaded.has(video)) {
        for (const source of video.querySelectorAll("source[data-lazysrc]:not([data-lazysrc=\"\"])")) {
          source.src = source.dataset.lazysrc;
          delete source.dataset.lazysrc;
        }
        video.muted = true;
        video.load();
        loaded.add(video);
      }
      if (!reducedMotion.matches) video.play().catch(() => {});
    }
  }, { threshold: 0.08 });
  videos.forEach((video) => observer.observe(video));
  document.addEventListener("concept:tab-change", (event) => {
    for (const video of event.target.querySelectorAll("video")) {
      if (!loaded.has(video) && !video.querySelector('source[data-lazysrc]:not([data-lazysrc=""])')) continue;
      if (video.closest(".is-tab-hidden")) video.pause();
      observer.unobserve(video);
      observer.observe(video);
    }
  });

  document.querySelectorAll('[fs-copyclip-element="click"]').forEach((button) => {
    button.addEventListener("click", () => navigator.clipboard?.writeText(location.href).catch(() => {}));
  });

  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "form") {
    const status = document.createElement("div");
    status.className = "concept-form-notice";
    status.setAttribute("role", "status");
    status.textContent = "Concept preview. Your information was not sent or saved.";
    document.body.append(status);
    params.delete("demo");
    history.replaceState(history.state, "", location.pathname + (params.size ? "?" + params : "") + location.hash);
    setTimeout(() => status.remove(), 6000);
  }
})();

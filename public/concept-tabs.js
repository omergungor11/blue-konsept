(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[fs-tabs-instance]").forEach((root, instance) => {
    const menu = root.querySelector("[fs-tabs-element=menu]");
    const content = root.querySelector("[fs-tabs-element=content]");
    const tabs = [...(menu?.querySelectorAll(".fs-benefits_tab-item") ?? [])];
    const panels = [...(content?.querySelectorAll(".fs-benefits_content-item") ?? [])];
    if (!tabs.length || tabs.length !== panels.length) return;

    const onLoad = root.getAttribute("fs-tabs-instance") === "fs-benefits";
    const interval = onLoad ? 4000 : 6000;
    let started = false;
    let active = 0;
    let timer;
    let progress;

    menu.setAttribute("role", "tablist");
    menu.setAttribute("aria-orientation", root.getAttribute("fs-tabs-layoutdirection") || "horizontal");
    content.style.display = "grid";
    const tabId = (index) => `benefit-${instance}-tab-${index}`;
    const panelId = (index) => `benefit-${instance}-panel-${index}`;

    function schedule() {
      clearTimeout(timer);
      progress?.cancel();
      if (!started || reduceMotion.matches || tabs.length < 2) return;

      const fill = onLoad && tabs[active].querySelector("[fs-tabs-element=progress-fill]");
      if (fill) {
        progress = fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
          duration: interval,
          easing: "ease-out",
          fill: "both",
        });
      }
      timer = setTimeout(() => select((active + 1) % tabs.length), interval);
    }

    function select(index, focus = false) {
      active = index;
      tabs.forEach((tab, offset) => {
        const selected = offset === index;
        tab.classList.toggle("is-tab-active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;

        const panel = panels[offset];
        panel.classList.toggle("is-content-active", selected);
        panel.classList.toggle("is-tab-hidden", !selected);
        panel.inert = !selected;
      });
      root.dispatchEvent(new Event("concept:tab-change", { bubbles: true }));
      if (focus) tabs[index].focus({ preventScroll: true });
      schedule();
    }

    tabs.forEach((tab, index) => {
      tab.id ||= tabId(index);
      tab.setAttribute("role", "tab");
      const panel = panels[index];
      panel.id ||= panelId(index);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      tab.setAttribute("aria-controls", panel.id);
      tab.addEventListener("click", () => select(index));
      tab.addEventListener("keydown", (event) => {
        const target = {
          ArrowLeft: (index + tabs.length - 1) % tabs.length,
          ArrowUp: (index + tabs.length - 1) % tabs.length,
          ArrowRight: (index + 1) % tabs.length,
          ArrowDown: (index + 1) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
          Enter: index,
          " ": index,
        }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        select(target, true);
      });
    });

    select(0);
    const start = () => {
      started = true;
      schedule();
    };
    if (onLoad) {
      if (document.readyState === "complete") start();
      else addEventListener("load", start, { once: true });
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      }, { threshold: 0.25 });
      observer.observe(root);
    }
  });
})();

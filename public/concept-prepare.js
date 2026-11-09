(() => {
  const html = document.documentElement;
  html.dataset.wfPage = document.currentScript.dataset.page;
  html.classList.add("w-mod-js");
  if ("ontouchstart" in window) html.classList.add("w-mod-touch");
  try {
    html.classList.toggle("concept-returning", Boolean(sessionStorage.getItem("visited")));
  } catch {
    // A storage restriction should not prevent the page from loading.
  }
})();

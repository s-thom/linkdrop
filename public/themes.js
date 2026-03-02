(() => {
  const apply = () =>
    (document.body.dataset.theme =
      localStorage.getItem("linkdrop-theme") || "auto");
  apply();
  document.addEventListener("astro:page-load", apply);
})();

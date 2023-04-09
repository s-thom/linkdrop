(() => {
  document.body.dataset.theme =
    localStorage.getItem("linkdrop-theme") || "auto";
})();

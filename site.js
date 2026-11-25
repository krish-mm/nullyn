/* Mobile navigation */
(function () {
  const header = document.querySelector("header.nav");
  const btn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!header || !btn || !nav) return;

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }

  btn.addEventListener("click", function () {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setOpen(false);
  });
})();

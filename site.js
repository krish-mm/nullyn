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

/* Copy buttons on /setup/ code blocks */
(function () {
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const root = btn.closest(".code-block");
      const pre = root && root.querySelector("pre");
      if (!pre) return;
      const text = pre.innerText.replace(/\n$/, "");
      function done() {
        const old = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove("is-copied");
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          done();
        });
      }
    });
  });
})();

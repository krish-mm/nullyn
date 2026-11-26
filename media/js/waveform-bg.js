/* Nullyn AI — subtle lime waveform backgrounds for raised sections. */
(function () {
  var W = [
    [0.2, 1.15, 0.2, 0.3, 0.34, "rgba(182,255,0,0.11)", 1.15],
    [0.15, 1.85, -0.14, 1.8, 0.5, "rgba(182,255,0,0.08)", 1],
    [0.1, 2.65, 0.28, 3.2, 0.66, "rgba(182,255,0,0.06)", 0.9],
    [0.08, 0.78, -0.1, 4.5, 0.42, "rgba(255,26,26,0.07)", 0.85]
  ];
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hidden = document.hidden, items = [], raf = 0, t0 = 0;

  function yAt(x, w, h, t, L) {
    var n = (x / w) * Math.PI * 2 * L[1], a = h * L[0];
    return h * L[4] + a * Math.sin(n + t * L[2] + L[3])
      + a * 0.28 * Math.sin(n * 2.15 + t * L[2] * 0.7 + L[3] + 0.6)
      + a * 0.12 * Math.sin(n * 0.5 - t * 0.08 + L[3]);
  }
  function place(it) {
    var sh = it.el.clientHeight;
    it.c.style.top = Math.min(Math.max(0, -it.el.getBoundingClientRect().top), Math.max(0, sh - it.h)) + "px";
  }
  function resize(it) {
    var w = it.el.clientWidth, h = Math.min(it.el.clientHeight, innerHeight) || 0;
    var dpr = Math.min(devicePixelRatio || 1, 2);
    if (!w || !h) return;
    it.w = w; it.h = h; it.dpr = dpr;
    var bw = (w * dpr) | 0, bh = (h * dpr) | 0;
    if (it.c.width !== bw || it.c.height !== bh) {
      it.c.width = bw; it.c.height = bh; it.c.style.height = h + "px";
    }
    place(it);
  }
  function draw(it, t) {
    var ctx = it.ctx, w = it.w, h = it.h, i, x, L;
    if (!w || !h) return;
    ctx.setTransform(it.dpr, 0, 0, it.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (i = 0; i < 4; i++) {
      L = W[i];
      ctx.beginPath();
      ctx.strokeStyle = L[5];
      ctx.lineWidth = L[6];
      for (x = 0; x <= w; x += w > 900 ? 3 : 2) {
        x ? ctx.lineTo(x, yAt(x, w, h, t, L)) : ctx.moveTo(x, yAt(x, w, h, t, L));
      }
      ctx.lineTo(w, yAt(w, w, h, t, L));
      ctx.stroke();
    }
  }
  function tNow() { return t0 ? (performance.now() - t0) / 1000 : 0; }
  function anyOn() {
    for (var i = 0; i < items.length; i++) if (items[i].on) return 1;
  }
  function tick(now) {
    raf = 0;
    if (hidden || reduced) return;
    if (!t0) t0 = now;
    var t = (now - t0) / 1000, i, n = 0;
    for (i = 0; i < items.length; i++) if (items[i].on) { place(items[i]); draw(items[i], t); n = 1; }
    if (n) raf = requestAnimationFrame(tick);
  }
  function start() {
    if (!reduced && !hidden && !raf && anyOn()) raf = requestAnimationFrame(tick);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  var nodes = document.querySelectorAll("[data-wave]"), i, el, c, it;
  for (i = 0; i < nodes.length; i++) {
    el = nodes[i];
    c = document.createElement("canvas");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("data-wave-canvas", "");
    el.insertBefore(c, el.firstChild);
    it = { el: el, c: c, ctx: c.getContext("2d"), on: 0, w: 0, h: 0, dpr: 1 };
    items.push(it);
    resize(it);
    draw(it, 0);
  }
  if (!items.length) return;

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++)
      for (var j = 0; j < items.length; j++)
        if (items[j].el === entries[i].target) items[j].on = entries[i].isIntersecting;
    if (reduced) { for (i = 0; i < items.length; i++) if (items[i].on) place(items[i]); }
    else if (anyOn()) start();
    else stop();
  }, { rootMargin: "48px 0px" });
  for (i = 0; i < items.length; i++) io.observe(items[i].el);

  document.addEventListener("visibilitychange", function () {
    hidden = document.hidden;
    hidden ? stop() : start();
  });

  var to;
  function onResize() {
    for (var i = 0; i < items.length; i++) { resize(items[i]); draw(items[i], tNow()); }
  }
  addEventListener("resize", function () { clearTimeout(to); to = setTimeout(onResize, 80); });
  addEventListener("scroll", function () {
    if (reduced) for (var i = 0; i < items.length; i++) if (items[i].on) place(items[i]);
  }, { passive: true });
})();

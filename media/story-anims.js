/* Nullyn homepage story animations — lazy-start, reduced-motion freeze. */
(function () {
  const cancelMarkPath = new Path2D("M 2.000 32.000 A 30.000 30.000 0 1 1 62.000 32.000 A 30.000 30.000 0 1 1 2.000 32.000 Z M 13.515 32.834 L 14.215 30.719 L 14.878 29.166 L 15.555 27.768 L 16.222 26.543 L 16.872 25.490 L 17.495 24.613 L 18.080 23.911 L 18.612 23.384 L 19.075 23.022 L 19.453 22.804 L 19.747 22.694 L 19.985 22.653 L 20.218 22.659 L 20.499 22.719 L 20.858 22.858 L 21.300 23.104 L 21.812 23.469 L 22.381 23.957 L 22.991 24.562 L 23.632 25.275 L 24.296 26.084 L 24.977 26.977 L 25.671 27.943 L 26.376 28.968 L 27.089 30.041 L 27.809 31.150 L 28.536 32.283 L 29.267 33.427 L 29.983 34.173 L 30.930 34.588 L 31.964 34.609 L 32.927 34.233 L 33.673 33.517 L 34.088 32.570 L 34.109 31.536 L 33.733 30.573 L 33.733 30.573 L 33.000 29.425 L 32.262 28.275 L 31.518 27.130 L 30.767 26.000 L 30.007 24.895 L 29.237 23.824 L 28.454 22.797 L 27.654 21.822 L 26.830 20.908 L 25.976 20.063 L 25.080 19.297 L 24.129 18.622 L 23.106 18.059 L 22.001 17.636 L 20.818 17.393 L 19.586 17.368 L 18.360 17.579 L 17.190 18.011 L 16.104 18.633 L 15.102 19.413 L 14.170 20.333 L 13.291 21.385 L 12.450 22.569 L 11.635 23.888 L 10.838 25.351 L 10.050 26.980 L 9.249 28.867 L 8.485 31.166 L 8.357 32.192 L 8.631 33.188 L 9.267 34.004 L 10.166 34.515 L 11.192 34.643 L 12.188 34.369 L 13.004 33.733 L 13.515 32.834 Z M 50.485 31.166 L 49.785 33.281 L 49.122 34.834 L 48.445 36.232 L 47.778 37.457 L 47.128 38.510 L 46.505 39.387 L 45.920 40.089 L 45.388 40.616 L 44.925 40.978 L 44.547 41.196 L 44.253 41.306 L 44.015 41.347 L 43.782 41.341 L 43.501 41.281 L 43.142 41.142 L 42.700 40.896 L 42.188 40.531 L 41.619 40.043 L 41.009 39.438 L 40.368 38.725 L 39.704 37.916 L 39.023 37.023 L 38.329 36.057 L 37.624 35.032 L 36.911 33.959 L 36.191 32.850 L 35.464 31.717 L 34.733 30.573 L 34.017 29.827 L 33.070 29.412 L 32.036 29.391 L 31.073 29.767 L 30.327 30.483 L 29.912 31.430 L 29.891 32.464 L 30.267 33.427 L 30.267 33.427 L 31.000 34.575 L 31.738 35.725 L 32.482 36.870 L 33.233 38.000 L 33.993 39.105 L 34.763 40.176 L 35.546 41.203 L 36.346 42.178 L 37.170 43.092 L 38.024 43.937 L 38.920 44.703 L 39.871 45.378 L 40.894 45.941 L 41.999 46.364 L 43.182 46.607 L 44.414 46.632 L 45.640 46.421 L 46.810 45.989 L 47.896 45.367 L 48.898 44.587 L 49.830 43.667 L 50.709 42.615 L 51.550 41.431 L 52.365 40.112 L 53.162 38.649 L 53.950 37.020 L 54.751 35.133 L 55.515 32.834 L 55.643 31.808 L 55.369 30.812 L 54.733 29.996 L 53.834 29.485 L 52.808 29.357 L 51.812 29.631 L 50.996 30.267 L 50.485 31.166 Z");

  function cssColors() {
    const css = getComputedStyle(document.documentElement);
    return {
      bg: css.getPropertyValue("--bg").trim() || "#0A0A0A",
      surface: css.getPropertyValue("--surface").trim() || "#121212",
      elev: css.getPropertyValue("--surface-elev").trim() || "#1C1C1C",
      text: css.getPropertyValue("--text").trim() || "#F3F4F1",
      muted: css.getPropertyValue("--muted").trim() || "#9A9A9A",
      primary: css.getPropertyValue("--primary").trim() || "#CCFF00",
      dim: css.getPropertyValue("--primary-dim").trim() || "#8FBF00",
      howl: css.getPropertyValue("--howl").trim() || "#FF1A1A",
      line: css.getPropertyValue("--line").trim() || "rgba(243,244,241,0.10)",
      lineStrong: css.getPropertyValue("--line-strong").trim() || "rgba(243,244,241,0.18)",
      pGlow: css.getPropertyValue("--primary-glow").trim() || "rgba(204,255,0,0.28)",
      hGlow: css.getPropertyValue("--howl-glow").trim() || "rgba(255,26,26,0.28)",
    };
  }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(a, b, x) {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  }
  function rr(c, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rad, y);
    c.arcTo(x + w, y, x + w, y + h, rad);
    c.arcTo(x + w, y + h, x, y + h, rad);
    c.arcTo(x, y + h, x, y, rad);
    c.arcTo(x, y, x + w, y, rad);
    c.closePath();
  }
  function drawCancelMark(c, x, y, size, color) {
    c.save();
    c.translate(x, y);
    c.scale(size / 64, size / 64);
    c.translate(-32, -32);
    c.fillStyle = color;
    c.fill(cancelMarkPath, "evenodd");
    c.restore();
  }
  function bezierPoint(p0, p1, p2, p3, t) {
    const u = 1 - t, uu = u * u, tt = t * t;
    return {
      x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
      y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y,
    };
  }
  function strokeBezier(c, p0, p1, p2, p3) {
    c.beginPath();
    c.moveTo(p0.x, p0.y);
    c.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    c.stroke();
  }
  function pulseBezier(c, p0, p1, p2, p3, t, color, count) {
    count = count || 2;
    for (let i = 0; i < count; i++) {
      const u = ((t * 0.32 + i / count) % 1 + 1) % 1;
      const p = bezierPoint(p0, p1, p2, p3, u);
      c.beginPath();
      c.fillStyle = color;
      c.globalAlpha = 0.3 + 0.6 * Math.sin(u * Math.PI);
      c.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    }
  }
  function label(c, C, text, x, y, color, size) {
    c.save();
    c.font = "600 " + (size || 18) + "px Outfit, 'Segoe UI', sans-serif";
    c.fillStyle = color || C.muted;
    c.textAlign = "center";
    c.textBaseline = "top";
    c.letterSpacing = "0.06em";
    c.fillText(text, x, y);
    c.restore();
  }
  function bootCanvas(canvas, duration, draw, freezeT, apiName) {
    if (!canvas) return null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = 1920, H = 1080;
    const ctx = canvas.getContext("2d");
    let start = performance.now();
    let raf = 0;
    function setTime(t) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      const tt = ((t % duration) + duration) % duration;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (canvas.width !== W) { canvas.width = W; canvas.height = H; }
      draw(ctx, tt);
    }
    function tick(now) {
      const t = ((now - start) / 1000) % duration;
      if (canvas.width !== W) { canvas.width = W; canvas.height = H; }
      draw(ctx, t);
      raf = requestAnimationFrame(tick);
    }
    function play() {
      start = performance.now();
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    function pause() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function boot() {
      if (reduced) { setTime(freezeT); return; }
      setTime(0);
      if (!("IntersectionObserver" in window) || /record=1/.test(location.search)) {
        play();
        return;
      }
      const root = canvas.parentElement || canvas;
      const io = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) { if (!raf) play(); } else { pause(); }
      }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
      io.observe(root);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
    else boot();
    const api = { duration: duration, setTime, play, pause };
    window[apiName] = api;
    return api;
  }

    function drawEqPanel(c, x, y, w, h, howl, notch, t, C) {
      const bands = 28;
      const fMin = 50, fMax = 16000;
      const freqAt = function (i) { return fMin * Math.pow(fMax / fMin, i / (bands - 1)); };
      const howlF = 2500;
      let howlBand = 0, best = Infinity;
      for (let i = 0; i < bands; i++) {
        const d = Math.abs(Math.log(freqAt(i) / howlF));
        if (d < best) { best = d; howlBand = i; }
      }
      const padL = Math.max(14, w * 0.035);
      const padR = padL;
      const padT = Math.max(28, h * 0.16);
      const padB = Math.max(48, h * 0.22);
      c.save();
      rr(c, x, y, w, h, Math.min(14, h * 0.06));
      c.fillStyle = C.surface || C.elev || "#121212";
      c.globalAlpha = 0.96;
      c.fill();
      c.globalAlpha = 1;
      c.strokeStyle = C.lineStrong || "rgba(243,244,241,0.18)";
      c.lineWidth = 1;
      c.stroke();

      const capSize = Math.max(11, Math.round(h * 0.055));
      c.font = "600 " + capSize + "px Outfit, 'Segoe UI', sans-serif";
      c.fillStyle = C.muted;
      c.textAlign = "left";
      c.textBaseline = "top";
      c.fillText("Illustrative — not measured data", x + padL, y + Math.max(8, h * 0.04));

      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const gap = Math.max(2, innerW * 0.012);
      const bw = (innerW - gap * (bands - 1)) / bands;
      const baseY = y + padT + innerH;

      for (let i = 0; i < bands; i++) {
        const f = freqAt(i);
        const u = i / (bands - 1);
        const env = 0.34 + 0.28 * Math.sin(Math.PI * Math.min(1, u * 1.15)) * Math.exp(-Math.max(0, u - 0.55) * 1.4);
        let hgt = env + 0.055 * Math.sin(t * 2.3 + i * 0.55) + 0.03 * Math.sin(t * 4.1 + f * 0.001);
        hgt = Math.max(0.08, Math.min(1, hgt));
        const dist = Math.abs(i - howlBand);
        if (dist === 0) {
          hgt = hgt * (1 - howl) + (0.96 + 0.03 * Math.sin(t * 14)) * howl;
          hgt = hgt * (1 - notch) + 0.13 * notch;
        } else if (dist === 1) {
          hgt = hgt + 0.10 * howl * (1 - notch);
          hgt = hgt * (1 - 0.16 * notch);
        }
        hgt = Math.max(0.06, Math.min(1, hgt));
        const bh = innerH * hgt;
        const bx = x + padL + i * (bw + gap);
        const ringing = dist === 0 && howl > 0.2 && notch < 0.65;
        c.fillStyle = ringing ? C.howl : C.primary;
        c.globalAlpha = ringing ? 0.85 + 0.15 * Math.sin(t * 16) : 0.88;
        rr(c, bx, baseY - bh, Math.max(1, bw), bh, 2);
        c.fill();
        c.globalAlpha = 1;
        if (dist === 0 && notch > 0.25) {
          c.strokeStyle = C.primary;
          c.lineWidth = 1.6;
          c.globalAlpha = Math.min(1, notch);
          c.beginPath();
          c.moveTo(bx - 4, baseY - bh - 10);
          c.lineTo(bx + bw / 2, baseY - bh - 2);
          c.lineTo(bx + bw + 4, baseY - bh - 10);
          c.stroke();
          c.globalAlpha = 1;
        }
      }

      const xAtF = function (f) {
        const u = Math.log(f / fMin) / Math.log(fMax / fMin);
        return x + padL + u * innerW;
      };
      c.fillStyle = C.muted;
      c.font = "500 " + Math.max(10, Math.round(h * 0.048)) + "px Outfit, 'Segoe UI', sans-serif";
      c.textAlign = "center";
      c.textBaseline = "top";
      [[100, "100 Hz"], [1000, "1 kHz"], [10000, "10 kHz"]].forEach(function (pair) {
        const tx = xAtF(pair[0]);
        c.globalAlpha = 0.55;
        c.strokeStyle = C.lineStrong || "rgba(243,244,241,0.18)";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(tx, baseY + 2);
        c.lineTo(tx, baseY + 7);
        c.stroke();
        c.globalAlpha = 1;
        c.fillText(pair[1], tx, baseY + 9);
      });
      c.font = "600 " + Math.max(11, Math.round(h * 0.055)) + "px Outfit, 'Segoe UI', sans-serif";
      c.fillStyle = C.text || "#F3F4F1";
      c.globalAlpha = 0.85;
      [[Math.sqrt(fMin * 250), "Lows"], [Math.sqrt(250 * 2000), "Mids"], [Math.sqrt(2000 * fMax), "Highs"]].forEach(function (pair) {
        c.fillText(pair[1], xAtF(pair[0]), y + h - Math.max(14, h * 0.06));
      });
      c.globalAlpha = 1;
      c.restore();
    }

  /* ------------------------------------------------------------------ */
  /* 1. Gain before feedback — 7s                                        */
  /* ------------------------------------------------------------------ */
  (function () {
    const canvas = document.getElementById("anim-gain");
    const DURATION = 7;
    const C = cssColors();
    function spectrum(c, x, y, w, h, howl, clean, t) {
      drawEqPanel(c, x, y, w, h, howl, clean, t, C);
    }
    function fader(c, x, y, level, danger) {
      c.fillStyle = C.elev;
      rr(c, x - 18, y, 36, 260, 8);
      c.fill();
      c.fillStyle = "#2A2A2A";
      c.fillRect(x - 2, y + 16, 4, 228);
      const fy = y + 228 - level * 210;
      c.fillStyle = danger ? C.howl : C.primary;
      rr(c, x - 14, fy, 28, 16, 4);
      c.fill();
    }
    function micIcon(c, x, y, color) {
      c.save();
      c.strokeStyle = color;
      c.fillStyle = color;
      c.lineWidth = 3;
      c.lineCap = "round";
      rr(c, x - 14, y - 36, 28, 44, 14);
      c.stroke();
      c.beginPath();
      c.arc(x, y + 8, 18, 0.15 * Math.PI, 0.85 * Math.PI);
      c.stroke();
      c.beginPath();
      c.moveTo(x, y + 26);
      c.lineTo(x, y + 42);
      c.moveTo(x - 12, y + 42);
      c.lineTo(x + 12, y + 42);
      c.stroke();
      c.restore();
    }
    function draw(ctx, t) {
      const W = 1920, H = 1080;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      // two panels
      const mid = 1;
      // without: fader 0-0.7 over 0-3s, howl from 2.2
      // with: fader 0-0.92 over 0-3.2s, stays clean
      const side = (title, x0, faderT, howlAmt, cleanAmt, t) => {
        rr(ctx, x0, 80, 880, 920, 28);
        ctx.fillStyle = C.surface;
        ctx.fill();
        ctx.strokeStyle = C.line;
        ctx.lineWidth = 1;
        ctx.stroke();
        label(ctx, C, title, x0 + 440, 110, title.indexOf("Without") === 0 ? C.howl : C.primary, 28);
        const level = faderT;
        fader(ctx, x0 + 140, 320, level, howlAmt > 0.3 && cleanAmt < 0.4);
        micIcon(ctx, x0 + 140, 240, howlAmt > 0.35 && cleanAmt < 0.4 ? C.howl : C.primary);
        spectrum(ctx, x0 + 240, 300, 580, 520, howlAmt, cleanAmt, t);
        if (howlAmt > 0.2 && cleanAmt < 0.4) {
          ctx.save();
          ctx.globalAlpha = 0.18 * howlAmt;
          ctx.fillStyle = C.howl;
          rr(ctx, x0, 80, 880, 920, 28);
          ctx.fill();
          ctx.restore();
        }
      };
      const fA = smoothstep(0.3, 2.8, t);
      const howlA = smoothstep(2.1, 3.1, t) * (1 - smoothstep(6.4, 6.95, t));
      const fB = smoothstep(0.3, 3.2, t);
      const howlB = smoothstep(1.9, 2.6, t) * (1 - smoothstep(2.7, 3.6, t));
      const cleanB = smoothstep(2.7, 3.6, t);
      side("Without Nullyn AI", 70, fA * 0.72, howlA, 0, t);
      side("With Nullyn AI", 970, fB * 0.92, howlB, cleanB, t);
    }
    const api = bootCanvas(canvas, DURATION, draw, 5.2, "NULLYN_GAIN");
    if (api && document.getElementById("anim-gain") && !document.getElementById("anim-move") && /record=1/.test(location.search)) {
      window.NULLYN = api;
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 2. Moving performer — 7.5s, full cable chain                        */
  /* ------------------------------------------------------------------ */
  (function () {
    const canvas = document.getElementById("anim-move");
    const DURATION = 7.5;
    const C = cssColors();
    const L = {
      mainL: { x: 260, y: 400 },
      mainR: { x: 1660, y: 400 },
      wedge: { x: 520, y: 620 },
      nullyn: { x: 980, y: 760 },
      mixer: { x: 1500, y: 860 },
      start: { x: 1100, y: 560 },
      end: { x: 640, y: 600 },
    };
    function speaker(c, x, y, flip) {
      c.save();
      c.translate(x, y);
      if (flip) c.scale(-1, 1);
      c.fillStyle = C.elev;
      rr(c, -36, -70, 72, 140, 10);
      c.fill();
      c.fillStyle = "#1A1A1A";
      c.beginPath(); c.arc(0, -18, 18, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(0, 32, 24, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    function wedge(c, x, y) {
      c.save();
      c.translate(x, y);
      c.fillStyle = C.elev;
      c.beginPath();
      c.moveTo(-50, 22);
      c.lineTo(50, 22);
      c.lineTo(28, -28);
      c.lineTo(-20, -28);
      c.closePath();
      c.fill();
      c.restore();
    }
    function mixer(c, x, y) {
      c.save();
      c.translate(x, y);
      c.fillStyle = C.elev;
      rr(c, -90, -36, 180, 72, 8);
      c.fill();
      for (let i = 0; i < 10; i++) {
        c.fillStyle = "#2A2A2A";
        c.fillRect(-72 + i * 15, -12, 3, 32);
        c.fillStyle = C.dim;
        c.fillRect(-74 + i * 15, -2 + (i % 3) * 4, 7, 4);
      }
      c.restore();
      label(c, C, "Mixer", x, y + 44, C.muted, 16);
    }
    function nullynAI(c, x, y, on) {
      c.save();
      c.translate(x, y);
      if (on) { c.shadowColor = C.primary; c.shadowBlur = 22; }
      c.fillStyle = "#101010";
      rr(c, -64, -22, 128, 44, 8);
      c.fill();
      c.shadowBlur = 0;
      c.strokeStyle = on ? C.primary : "#333";
      c.lineWidth = 1.8;
      c.stroke();
      c.fillStyle = "#2A2A2A";
      c.beginPath(); c.arc(-64, 0, 8, 0, Math.PI * 2); c.arc(64, 0, 8, 0, Math.PI * 2); c.fill();
      c.fillStyle = on ? C.primary : "#3A3A3A";
      c.beginPath(); c.arc(-64, 0, 3, 0, Math.PI * 2); c.arc(64, 0, 3, 0, Math.PI * 2); c.fill();
      drawCancelMark(c, 0, 0, 26, on ? C.primary : "#7A7A7A");
      c.restore();
      label(c, C, "Nullyn AI", x, y + 28, on ? C.primary : C.muted, 16);
    }
    function performer(c, x, y, t) {
      const bob = Math.sin(t * 3) * 2;
      c.save();
      c.translate(x, y + bob);
      c.strokeStyle = C.text;
      c.fillStyle = C.text;
      c.lineWidth = 3;
      c.lineCap = "round";
      c.beginPath(); c.arc(0, -42, 11, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.moveTo(0, -28); c.lineTo(0, 8); c.stroke();
      c.beginPath(); c.moveTo(0, -18); c.lineTo(-16, 4); c.moveTo(0, -18); c.lineTo(14, -2); c.stroke();
      c.beginPath(); c.moveTo(0, 8); c.lineTo(-12, 40); c.moveTo(0, 8); c.lineTo(12, 40); c.stroke();
      // mic
      c.strokeStyle = C.muted;
      c.beginPath(); c.moveTo(14, -2); c.lineTo(26, -14); c.stroke();
      c.fillStyle = C.howl;
      c.beginPath(); c.arc(28, -16, 5, 0, Math.PI * 2); c.fill();
      c.restore();
      return { x: x + 28, y: y + bob - 16 };
    }
    function trackRing(c, x, y, locked, t) {
      c.save();
      c.strokeStyle = locked ? C.primary : C.howl;
      c.lineWidth = 2.4;
      c.globalAlpha = 0.85;
      const r = 22 + 4 * Math.sin(t * 8);
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
      c.font = "600 15px Outfit, 'Segoe UI', sans-serif";
      c.fillStyle = locked ? C.primary : C.howl;
      c.textAlign = "center";
      c.fillText(locked ? "tracking" : "howl", x, y - r - 10);
      c.restore();
    }
    function draw(ctx, t) {
      const W = 1920, H = 1080;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      // floor
      ctx.fillStyle = "#0E0E0E";
      ctx.beginPath();
      ctx.moveTo(0, 700); ctx.lineTo(W, 700); ctx.lineTo(W, H); ctx.lineTo(0, H);
      ctx.fill();
      // stage
      ctx.fillStyle = C.elev;
      rr(ctx, 180, 430, 1560, 90, 8);
      ctx.fill();

      const walk = smoothstep(0.6, 3.4, t);
      const px = lerp(L.start.x, L.end.x, walk);
      const py = lerp(L.start.y, L.end.y, walk);
      const on = smoothstep(2.6, 3.5, t);
      const howl = smoothstep(1.2, 2.2, t) * (1 - smoothstep(3.2, 4.4, t));

      speaker(ctx, L.mainL.x, L.mainL.y, false);
      speaker(ctx, L.mainR.x, L.mainR.y, true);
      wedge(ctx, L.wedge.x, L.wedge.y);
      label(ctx, C, "Monitor", L.wedge.x, L.wedge.y + 28, howl > 0.4 ? C.howl : C.muted, 16);
      mixer(ctx, L.mixer.x, L.mixer.y);

      const mic = { x: px + 28, y: py - 16 };
      // cables: mic → Nullyn AI → mixer → mains + monitor
      const n = L.nullyn, m = L.mixer;
      const micP = [mic, { x: mic.x, y: mic.y + 80 }, { x: n.x - 80, y: n.y - 10 }, { x: n.x - 64, y: n.y }];
      const nP = [{ x: n.x + 64, y: n.y }, { x: n.x + 180, y: n.y + 20 }, { x: m.x - 150, y: m.y - 10 }, { x: m.x - 90, y: m.y - 8 }];
      const ml = [{ x: m.x - 70, y: m.y - 8 }, { x: m.x - 400, y: m.y - 60 }, { x: L.mainL.x + 80, y: L.mainL.y + 140 }, { x: L.mainL.x, y: L.mainL.y + 70 }];
      const mr = [{ x: m.x - 40, y: m.y - 8 }, { x: m.x + 40, y: m.y - 100 }, { x: L.mainR.x - 40, y: L.mainR.y + 180 }, { x: L.mainR.x, y: L.mainR.y + 70 }];
      const mon = [{ x: m.x - 10, y: m.y - 8 }, { x: m.x - 260, y: m.y + 20 }, { x: L.wedge.x + 140, y: L.wedge.y + 70 }, { x: L.wedge.x + 20, y: L.wedge.y + 10 }];
      ctx.lineCap = "round";
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = howl > 0.25 && on < 0.5 ? C.howl : (on > 0.4 ? C.dim : "#3A3A3A");
      ctx.globalAlpha = 0.55;
      strokeBezier(ctx, micP[0], micP[1], micP[2], micP[3]);
      ctx.strokeStyle = on > 0.4 ? C.dim : "#3A3A3A";
      strokeBezier(ctx, nP[0], nP[1], nP[2], nP[3]);
      strokeBezier(ctx, ml[0], ml[1], ml[2], ml[3]);
      strokeBezier(ctx, mr[0], mr[1], mr[2], mr[3]);
      ctx.strokeStyle = howl > 0.25 && on < 0.6 ? C.howl : (on > 0.4 ? C.dim : "#3A3A3A");
      strokeBezier(ctx, mon[0], mon[1], mon[2], mon[3]);
      ctx.globalAlpha = 1;
      pulseBezier(ctx, micP[0], micP[1], micP[2], micP[3], t, howl > 0.3 && on < 0.5 ? C.howl : C.primary, 2);
      if (on > 0.2) {
        pulseBezier(ctx, nP[0], nP[1], nP[2], nP[3], t + 0.2, C.primary, 2);
        pulseBezier(ctx, ml[0], ml[1], ml[2], ml[3], t + 0.35, C.primary, 2);
        pulseBezier(ctx, mr[0], mr[1], mr[2], mr[3], t + 0.4, C.primary, 2);
        pulseBezier(ctx, mon[0], mon[1], mon[2], mon[3], t + 0.3, howl > 0.2 && on < 0.6 ? C.howl : C.primary, 2);
      }

      nullynAI(ctx, n.x, n.y, on > 0.3);
      const micPos = performer(ctx, px, py, t);
      // ringing band follows the performer (howl), then Nullyn AI locks on
      trackRing(ctx, micPos.x, micPos.y, on > 0.55, t);

      // faint sound from mains
      const a = 0.35 + 0.15 * on;
      ctx.strokeStyle = C.primary;
      ctx.globalAlpha = 0.25 * a;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const r = 40 + i * 28 + (t * 40) % 28;
        ctx.beginPath(); ctx.arc(L.mainL.x, L.mainL.y - 20, r, 0.9, 2.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(L.mainR.x, L.mainR.y - 20, r, 0.9 + Math.PI, 2.2 + Math.PI); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      drawEqPanel(ctx, 48, 36, 560, 280, howl, on, t, C);
    }
    const api = bootCanvas(canvas, DURATION, draw, 5.0, "NULLYN_MOVE");
    if (api && document.getElementById("anim-move") && !document.getElementById("anim-gain") && /record=1/.test(location.search)) {
      window.NULLYN = api;
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 3. Signal path — 6.5s, XLR in → Nullyn AI → XLR out                 */
  /* ------------------------------------------------------------------ */
  (function () {
    const canvas = document.getElementById("anim-path");
    const DURATION = 6.5;
    const C = cssColors();
    function xlr(c, x, y, flip) {
      c.save();
      c.translate(x, y);
      if (flip) c.scale(-1, 1);
      c.fillStyle = "#2A2A2A";
      rr(c, -70, -22, 90, 44, 10);
      c.fill();
      c.fillStyle = "#1A1A1A";
      c.beginPath(); c.arc(30, 0, 20, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "#3A3A3A";
      c.lineWidth = 2;
      c.stroke();
      // pins
      c.fillStyle = "#C8C8C8";
      [[18, -8], [18, 8], [38, 0]].forEach(([px, py]) => {
        c.beginPath(); c.arc(px, py, 3.2, 0, Math.PI * 2); c.fill();
      });
      c.restore();
    }
    function cableRun(c, x0, x1, y, t, color) {
      c.strokeStyle = "#333";
      c.lineWidth = 8;
      c.lineCap = "round";
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      c.strokeStyle = color;
      c.lineWidth = 3;
      c.globalAlpha = 0.85;
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      c.globalAlpha = 1;
      const u = (t % 1);
      const px = lerp(x0, x1, u);
      c.fillStyle = color;
      c.beginPath(); c.arc(px, y, 5, 0, Math.PI * 2); c.fill();
    }
    function draw(ctx, t) {
      const W = 1920, H = 1080;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      const cy = 540;
      // explode: units spread in then hold
      const spread = 1; // already exploded view
      const inX = 260, outX = 1660, mid = 960;
      label(ctx, C, "XLR in", inX, 300, C.muted, 22);
      label(ctx, C, "Nullyn AI", mid, 200, C.primary, 26);
      label(ctx, C, "XLR out", outX, 300, C.muted, 22);

      cableRun(ctx, inX + 50, mid - 150, cy, t * 0.55, t > 0.4 ? C.howl : C.muted);
      // after Nullyn AI, the outgoing pulse is clean
      cableRun(ctx, mid + 150, outX - 50, cy, t * 0.55 + 0.5, t > 1.2 ? C.primary : C.muted);

      xlr(ctx, inX, cy, false);
      xlr(ctx, outX, cy, true);

      // Nullyn AI — exploded core
      const on = smoothstep(0.8, 1.6, t);
      ctx.save();
      ctx.translate(mid, cy);
      if (on) { ctx.shadowColor = C.primary; ctx.shadowBlur = 36 * on; }
      ctx.fillStyle = "#0E0E0E";
      rr(ctx, -150, -90, 300, 180, 22);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4 + 0.6 * on;
      ctx.stroke();
      ctx.globalAlpha = 1;
      // inner path
      ctx.strokeStyle = C.dim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-150, 0);
      ctx.lineTo(-40, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.lineTo(150, 0);
      ctx.stroke();
      drawCancelMark(ctx, 0, 0, 72, on > 0.3 ? C.primary : "#666");
      // notch ticks appear when on
      if (on > 0.2) {
        ctx.fillStyle = C.primary;
        ctx.globalAlpha = on;
        for (let i = 0; i < 5; i++) {
          const h = 8 + (i === 2 ? 22 : 10);
          ctx.fillRect(-70 + i * 28, 48 - h, 10, h);
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // incoming howl calmed in the middle
      const go = (t * 0.55) % 1;
      if (go < 0.45) {
        const x = lerp(inX + 50, mid - 20, go / 0.45);
        ctx.fillStyle = C.howl;
        ctx.beginPath(); ctx.arc(x, cy, 7, 0, Math.PI * 2); ctx.fill();
      } else if (go > 0.55) {
        const x = lerp(mid + 20, outX - 50, (go - 0.55) / 0.45);
        ctx.fillStyle = C.primary;
        ctx.beginPath(); ctx.arc(x, cy, 7, 0, Math.PI * 2); ctx.fill();
      }
      const howlIn = 0.85;
      const notchOut = smoothstep(0.8, 1.8, t);
      drawEqPanel(ctx, 80, 740, 820, 280, howlIn, 0, t, C);
      drawEqPanel(ctx, 1020, 740, 820, 280, howlIn * (1 - notchOut * 0.15), notchOut, t, C);
    }
    const api = bootCanvas(canvas, DURATION, draw, 4.0, "NULLYN_PATH");
    if (api && document.getElementById("anim-path") && !document.getElementById("anim-gain") && !document.getElementById("anim-move") && /record=1/.test(location.search)) {
      window.NULLYN = api;
    }
  })();
})();

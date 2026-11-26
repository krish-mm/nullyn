/* Nullyn AI homepage story animations — lazy-start, reduced-motion freeze. */
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
      primary: css.getPropertyValue("--primary").trim() || "#B6FF00",
      dim: css.getPropertyValue("--primary-dim").trim() || "#7FBF00",
      howl: css.getPropertyValue("--howl").trim() || "#FF1A1A",
      line: css.getPropertyValue("--line").trim() || "rgba(243,244,241,0.10)",
      lineStrong: css.getPropertyValue("--line-strong").trim() || "rgba(243,244,241,0.18)",
      pGlow: css.getPropertyValue("--primary-glow").trim() || "rgba(182,255,0,0.28)",
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
    c.font = "600 " + (size || 18) + "px Manrope, ui-sans-serif, system-ui, sans-serif";
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

    function drawEqPanel(c, x, y, w, h, howl, notch, t, C, opts) {
      opts = opts || {};
      const bands = 28;
      const fMin = 50, fMax = 16000;
      const freqAt = function (i) { return fMin * Math.pow(fMax / fMin, i / (bands - 1)); };
      const howlF = opts.howlHz != null ? opts.howlHz : 2500;
      const level = opts.level != null ? opts.level : 1;
      let howlBand = 0, best = Infinity;
      for (let i = 0; i < bands; i++) {
        const d = Math.abs(Math.log(freqAt(i) / howlF));
        if (d < best) { best = d; howlBand = i; }
      }
      const padL = Math.max(14, w * 0.035);
      const padR = padL;
      const padT = Math.max(40, h * 0.20);
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
      c.font = "600 " + capSize + "px Manrope, ui-sans-serif, system-ui, sans-serif";
      c.fillStyle = C.muted;
      c.textAlign = "left";
      c.textBaseline = "top";
      c.fillText("Illustrative — not measured data", x + padL, y + Math.max(8, h * 0.035));

      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const gap = Math.max(2, innerW * 0.012);
      const bw = (innerW - gap * (bands - 1)) / bands;
      const baseY = y + padT + innerH;
      const barX = function (i) { return x + padL + i * (bw + gap); };

      const musicAt = function (i) {
        const f = freqAt(i);
        const u = i / (bands - 1);
        const env = 0.34 + 0.28 * Math.sin(Math.PI * Math.min(1, u * 1.15)) * Math.exp(-Math.max(0, u - 0.55) * 1.4);
        let hgt = env + 0.055 * Math.sin(t * 2.3 + i * 0.55) + 0.03 * Math.sin(t * 4.1 + f * 0.001);
        hgt *= 0.75 + 0.25 * level;
        return Math.max(0.08, Math.min(0.92, hgt));
      };

      const spikeH = 0.97 + 0.025 * Math.sin(t * 14);
      const deep = 0.055;
      const heights = [];
      for (let i = 0; i < bands; i++) {
        const music = musicAt(i);
        const dist = Math.abs(i - howlBand);
        let hgt = music;
        if (dist === 0) {
          const unnotched = music * (1 - howl) + spikeH * howl;
          hgt = unnotched * (1 - notch) + deep * notch;
        }
        heights.push(Math.max(0.04, Math.min(1, hgt)));
      }

      // Faint ghost of the runaway spike being cut.
      if (howl > 0.15 && notch > 0.2) {
        const gx = barX(howlBand);
        const gh = innerH * spikeH;
        c.save();
        c.globalAlpha = 0.22 * Math.min(1, howl) * Math.min(1, notch);
        c.strokeStyle = C.howl;
        c.lineWidth = 1.5;
        rr(c, gx, baseY - gh, Math.max(1, bw), gh, 2);
        c.stroke();
        c.restore();
      }

      for (let i = 0; i < bands; i++) {
        const hgt = heights[i];
        const bh = innerH * hgt;
        const bx = barX(i);
        const dist = Math.abs(i - howlBand);
        const ringing = dist === 0 && howl > 0.2 && notch < 0.55;
        c.fillStyle = ringing ? C.howl : C.primary;
        c.globalAlpha = ringing ? 0.85 + 0.15 * Math.sin(t * 16) : 0.9;
        rr(c, bx, baseY - bh, Math.max(1, bw), bh, 2);
        c.fill();
        c.globalAlpha = 1;
      }

      const xAtF = function (f) {
        return x + padL + (Math.log(f / fMin) / Math.log(fMax / fMin)) * innerW;
      };

      // Narrow neon V through the cut band — neighbors stay at full music level.
      if (notch > 0.2) {
        const midX = barX(howlBand) + bw / 2;
        const midY = baseY - innerH * heights[howlBand];
        const leftI = Math.max(0, howlBand - 1);
        const rightI = Math.min(bands - 1, howlBand + 1);
        const leftX = barX(leftI) + bw / 2;
        const rightX = barX(rightI) + bw / 2;
        const leftY = baseY - innerH * heights[leftI];
        const rightY = baseY - innerH * heights[rightI];
        c.save();
        c.strokeStyle = C.primary;
        c.lineWidth = Math.max(2, w * 0.0035);
        c.lineJoin = "round";
        c.lineCap = "round";
        c.globalAlpha = Math.min(1, notch);
        c.beginPath();
        c.moveTo(leftX, leftY);
        c.lineTo(midX, midY + 1);
        c.lineTo(rightX, rightY);
        c.stroke();
        // arrow / marker above the V
        const tipY = midY - Math.max(8, h * 0.03);
        c.beginPath();
        c.moveTo(midX, tipY + Math.max(8, h * 0.028));
        c.lineTo(midX, tipY);
        c.stroke();
        c.beginPath();
        c.moveTo(midX - 4, tipY + 5);
        c.lineTo(midX, tipY);
        c.lineTo(midX + 4, tipY + 5);
        c.stroke();
        const khz = howlF >= 1000;
        const label = khz
          ? ("notch at ~" + (Math.abs(howlF / 1000 - Math.round(howlF / 1000)) < 0.05 ? String(Math.round(howlF / 1000)) : (howlF / 1000).toFixed(1)) + " kHz")
          : ("notch at ~" + Math.round(howlF) + " Hz");
        const labSize = Math.max(10, Math.round(h * 0.048));
        c.font = "500 " + labSize + "px IBM Plex Mono, ui-monospace, monospace";
        c.fillStyle = C.primary;
        let labX = midX;
        let labY = Math.min(leftY, rightY) - 8;
        const minLabY = y + labSize + 22;
        c.textAlign = "center";
        c.textBaseline = "bottom";
        if (labY < minLabY) {
          labY = minLabY;
        }
        c.fillText(label, labX, labY);
        c.restore();
      }

      c.fillStyle = C.muted;
      c.font = "500 " + Math.max(10, Math.round(h * 0.048)) + "px IBM Plex Mono, ui-monospace, monospace";
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
      c.font = "500 " + Math.max(11, Math.round(h * 0.055)) + "px IBM Plex Mono, ui-monospace, monospace";
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
    function spectrum(c, x, y, w, h, howl, clean, t, level) {
      drawEqPanel(c, x, y, w, h, howl, clean, t, C, { level: level });
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
        spectrum(ctx, x0 + 240, 300, 580, 520, howlAmt, cleanAmt, t, level);
        if (howlAmt > 0.2 && cleanAmt < 0.4) {
          ctx.save();
          ctx.globalAlpha = 0.18 * howlAmt;
          ctx.fillStyle = C.howl;
          rr(ctx, x0, 80, 880, 920, 28);
          ctx.fill();
          ctx.restore();
        }
        if (cleanAmt > 0) {
          // Closed-loop chain on the With side: mic + speaker feed into Nullyn AI.
          const sy = 880;
          const cx = x0 + 440;
          ctx.save();
          ctx.globalAlpha = Math.min(1, 0.35 + cleanAmt);
          ctx.font = "500 13px IBM Plex Mono, ui-monospace, monospace";
          ctx.fillStyle = C.muted;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const nodes = ["MIC", "Nullyn AI", "MIXER", "SPEAKERS"];
          const gap = 150;
          const startX = cx - (gap * 1.5);
          nodes.forEach((name, i) => {
            const x = startX + i * gap;
            ctx.strokeStyle = C.primary;
            ctx.fillStyle = i === 1 ? C.primary : "transparent";
            ctx.lineWidth = 1.5;
            rr(ctx, x - 58, sy - 18, 116, 36, 8);
            if (i === 1) ctx.fill();
            ctx.stroke();
            ctx.fillStyle = i === 1 ? C.bg : C.text;
            ctx.fillText(name, x, sy);
            if (i < 3) {
              ctx.strokeStyle = C.dim;
              ctx.beginPath();
              ctx.moveTo(x + 60, sy);
              ctx.lineTo(x + gap - 60, sy);
              ctx.stroke();
            }
          });
          // speaker-feed return under the chain
          ctx.strokeStyle = C.primary;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(startX + gap * 2, sy + 20);
          ctx.lineTo(startX + gap * 2, sy + 36);
          ctx.lineTo(startX + gap, sy + 36);
          ctx.lineTo(startX + gap, sy + 20);
          ctx.stroke();
          // arrow into Nullyn AI
          ctx.beginPath();
          ctx.moveTo(startX + gap - 6, sy + 26);
          ctx.lineTo(startX + gap, sy + 20);
          ctx.lineTo(startX + gap + 6, sy + 26);
          ctx.stroke();
          ctx.fillStyle = C.primary;
          ctx.fillText("speaker feed", startX + gap * 1.5, sy + 52);
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
    if (api && /record=1/.test(location.search) && document.querySelectorAll("[id^='anim-']").length === 1) {
      window.NULLYN = api;
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 2. Open hardware exploded view — 7s                                  */
  /* ------------------------------------------------------------------ */
  (function () {
    const canvas = document.getElementById("anim-hardware");
    const DURATION = 7;
    const C = cssColors();

    function mono(c, text, x, y, size, color, align, weight) {
      c.save();
      c.font = (weight || 500) + " " + size + "px IBM Plex Mono, ui-monospace, monospace";
      c.fillStyle = color;
      c.textAlign = align || "left";
      c.textBaseline = "middle";
      c.fillText(text, x, y);
      c.restore();
    }
    function display(c, text, x, y, size, color, align) {
      c.save();
      c.font = "700 " + size + "px Syne, ui-sans-serif, sans-serif";
      c.fillStyle = color;
      c.textAlign = align || "center";
      c.textBaseline = "middle";
      c.fillText(text, x, y);
      c.restore();
    }
    function plate(c, x, y, w, h, thick, fill, edge) {
      // 2.5D slab: top face + right + bottom edges
      const dx = 22, dy = 12;
      c.beginPath();
      c.moveTo(x + w, y);
      c.lineTo(x + w + dx, y + dy);
      c.lineTo(x + w + dx, y + h + dy);
      c.lineTo(x + w, y + h);
      c.closePath();
      c.fillStyle = edge || "#1A1A1A";
      c.fill();
      c.beginPath();
      c.moveTo(x, y + h);
      c.lineTo(x + dx, y + h + dy);
      c.lineTo(x + w + dx, y + h + dy);
      c.lineTo(x + w, y + h);
      c.closePath();
      c.fillStyle = edge || "#141414";
      c.fill();
      rr(c, x, y, w, h, 10);
      c.fillStyle = fill;
      c.fill();
      c.strokeStyle = "rgba(243,244,241,0.12)";
      c.lineWidth = 1.5;
      c.stroke();
    }
    function leader(c, fromX, fromY, toX, toY, text, side) {
      c.save();
      c.strokeStyle = "rgba(243,244,241,0.28)";
      c.lineWidth = 1.25;
      c.beginPath();
      c.moveTo(fromX, fromY);
      c.lineTo(toX, toY);
      c.stroke();
      c.beginPath();
      c.fillStyle = C.primary;
      c.arc(fromX, fromY, 2.6, 0, Math.PI * 2);
      c.fill();
      mono(c, text, toX + (side === "left" ? -8 : 8), toY, 16, C.text, side === "left" ? "right" : "left", 500);
      c.restore();
    }
    function xlrFace(c, x, y, r, lit) {
      c.save();
      c.beginPath();
      c.fillStyle = "#1C1C1C";
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
      c.lineWidth = 3;
      c.strokeStyle = lit ? C.primary : "#6A6A6A";
      c.stroke();
      c.fillStyle = lit ? C.primary : "#9A9A9A";
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        c.beginPath();
        c.arc(x + Math.cos(a) * r * 0.38, y + Math.sin(a) * r * 0.38, r * 0.12, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }
    function chip(c, x, y, w, h, name) {
      rr(c, x, y, w, h, 3);
      c.fillStyle = "#0E0E0E";
      c.fill();
      c.strokeStyle = C.dim;
      c.lineWidth = 1;
      c.stroke();
      // pins
      c.fillStyle = "#C4A574";
      const n = 6;
      for (let i = 0; i < n; i++) {
        const px = x + 6 + i * ((w - 12) / (n - 1));
        c.fillRect(px - 1.2, y - 4, 2.4, 4);
        c.fillRect(px - 1.2, y + h, 2.4, 4);
      }
      mono(c, name, x + w / 2, y + h / 2, 11, C.text, "center", 500);
    }
    function draw(ctx, t) {
      const W = 1920, H = 1080;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      const explode = smoothstep(0.55, 2.5, t);
      const labelsOn = smoothstep(2.3, 3.5, t);
      const tagOn = smoothstep(4.0, 4.9, t);
      const showIn = explode; // 0 = sealed enclosure only

      display(ctx, "Nullyn AI", 960, 70, 44, C.text, "center");
      mono(ctx, "DEDICATED BOX", 960, 112, 14, C.primary, "center", 500);

      const cx = 960;
      const boxW = 560;
      // Sealed unit sits mid-stage; exploded layers fan toward the top.
      const sealedY = 360;
      const sealedH = 280;
      // Fully exploded Y (top of each slab)
      const yLid  = 150;
      const ySeed = 310;
      const yPcb  = 470;
      const yJack = 680;
      const yEncl = 780;
      const lidH = 120, seedW = 300, seedH = 108, pcbW = 500, pcbH = 150, enclH = 150;

      function ly(openY, closedY, hClosed, hOpen) {
        // Interpolate top-Y and height from sealed box to exploded slot
        return {
          y: lerp(closedY, openY, explode),
          h: lerp(hClosed, hOpen, explode)
        };
      }

      // When sealed, everything shares the one enclosure rect.
      const encl = ly(yEncl, sealedY, sealedH, enclH);
      const lid  = ly(yLid,  sealedY, sealedH, lidH);
      const pcb  = ly(yPcb,  sealedY + 20, sealedH - 40, pcbH);
      const seed = ly(ySeed, sealedY + 70, 120, seedH);
      const jackY = lerp(sealedY + sealedH / 2, yJack, explode);
      const jOut = 40 * explode;
      const jMic = cx - 210 - jOut;
      const jRef = cx;
      const jOutX = cx + 210 + jOut;

      // ---- Enclosure tray (always visible) ----
      plate(ctx, cx - boxW / 2, encl.y, boxW, encl.h, 24, "#1B1B1B", "#101010");
      ctx.fillStyle = "#3A3A3A";
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(cx + sx * (boxW / 2 - 20), encl.y + encl.h / 2 + sy * (encl.h / 2 - 18), 5.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sealed face (logo + end jacks) fades as the unit opens
      if (showIn < 0.85) {
        ctx.save();
        ctx.globalAlpha = 1 - smoothstep(0.0, 0.4, showIn);
        drawCancelMark(ctx, cx, encl.y + encl.h / 2, 88, C.primary);
        xlrFace(ctx, cx - boxW / 2 + 58, encl.y + encl.h / 2 - 32, 22, false);
        xlrFace(ctx, cx - boxW / 2 + 58, encl.y + encl.h / 2 + 32, 22, false);
        xlrFace(ctx, cx + boxW / 2 - 58, encl.y + encl.h / 2, 26, false);
        mono(ctx, "MIC IN", cx - boxW / 2 + 58, encl.y + encl.h / 2 - 58, 11, C.muted, "center", 500);
        mono(ctx, "REF IN", cx - boxW / 2 + 58, encl.y + encl.h / 2 + 58, 11, C.muted, "center", 500);
        mono(ctx, "OUT", cx + boxW / 2 - 58, encl.y + encl.h / 2 + 44, 11, C.muted, "center", 500);
        ctx.restore();
      }

      // ---- Internals: skip while fully sealed so nothing leaks through ----
      if (showIn > 0.02) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, showIn * 1.15);

        // Neutrik jacks, sliding out to a clear row
        xlrFace(ctx, jMic, jackY, 30, explode > 0.45);
        xlrFace(ctx, jRef, jackY, 30, explode > 0.45);
        xlrFace(ctx, jOutX, jackY, 30, explode > 0.45);
        if (explode > 0.55) {
          mono(ctx, "MIC IN", jMic, jackY + 44, 13, C.text, "center", 500);
          mono(ctx, "SPEAKER FEED / REF IN", jRef, jackY + 44, 13, C.primary, "center", 500);
          mono(ctx, "OUT", jOutX, jackY + 44, 13, C.text, "center", 500);
        }

        // Carrier PCB
        plate(ctx, cx - pcbW / 2, pcb.y, pcbW, pcb.h, 16, "#152816", "#0C180A");
        ctx.save();
        ctx.globalAlpha *= 0.45;
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 4; i++) {
          const yy = pcb.y + 36 + i * 24;
          ctx.beginPath();
          ctx.moveTo(cx - pcbW / 2 + 20, yy);
          ctx.lineTo(cx + pcbW / 2 - 20, yy);
          ctx.stroke();
        }
        ctx.restore();
        chip(ctx, cx - pcbW / 2 + 22, pcb.y + 22, 86, 30, "1246");
        chip(ctx, cx - pcbW / 2 + 22 + 96, pcb.y + 22, 86, 30, "1246");
        chip(ctx, cx + pcbW / 2 - 22 - 86, pcb.y + 22, 86, 30, "1646");
        rr(ctx, cx - 30, pcb.y + 92, 60, 36, 4);
        ctx.fillStyle = "#2B2B22";
        ctx.fill();
        ctx.strokeStyle = "#8A8A60";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = "#C4A574";
        ctx.fillRect(cx - 10, pcb.y + 100, 20, 16);
        mono(ctx, "RLY", cx, pcb.y + 136, 11, C.muted, "center", 500);

        // Daisy Seed 3
        plate(ctx, cx - seedW / 2, seed.y, seedW, seed.h, 14, "#141414", "#0A0A0A");
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 2;
        rr(ctx, cx - seedW / 2, seed.y, seedW, seed.h, 10);
        ctx.stroke();
        rr(ctx, cx - 32, seed.y + 22, 64, 64, 4);
        ctx.fillStyle = "#0A0A0A";
        ctx.fill();
        ctx.strokeStyle = C.dim;
        ctx.stroke();
        ctx.fillStyle = "#C4A574";
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(cx - seedW / 2 + 10, seed.y + 16 + i * 8, 10, 4);
          ctx.fillRect(cx + seedW / 2 - 20, seed.y + 16 + i * 8, 10, 4);
        }
        drawCancelMark(ctx, cx, seed.y + seed.h / 2, 26, C.primary);

        // Lid (drawn last so it lifts off the top)
        plate(ctx, cx - boxW / 2, lid.y, boxW, lid.h, 18, "#222222", "#161616");
        drawCancelMark(ctx, cx, lid.y + lid.h / 2, 64, C.primary);

        ctx.restore();
      }

      if (labelsOn > 0) {
        ctx.save();
        ctx.globalAlpha = labelsOn;
        const right = 1500;
        leader(ctx, cx + boxW / 2 + 10, lid.y + lid.h / 2, right, lid.y + lid.h / 2, "1590BB lid", "right");
        leader(ctx, cx + seedW / 2 + 10, seed.y + seed.h / 2, right, seed.y + seed.h / 2, "Daisy Seed 3", "right");
        leader(ctx, cx + pcbW / 2 + 10, pcb.y + 32, right, pcb.y + 28, "Carrier PCB", "right");
        leader(ctx, cx + pcbW / 2 - 24, pcb.y + 48, right, pcb.y + 52, "2× THAT1246 (mic + Ref In) / THAT1646 out", "right");
        leader(ctx, cx + 34, pcb.y + 112, right, pcb.y + 118, "Relay bypass", "right");
        leader(ctx, jOutX + 32, jackY, right, jackY, "Neutrik — MIC IN, REF IN, OUT", "right");
        leader(ctx, cx - boxW / 2 - 4, encl.y + encl.h / 2, 420, encl.y + encl.h / 2, "1590BB enclosure", "left");
        ctx.restore();
      }

      if (tagOn > 0) {
        ctx.save();
        ctx.globalAlpha = tagOn;
        rr(ctx, 960 - 440, 978, 880, 68, 28);
        ctx.fillStyle = C.surface;
        ctx.fill();
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        mono(ctx, "Off-the-shelf parts, with a fail-safe bypass", 960, 1002, 16, C.text, "center", 500);
        mono(ctx, "Datasheet arithmetic — not a measured product latency", 960, 1026, 12, C.muted, "center", 500);
        ctx.restore();
      }
    }
    const api = bootCanvas(canvas, DURATION, draw, 5.6, "NULLYN_HARDWARE");
    if (api && /record=1/.test(location.search) && document.querySelectorAll("[id^='anim-']").length === 1) {
      window.NULLYN = api;
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 3. Night timeline — 7.5s, illustrative event run                     */
  /* ------------------------------------------------------------------ */
  (function () {
    const canvas = document.getElementById("anim-night");
    const DURATION = 7.5;
    const C = cssColors();

    const stations = [
      { u: 0.08, name: "Speeches" },
      { u: 0.36, name: "Toasts" },
      { u: 0.64, name: "Dance floor" },
      { u: 0.92, name: "Last song" },
    ];
    const events = [
      { at: 1.05, u: 0.22 },
      { at: 2.20, u: 0.50 },
      { at: 3.30, u: 0.72 },
      { at: 3.95, u: 0.80 },
      { at: 5.05, u: 0.97 },
    ];
    const CATCH = 0.55;

    function mono(c, text, x, y, size, color, align, weight) {
      c.save();
      c.font = (weight || 500) + " " + size + "px IBM Plex Mono, ui-monospace, monospace";
      c.fillStyle = color;
      c.textAlign = align || "center";
      c.textBaseline = "middle";
      c.fillText(text, x, y);
      c.restore();
    }
    function display(c, text, x, y, size, color, align) {
      c.save();
      c.font = "700 " + size + "px Syne, ui-sans-serif, sans-serif";
      c.fillStyle = color;
      c.textAlign = align || "center";
      c.textBaseline = "middle";
      c.fillText(text, x, y);
      c.restore();
    }
    function iconMic(c, x, y, color) {
      c.save();
      c.strokeStyle = color;
      c.lineWidth = 2.4;
      c.lineCap = "round";
      rr(c, x - 9, y - 22, 18, 26, 9);
      c.stroke();
      c.beginPath();
      c.arc(x, y + 4, 13, 0.15 * Math.PI, 0.85 * Math.PI);
      c.moveTo(x, y + 16);
      c.lineTo(x, y + 26);
      c.moveTo(x - 10, y + 26);
      c.lineTo(x + 10, y + 26);
      c.stroke();
      c.restore();
    }
    function iconGlass(c, x, y, color) {
      c.save();
      c.strokeStyle = color;
      c.lineWidth = 2.4;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.beginPath();
      c.moveTo(x - 12, y - 20);
      c.lineTo(x + 12, y - 20);
      c.lineTo(x + 7, y - 2);
      c.lineTo(x - 7, y - 2);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(x, y - 2);
      c.lineTo(x, y + 18);
      c.moveTo(x - 10, y + 18);
      c.lineTo(x + 10, y + 18);
      c.stroke();
      c.restore();
    }
    function iconDance(c, x, y, color) {
      c.save();
      c.strokeStyle = color;
      c.fillStyle = color;
      c.lineWidth = 2.4;
      c.lineCap = "round";
      c.beginPath();
      c.arc(x, y - 16, 5, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(x, y - 10);
      c.lineTo(x, y + 6);
      c.moveTo(x, y - 4);
      c.lineTo(x - 12, y + 4);
      c.moveTo(x, y - 4);
      c.lineTo(x + 12, y - 10);
      c.moveTo(x, y + 6);
      c.lineTo(x - 8, y + 22);
      c.moveTo(x, y + 6);
      c.lineTo(x + 10, y + 22);
      c.stroke();
      c.restore();
    }
    function iconNote(c, x, y, color) {
      c.save();
      c.fillStyle = color;
      c.strokeStyle = color;
      c.lineWidth = 2.4;
      c.lineCap = "round";
      c.beginPath();
      c.ellipse(x - 8, y + 10, 8, 6, -0.25, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo(x, y + 10);
      c.lineTo(x, y - 20);
      c.lineTo(x + 16, y - 14);
      c.stroke();
      c.restore();
    }
    const icons = [iconMic, iconGlass, iconDance, iconNote];

    function pin(c, x, y, kind, a) {
      // kind: 'risk' | 'caught'
      c.save();
      c.globalAlpha = a;
      const color = kind === "risk" ? C.howl : C.primary;
      c.fillStyle = color;
      c.strokeStyle = color;
      c.beginPath();
      c.moveTo(x, y + 28);
      c.lineTo(x - 14, y);
      c.arc(x, y - 4, 16, Math.PI * 0.85, Math.PI * 0.15, false);
      c.closePath();
      c.fill();
      c.fillStyle = C.bg;
      if (kind === "risk") {
        c.font = "700 18px Syne, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("!", x, y - 5);
      } else {
        // tick
        c.strokeStyle = C.bg;
        c.lineWidth = 3;
        c.lineCap = "round";
        c.lineJoin = "round";
        c.beginPath();
        c.moveTo(x - 6, y - 4);
        c.lineTo(x - 1, y + 2);
        c.lineTo(x + 8, y - 10);
        c.stroke();
      }
      c.restore();
    }

    function draw(ctx, t) {
      const W = 1920, H = 1080;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      const intro = smoothstep(0.0, 0.7, t);
      const tagOn = smoothstep(5.7, 6.5, t);
      const playU = clamp01(smoothstep(0.7, 5.5, t));

      ctx.save();
      ctx.globalAlpha = intro;
      display(ctx, "A night with Nullyn AI", 960, 100, 48, C.text, "center");
      mono(ctx, "ILLUSTRATIVE EVENT  ·  NOT MEASURED DATA", 960, 144, 14, C.muted, "center", 500);
      // Compact closed-loop chain so the timeline still shows the reference feed.
      const chainY = 200;
      const labs = ["MIC", "Nullyn AI", "MIXER", "SPEAKERS"];
      const cGap = 200;
      const c0 = 960 - cGap * 1.5;
      ctx.font = "500 13px IBM Plex Mono, ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      labs.forEach((name, i) => {
        const x = c0 + i * cGap;
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 1.4;
        ctx.fillStyle = i === 1 ? C.primary : "transparent";
        rr(ctx, x - 54, chainY - 16, 108, 32, 8);
        if (i === 1) ctx.fill();
        ctx.stroke();
        ctx.fillStyle = i === 1 ? C.bg : C.text;
        ctx.fillText(name, x, chainY);
        if (i < 3) {
          ctx.strokeStyle = C.dim;
          ctx.beginPath();
          ctx.moveTo(x + 56, chainY);
          ctx.lineTo(x + cGap - 56, chainY);
          ctx.stroke();
        }
      });
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(c0 + cGap * 2, chainY + 18);
      ctx.lineTo(c0 + cGap * 2, chainY + 32);
      ctx.lineTo(c0 + cGap, chainY + 32);
      ctx.lineTo(c0 + cGap, chainY + 18);
      ctx.moveTo(c0 + cGap - 5, chainY + 24);
      ctx.lineTo(c0 + cGap, chainY + 18);
      ctx.lineTo(c0 + cGap + 5, chainY + 24);
      ctx.stroke();
      ctx.fillStyle = C.primary;
      ctx.fillText("speaker feed", c0 + cGap * 1.5, chainY + 48);

      const x0 = 200, x1 = 1720, y = 620;
      // track
      ctx.lineCap = "round";
      ctx.strokeStyle = C.lineStrong;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      // progress
      const xPlay = lerp(x0, x1, playU);
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(xPlay, y);
      ctx.stroke();
      // playhead
      ctx.shadowColor = C.pGlow;
      ctx.shadowBlur = 18;
      ctx.fillStyle = C.primary;
      ctx.beginPath();
      ctx.arc(xPlay, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      stations.forEach((s, i) => {
        const x = lerp(x0, x1, s.u);
        const on = playU >= s.u - 0.02;
        const col = on ? C.text : C.muted;
        ctx.beginPath();
        ctx.fillStyle = on ? C.primary : C.elev;
        ctx.strokeStyle = on ? C.primary : C.lineStrong;
        ctx.lineWidth = 2;
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        icons[i](ctx, x, y - 86, col);
        mono(ctx, s.name.toUpperCase(), x, y + 48, 16, col, "center", 500);
      });

      events.forEach((e) => {
        const born = t - e.at;
        if (born < 0) return;
        const x = lerp(x0, x1, e.u);
        const drop = smoothstep(0, 0.22, born);
        const caught = born > CATCH;
        const catchAmt = smoothstep(CATCH, CATCH + 0.22, born);
        const yPin = y - 24 - (1 - drop) * 80;
        if (!caught) {
          pin(ctx, x, yPin, "risk", drop);
          if (drop > 0.6 && catchAmt < 0.2) {
            mono(ctx, "HOWL RISK", x, yPin - 36, 12, C.howl, "center", 600);
          }
        } else {
          pin(ctx, x, yPin, "caught", 1);
          ctx.save();
          ctx.globalAlpha = catchAmt;
          mono(ctx, "NOTCHED", x, yPin - 36, 12, C.primary, "center", 600);
          ctx.restore();
        }
      });
      ctx.restore();

      if (tagOn > 0) {
        ctx.save();
        ctx.globalAlpha = tagOn;
        rr(ctx, 960 - 420, 860, 840, 110, 20);
        ctx.fillStyle = C.surface;
        ctx.fill();
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        display(ctx, "Zero howls reached the crowd.", 960, 900, 34, C.text, "center");
        mono(ctx, "ILLUSTRATIVE — NOT MEASURED DATA", 960, 938, 14, C.muted, "center", 500);
        ctx.restore();
      }
    }
    const api = bootCanvas(canvas, DURATION, draw, 6.6, "NULLYN_NIGHT");
    if (api && /record=1/.test(location.search) && document.querySelectorAll("[id^='anim-']").length === 1) {
      window.NULLYN = api;
    }
  })();
})();

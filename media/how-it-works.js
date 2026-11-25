/* Nullyn how-it-works event walkthrough — 9s loop, lazy-starts in view. */
(function () {
const W = 1920, H = 1080;
    const DURATION = 9;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.getElementById("hiw-scene");
    if (!canvas) return;
    const stageRoot = document.getElementById("hiw-stage") || canvas;
    const ctx = canvas.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const C = {
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

    const LAYOUT = {
      mainL: { x: 236, y: 428, ox: 292, oy: 368 },
      mainR: { x: 1684, y: 428, ox: 1628, oy: 368 },
      wedgeL: { x: 508, y: 618, ox: 548, oy: 575 },
      wedgeR: { x: 1412, y: 618, ox: 1372, oy: 575 },
      start: { x: 980, y: 545 },
      end: { x: 628, y: 575 },
      nullyn: { x: 960, y: 722 },
      mixer: { x: 1578, y: 838 },
    };

    const CANCEL_MARK_D = "M 2.000 32.000 A 30.000 30.000 0 1 1 62.000 32.000 A 30.000 30.000 0 1 1 2.000 32.000 Z M 13.515 32.834 L 14.215 30.719 L 14.878 29.166 L 15.555 27.768 L 16.222 26.543 L 16.872 25.490 L 17.495 24.613 L 18.080 23.911 L 18.612 23.384 L 19.075 23.022 L 19.453 22.804 L 19.747 22.694 L 19.985 22.653 L 20.218 22.659 L 20.499 22.719 L 20.858 22.858 L 21.300 23.104 L 21.812 23.469 L 22.381 23.957 L 22.991 24.562 L 23.632 25.275 L 24.296 26.084 L 24.977 26.977 L 25.671 27.943 L 26.376 28.968 L 27.089 30.041 L 27.809 31.150 L 28.536 32.283 L 29.267 33.427 L 29.983 34.173 L 30.930 34.588 L 31.964 34.609 L 32.927 34.233 L 33.673 33.517 L 34.088 32.570 L 34.109 31.536 L 33.733 30.573 L 33.733 30.573 L 33.000 29.425 L 32.262 28.275 L 31.518 27.130 L 30.767 26.000 L 30.007 24.895 L 29.237 23.824 L 28.454 22.797 L 27.654 21.822 L 26.830 20.908 L 25.976 20.063 L 25.080 19.297 L 24.129 18.622 L 23.106 18.059 L 22.001 17.636 L 20.818 17.393 L 19.586 17.368 L 18.360 17.579 L 17.190 18.011 L 16.104 18.633 L 15.102 19.413 L 14.170 20.333 L 13.291 21.385 L 12.450 22.569 L 11.635 23.888 L 10.838 25.351 L 10.050 26.980 L 9.249 28.867 L 8.485 31.166 L 8.357 32.192 L 8.631 33.188 L 9.267 34.004 L 10.166 34.515 L 11.192 34.643 L 12.188 34.369 L 13.004 33.733 L 13.515 32.834 Z M 50.485 31.166 L 49.785 33.281 L 49.122 34.834 L 48.445 36.232 L 47.778 37.457 L 47.128 38.510 L 46.505 39.387 L 45.920 40.089 L 45.388 40.616 L 44.925 40.978 L 44.547 41.196 L 44.253 41.306 L 44.015 41.347 L 43.782 41.341 L 43.501 41.281 L 43.142 41.142 L 42.700 40.896 L 42.188 40.531 L 41.619 40.043 L 41.009 39.438 L 40.368 38.725 L 39.704 37.916 L 39.023 37.023 L 38.329 36.057 L 37.624 35.032 L 36.911 33.959 L 36.191 32.850 L 35.464 31.717 L 34.733 30.573 L 34.017 29.827 L 33.070 29.412 L 32.036 29.391 L 31.073 29.767 L 30.327 30.483 L 29.912 31.430 L 29.891 32.464 L 30.267 33.427 L 30.267 33.427 L 31.000 34.575 L 31.738 35.725 L 32.482 36.870 L 33.233 38.000 L 33.993 39.105 L 34.763 40.176 L 35.546 41.203 L 36.346 42.178 L 37.170 43.092 L 38.024 43.937 L 38.920 44.703 L 39.871 45.378 L 40.894 45.941 L 41.999 46.364 L 43.182 46.607 L 44.414 46.632 L 45.640 46.421 L 46.810 45.989 L 47.896 45.367 L 48.898 44.587 L 49.830 43.667 L 50.709 42.615 L 51.550 41.431 L 52.365 40.112 L 53.162 38.649 L 53.950 37.020 L 54.751 35.133 L 55.515 32.834 L 55.643 31.808 L 55.369 30.812 L 54.733 29.996 L 53.834 29.485 L 52.808 29.357 L 51.812 29.631 L 50.996 30.267 L 50.485 31.166 Z";
    const cancelMarkPath = new Path2D(CANCEL_MARK_D);
    const CROWD = buildCrowd();

    function drawCancelMark(c, x, y, size, color) {
      c.save();
      c.translate(x, y);
      c.scale(size / 64, size / 64);
      c.translate(-32, -32);
      c.fillStyle = color;
      c.fill(cancelMarkPath, "evenodd");
      c.restore();
    }

    function clamp01(x) { return Math.max(0, Math.min(1, x)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function smoothstep(a, b, x) {
      const t = clamp01((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    }
    function easeInOut(t) {
      t = clamp01(t);
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function beats(t) {
      const fadeIn = smoothstep(0.0, 0.28, t);
      const walk = easeInOut(smoothstep(1.55, 2.55, t));
      const howl = smoothstep(2.50, 3.80, t) * (1 - smoothstep(4.55, 6.15, t));
      const nullyn = smoothstep(3.90, 4.45, t);
      const notch = smoothstep(4.35, 5.40, t);
      const end = smoothstep(7.00, 7.50, t);
      return { t, fadeIn, walk, howl, nullyn, notch, end };
    }

    function performerPos(walk) {
      return {
        x: lerp(LAYOUT.start.x, LAYOUT.end.x, walk),
        y: lerp(LAYOUT.start.y, LAYOUT.end.y, walk),
      };
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

    function uiScale() {
      const displayW = canvas.clientWidth || W;
      const s = displayW / W;
      if (s <= 0 || s >= 0.8) return 1;
      // Keep labels readable on a phone without letting chrome eat the frame.
      const targetPx = displayW < 520 ? 12 : 16;
      const k = targetPx / (18 * s);
      return Math.max(1, Math.min(k, 2.3));
    }
    function panelScale() {
      return Math.min(uiScale(), 1.45);
    }

    function label(c, text, x, y, color, align) {
      const k = uiScale();
      c.save();
      c.font = "600 " + (18 * k) + "px Outfit, 'Segoe UI', sans-serif";
      c.fillStyle = color || C.muted;
      const a = align || "center";
      c.textAlign = a;
      c.textBaseline = "top";
      c.letterSpacing = "0.08em";
      const tw = c.measureText(text).width;
      const pad = 20 * k;
      let tx = x;
      if (a === "center") tx = Math.min(W - pad - tw / 2, Math.max(pad + tw / 2, x));
      else if (a === "left") tx = Math.min(W - pad - tw, Math.max(pad, x));
      else if (a === "right") tx = Math.min(W - pad, Math.max(pad + tw, x));
      const ty = Math.min(H - 22 * k, Math.max(10 * k, y));
      c.fillText(text, tx, ty);
      c.restore();
    }

    function buildCrowd() {
      const people = [];
      const rows = [
        { y: 1008, n: 18, s: 1.05, gapAt: [14, 15, 16] },
        { y: 948, n: 16, s: 0.88, gapAt: [13, 14] },
        { y: 898, n: 15, s: 0.74, gapAt: [12, 13] },
      ];
      rows.forEach((row, ri) => {
        for (let i = 0; i < row.n; i++) {
          if (row.gapAt.includes(i)) continue;
          const u = (i + 0.5) / row.n;
          const x = 80 + u * 1760 + ((i * 37 + ri * 13) % 17) - 8;
          if (x > 1480 && x < 1760 && ri < 2) continue;
          people.push({
            x,
            y: row.y + ((i * 19) % 11) - 5,
            s: row.s * (0.92 + ((i * 13 + ri * 7) % 10) / 50),
            lean: (((i * 5 + ri) % 5) - 2) * 0.04,
          });
        }
      });
      return people;
    }

    function drawVenue(c) {
      c.fillStyle = C.bg;
      c.fillRect(0, 0, W, H);

      // Back wall
      const wall = c.createLinearGradient(0, 0, 0, 420);
      wall.addColorStop(0, "#070707");
      wall.addColorStop(1, C.surface);
      c.fillStyle = wall;
      c.fillRect(0, 0, W, 420);

      // Lighting truss
      c.fillStyle = "#161616";
      rr(c, 340, 78, 1240, 10, 3);
      c.fill();
      for (let i = 0; i < 7; i++) {
        const x = 400 + i * 185;
        c.fillStyle = "#1A1A1A";
        rr(c, x - 14, 70, 28, 18, 3);
        c.fill();
        const g = c.createRadialGradient(x, 200, 10, x, 280, 260);
        g.addColorStop(0, "rgba(243,244,241,0.055)");
        g.addColorStop(1, "rgba(243,244,241,0)");
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(x - 16, 88);
        c.lineTo(x + 16, 88);
        c.lineTo(x + 220, 640);
        c.lineTo(x - 220, 640);
        c.closePath();
        c.fill();
      }

      // House floor
      c.fillStyle = "#0D0D0D";
      c.beginPath();
      c.moveTo(0, 640);
      c.lineTo(W, 640);
      c.lineTo(W, H);
      c.lineTo(0, H);
      c.closePath();
      c.fill();

      // Stage trapezoid
      c.fillStyle = C.elev;
      c.beginPath();
      c.moveTo(400, 368);
      c.lineTo(1520, 368);
      c.lineTo(1760, 640);
      c.lineTo(160, 640);
      c.closePath();
      c.fill();

      // Stage lip
      c.fillStyle = "#242424";
      c.beginPath();
      c.moveTo(160, 640);
      c.lineTo(1760, 640);
      c.lineTo(1772, 656);
      c.lineTo(148, 656);
      c.closePath();
      c.fill();
      c.fillStyle = "rgba(182,255,0,0.14)";
      c.fillRect(148, 654, 1624, 2);

      // Backdrop panel
      c.fillStyle = "#141414";
      rr(c, 560, 250, 800, 118, 10);
      c.fill();
      c.strokeStyle = "rgba(243,244,241,0.06)";
      c.lineWidth = 1;
      c.stroke();

      // Soft stage wash
      const wash = c.createRadialGradient(960, 420, 40, 960, 500, 620);
      wash.addColorStop(0, "rgba(243,244,241,0.06)");
      wash.addColorStop(1, "rgba(243,244,241,0)");
      c.fillStyle = wash;
      c.fillRect(200, 300, 1520, 360);
    }

    function drawCrowd(c) {
      CROWD.forEach((p) => {
        c.save();
        c.translate(p.x, p.y);
        c.scale(p.s, p.s);
        c.rotate(p.lean);
        c.fillStyle = "#151515";
        c.beginPath();
        c.ellipse(0, 10, 22, 28, 0, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        c.arc(0, -18, 13, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#101010";
        c.beginPath();
        c.ellipse(0, 28, 30, 16, 0, Math.PI, 0, true);
        c.fill();
        c.restore();
      });
    }

    function drawMain(c, x, y, flip) {
      c.save();
      c.translate(x, y);
      if (flip) c.scale(-1, 1);
      // pole + base
      c.fillStyle = "#2A2A2A";
      c.fillRect(-4, 40, 8, 150);
      c.beginPath();
      c.ellipse(0, 194, 28, 7, 0, 0, Math.PI * 2);
      c.fill();
      // cabinet
      c.fillStyle = "#1A1A1A";
      c.beginPath();
      c.moveTo(-38, -118);
      c.lineTo(44, -108);
      c.lineTo(44, 48);
      c.lineTo(-38, 38);
      c.closePath();
      c.fill();
      c.strokeStyle = "#2C2C2C";
      c.lineWidth = 1.5;
      c.stroke();
      // grille
      c.fillStyle = "#222";
      c.beginPath();
      c.moveTo(-26, -100);
      c.lineTo(32, -92);
      c.lineTo(32, 32);
      c.lineTo(-26, 24);
      c.closePath();
      c.fill();
      c.fillStyle = "#2A2A2A";
      c.beginPath();
      c.ellipse(4, -48, 16, 18, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(4, 0, 18, 20, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    function drawWedge(c, x, y, flip) {
      c.save();
      c.translate(x, y);
      if (flip) c.scale(-1, 1);
      c.fillStyle = "#1A1A1A";
      c.beginPath();
      c.moveTo(-62, 22);
      c.lineTo(58, 22);
      c.lineTo(48, -8);
      c.lineTo(-20, -44);
      c.closePath();
      c.fill();
      c.strokeStyle = "#2C2C2C";
      c.lineWidth = 1.5;
      c.stroke();
      c.fillStyle = "#232323";
      c.beginPath();
      c.moveTo(-14, -32);
      c.lineTo(42, -2);
      c.lineTo(46, 16);
      c.lineTo(-48, 16);
      c.closePath();
      c.fill();
      c.fillStyle = "#2A2A2A";
      c.beginPath();
      c.ellipse(8, -2, 14, 10, -0.4, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    function drawMixer(c, x, y) {
      c.save();
      c.translate(x, y);
      c.fillStyle = "#141414";
      rr(c, -108, 18, 216, 54, 8);
      c.fill();
      c.fillStyle = C.elev;
      rr(c, -100, -48, 200, 78, 8);
      c.fill();
      c.strokeStyle = "rgba(243,244,241,0.10)";
      c.lineWidth = 1;
      c.stroke();
      // meter bridge
      c.fillStyle = "#101010";
      rr(c, -88, -42, 176, 16, 3);
      c.fill();
      for (let i = 0; i < 10; i++) {
        c.fillStyle = i > 6 ? C.dim : C.primary;
        c.globalAlpha = 0.55;
        c.fillRect(-80 + i * 17, -38, 10, 8);
        c.globalAlpha = 1;
      }
      // faders + knobs
      for (let i = 0; i < 12; i++) {
        const fx = -86 + i * 15;
        c.fillStyle = "#2A2A2A";
        c.fillRect(fx, -16, 3, 36);
        c.fillStyle = "#3A3A3A";
        c.fillRect(fx - 2, -8 + (i % 3) * 6, 7, 5);
        if (i % 2 === 0) {
          c.beginPath();
          c.fillStyle = "#2E2E2E";
          c.arc(fx + 1, -22, 3, 0, Math.PI * 2);
          c.fill();
        }
      }
      c.restore();
      label(c, "Mixer", x, y + 78, C.muted);
    }

    function drawNullyn(c, x, y, on) {
      c.save();
      c.translate(x, y);
      if (on > 0) {
        c.shadowColor = C.primary;
        c.shadowBlur = 18 + 24 * on;
      }
      c.fillStyle = on > 0.15 ? "#0E0E0E" : "#141414";
      rr(c, -58, -20, 116, 40, 8);
      c.fill();
      c.shadowBlur = 0;
      c.strokeStyle = on > 0.15 ? C.primary : "#333";
      c.lineWidth = on > 0.15 ? 1.8 : 1.2;
      c.globalAlpha = 0.45 + 0.55 * on;
      c.stroke();
      c.globalAlpha = 1;
      // XLR ends
      c.fillStyle = "#2A2A2A";
      c.beginPath();
      c.arc(-58, 0, 8, 0, Math.PI * 2);
      c.arc(58, 0, 8, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = on > 0.2 ? C.primary : "#3A3A3A";
      c.beginPath();
      c.arc(-58, 0, 3.2, 0, Math.PI * 2);
      c.arc(58, 0, 3.2, 0, Math.PI * 2);
      c.fill();
      drawCancelMark(c, 0, 0, 26, on > 0.2 ? C.primary : "#7A7A7A");
      c.restore();
      label(c, "Nullyn AI", x, y + 26, on > 0.4 ? C.primary : C.muted);
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
    function drawCable(c, from, nullyn, mixer, howl, on, t) {
      t = t || 0;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.lineWidth = 2.2;

      const micP0 = { x: from.x, y: from.y };
      const micP1 = { x: from.x, y: from.y + 70 };
      const micP2 = { x: from.x + (nullyn.x - from.x) * 0.3, y: nullyn.y - 4 };
      const micP3 = { x: nullyn.x - 58, y: nullyn.y };
      c.strokeStyle = howl > 0.25 ? C.howl : (on > 0.5 ? C.dim : "#3A3A3A");
      c.globalAlpha = 0.45 + 0.4 * Math.max(howl, on * 0.5);
      strokeBezier(c, micP0, micP1, micP2, micP3);

      const n0 = { x: nullyn.x + 58, y: nullyn.y };
      const n1 = { x: nullyn.x + 180, y: nullyn.y + 28 };
      const n2 = { x: mixer.x - 160, y: mixer.y - 10 };
      const n3 = { x: mixer.x - 100, y: mixer.y - 8 };
      c.strokeStyle = on > 0.4 ? C.dim : "#3A3A3A";
      c.globalAlpha = 0.45 + 0.4 * on;
      strokeBezier(c, n0, n1, n2, n3);

      // Mixer speaker outs — visible runs to both mains and both monitors.
      const outL = { x: mixer.x - 70, y: mixer.y - 8 };
      const outR = { x: mixer.x - 40, y: mixer.y - 8 };
      const outML = { x: mixer.x - 10, y: mixer.y - 8 };
      const outMR = { x: mixer.x + 16, y: mixer.y - 8 };

      const ml0 = outL;
      const ml1 = { x: mixer.x - 420, y: mixer.y - 80 };
      const ml2 = { x: LAYOUT.mainL.x + 80, y: LAYOUT.mainL.y + 160 };
      const ml3 = { x: LAYOUT.mainL.x, y: LAYOUT.mainL.y + 70 };

      const mr0 = outR;
      const mr1 = { x: mixer.x + 40, y: mixer.y - 120 };
      const mr2 = { x: LAYOUT.mainR.x - 40, y: LAYOUT.mainR.y + 200 };
      const mr3 = { x: LAYOUT.mainR.x, y: LAYOUT.mainR.y + 70 };

      const wl0 = outML;
      const wl1 = { x: mixer.x - 280, y: mixer.y + 20 };
      const wl2 = { x: LAYOUT.wedgeL.x + 160, y: LAYOUT.wedgeL.y + 80 };
      const wl3 = { x: LAYOUT.wedgeL.x + 24, y: LAYOUT.wedgeL.y + 18 };

      const wr0 = outMR;
      const wr1 = { x: mixer.x - 80, y: mixer.y - 40 };
      const wr2 = { x: LAYOUT.wedgeR.x + 80, y: LAYOUT.wedgeR.y + 90 };
      const wr3 = { x: LAYOUT.wedgeR.x + 10, y: LAYOUT.wedgeR.y + 18 };

      const spkColor = on > 0.4 ? C.dim : "#3A3A3A";
      c.strokeStyle = spkColor;
      c.globalAlpha = 0.4 + 0.35 * on;
      strokeBezier(c, ml0, ml1, ml2, ml3);
      strokeBezier(c, mr0, mr1, mr2, mr3);
      c.strokeStyle = howl > 0.25 ? C.howl : spkColor;
      c.globalAlpha = 0.4 + 0.4 * Math.max(howl, on);
      strokeBezier(c, wl0, wl1, wl2, wl3);
      c.strokeStyle = spkColor;
      c.globalAlpha = 0.4 + 0.35 * on;
      strokeBezier(c, wr0, wr1, wr2, wr3);
      c.globalAlpha = 1;

      if (on > 0.15 || howl > 0.15) {
        const micCol = (howl > 0.3 && on < 0.5) ? C.howl : (on > 0.45 ? C.primary : C.dim);
        pulseBezier(c, micP0, micP1, micP2, micP3, t * 0.9, micCol, 2);
        if (on > 0.25) {
          pulseBezier(c, n0, n1, n2, n3, t * 0.9 + 0.15, C.primary, 2);
          pulseBezier(c, ml0, ml1, ml2, ml3, t * 0.85 + 0.3, C.primary, 2);
          pulseBezier(c, mr0, mr1, mr2, mr3, t * 0.85 + 0.38, C.primary, 2);
          pulseBezier(c, wr0, wr1, wr2, wr3, t * 0.85 + 0.34, C.primary, 2);
        }
        pulseBezier(c, wl0, wl1, wl2, wl3, t * 0.85 + 0.28, howl > 0.2 ? C.howl : C.primary, 2);
      }
    }


    function drawPerformer(c, x, y, t, walk, singing) {
      const stride = walk > 0 && walk < 1 ? Math.sin(walk * Math.PI * 3) : 0;
      const bob = Math.sin(t * 3.2) * 1.6 * singing;
      const bodyY = y + bob;
      c.save();
      c.translate(x, bodyY);
      // shadow
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.beginPath();
      c.ellipse(0, 4, 28, 7, 0, 0, Math.PI * 2);
      c.fill();
      // legs
      c.fillStyle = "#1A1A1A";
      c.save();
      c.translate(-7, -38);
      c.rotate(-0.08 - stride * 0.18);
      rr(c, -6, 0, 12, 42, 6);
      c.fill();
      c.restore();
      c.save();
      c.translate(8, -38);
      c.rotate(0.08 + stride * 0.18);
      rr(c, -6, 0, 12, 42, 6);
      c.fill();
      c.restore();
      // torso
      c.fillStyle = "#1E1E1E";
      c.beginPath();
      c.moveTo(-18, -108);
      c.lineTo(18, -108);
      c.lineTo(16, -44);
      c.lineTo(-16, -44);
      c.closePath();
      c.fill();
      // near arm (mic)
      c.strokeStyle = "#1E1E1E";
      c.lineWidth = 9;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(-16, -98);
      c.quadraticCurveTo(-36, -86, -22, -132);
      c.stroke();
      // far arm
      c.beginPath();
      c.moveTo(16, -98);
      c.quadraticCurveTo(28, -70, 18, -52);
      c.stroke();
      // neck + head
      c.fillStyle = "#C8C4BC";
      rr(c, -5, -124, 10, 16, 4);
      c.fill();
      c.beginPath();
      c.arc(0, -140, 16, 0, Math.PI * 2);
      c.fill();
      // hair cap
      c.fillStyle = "#161616";
      c.beginPath();
      c.arc(0, -144, 16, Math.PI * 1.05, Math.PI * 1.95);
      c.fill();
      // mic
      const mic = micPosLocal();
      c.save();
      c.translate(mic.x, mic.y);
      c.rotate(-0.7);
      c.fillStyle = "#2A2A2A";
      rr(c, -3, 0, 6, 28, 2);
      c.fill();
      c.fillStyle = "#3A3A3A";
      c.beginPath();
      c.ellipse(0, 0, 8, 11, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#555";
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2);
      c.stroke();
      c.restore();
      c.restore();
    }

    function micPosLocal() {
      return { x: -18, y: -138 };
    }

    function worldMic(pos) {
      const local = micPosLocal();
      return { x: pos.x + local.x, y: pos.y + local.y };
    }

    function drawVoice(c, mic, t, color, alpha) {
      c.save();
      c.strokeStyle = color;
      c.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const r = 14 + i * 10 + (t * 28) % 10;
        c.globalAlpha = alpha * (1 - i / 3) * 0.55;
        c.lineWidth = 1.6;
        c.beginPath();
        c.arc(mic.x - 8, mic.y - 4, r, -Math.PI * 0.85, -Math.PI * 0.2);
        c.stroke();
      }
      c.restore();
    }

    function drawWaves(c, x, y, angle, color, amp, t, maxR, rings, spread, speed) {
      if (amp <= 0.02) return;
      c.save();
      c.strokeStyle = color;
      c.lineCap = "round";
      const n = rings;
      for (let i = 0; i < n; i++) {
        const phase = (t * speed + (i / n) * maxR) % maxR;
        const r = 16 + phase;
        const a = amp * (1 - r / (maxR + 16));
        if (a <= 0.02) continue;
        c.globalAlpha = Math.max(0, a);
        c.lineWidth = 2 + 2.2 * amp;
        c.beginPath();
        c.arc(x, y, r, angle - spread, angle + spread);
        c.stroke();
      }
      c.restore();
    }

    function drawLoop(c, a, b, amount, t, breaking) {
      if (amount <= 0.02 && breaking <= 0.02) return;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2 - 8;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rx = dist * 0.58 + 16;
      const ry = rx * 0.52;
      const rot = Math.atan2(b.y - a.y, b.x - a.x);
      const vis = Math.max(amount, 0);
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.strokeStyle = C.howl;
      c.lineWidth = 2.4 + 2.4 * vis;
      c.shadowColor = C.howl;
      c.shadowBlur = 18 * vis;
      c.globalAlpha = 0.2 + 0.8 * vis;
      c.setLineDash([14, 9]);
      c.lineDashOffset = -t * 48;
      c.beginPath();
      const end = breaking > 0.15 ? Math.PI * 2 * (1 - 0.35 * breaking) : Math.PI * 2;
      c.ellipse(0, 0, rx, ry, 0, 0.15 * breaking, end);
      c.stroke();
      c.restore();
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

    function drawSpectrum(c, x, y, howl, notch, t) {
      const pk = (typeof panelScale === "function") ? panelScale() : 1;
      const w = 520 * pk, h = 280 * pk;
      drawEqPanel(c, x, y, w, h, howl, notch, t, C);
    }

    function drawEndCard(c, alpha) {
      if (alpha <= 0) return;
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = C.bg;
      c.fillRect(0, 0, W, H);
      c.fillStyle = C.primary;
      c.font = "700 128px Syne, sans-serif";
      c.textAlign = "left";
      c.textBaseline = "middle";
      c.letterSpacing = "-0.05em";
      const word = "nullyn";
      const tw = c.measureText(word).width;
      const markSize = 118;
      const markGap = 28;
      const lockLeft = (W - (markSize + markGap + tw)) / 2;
      drawCancelMark(c, lockLeft + markSize / 2, H / 2 - 70, markSize, C.primary);
      c.fillStyle = C.primary;
      c.font = "700 128px Syne, sans-serif";
      c.textAlign = "left";
      c.textBaseline = "middle";
      c.letterSpacing = "-0.05em";
      c.fillText(word, lockLeft + markSize + markGap, H / 2 - 70);

      const items = ["mic", "Nullyn AI", "mixer", "speakers"];
      const boxW = 210, boxH = 72, gap = 28, chev = 34;
      const total = items.length * boxW + 2 * (gap + chev);
      let x = (W - total) / 2;
      const y = H / 2 + 70;
      items.forEach((txt, i) => {
        if (i === 1) {
          c.fillStyle = C.primary;
          rr(c, x, y, boxW, boxH, 16);
          c.fill();
          c.fillStyle = C.bg;
        } else {
          c.fillStyle = C.surface;
          rr(c, x, y, boxW, boxH, 16);
          c.fill();
          c.strokeStyle = C.lineStrong;
          c.lineWidth = 1;
          c.stroke();
          c.fillStyle = C.text;
        }
        c.font = "650 24px Outfit, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.letterSpacing = "-0.02em";
        c.fillText(txt, x + boxW / 2, y + boxH / 2);
        x += boxW;
        if (i < items.length - 1) {
          c.fillStyle = C.primary;
          c.font = "400 36px Outfit, sans-serif";
          c.fillText("→", x + (gap + chev) / 2, y + boxH / 2);
          x += gap + chev;
        }
      });
      c.restore();
    }

    function draw(t) {
      const b = beats(t);
      const pos = performerPos(b.walk);
      const mic = worldMic(pos);
      const singing = 1 - b.end;

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      drawVenue(ctx);

      // Mains + right monitor stay in the set
      drawMain(ctx, LAYOUT.mainL.x, LAYOUT.mainL.y, false);
      drawMain(ctx, LAYOUT.mainR.x, LAYOUT.mainR.y, true);
      drawWedge(ctx, LAYOUT.wedgeL.x, LAYOUT.wedgeL.y, false);
      drawWedge(ctx, LAYOUT.wedgeR.x, LAYOUT.wedgeR.y, true);
      label(ctx, "Monitor", LAYOUT.wedgeL.x, LAYOUT.wedgeL.y + 30, b.howl > 0.4 ? C.howl : C.muted);

      drawCrowd(ctx);
      drawMixer(ctx, LAYOUT.mixer.x, LAYOUT.mixer.y);

      const cleanAmp = (0.55 + 0.2 * Math.sin(t * 1.4)) * (0.85 + 0.15 * b.nullyn);
      const howlAmp = b.howl;
      const mainA = 0.55 * cleanAmp + 0.2;

      drawWaves(ctx, LAYOUT.mainL.ox, LAYOUT.mainL.oy, Math.PI * 0.55, C.primary, mainA * (1 - howlAmp * 0.15), t, 210, 5, 0.85, 46);
      drawWaves(ctx, LAYOUT.mainR.ox, LAYOUT.mainR.oy, Math.PI * 0.45, C.primary, mainA * (1 - howlAmp * 0.15), t, 210, 5, 0.85, 46);
      drawWaves(ctx, LAYOUT.wedgeR.ox, LAYOUT.wedgeR.oy, -2.3, C.primary, 0.35 * cleanAmp * (1 - howlAmp * 0.4), t, 110, 4, 0.7, 40);

      // Left monitor: clean, then red re-entry into the mic
      const wedgeColor = howlAmp > 0.15 ? C.howl : C.primary;
      const wedgeAmp = howlAmp > 0.15 ? 0.45 + 0.7 * howlAmp : 0.4 * cleanAmp;
      drawWaves(ctx, LAYOUT.wedgeL.ox, LAYOUT.wedgeL.oy, -0.75, wedgeColor, wedgeAmp, t, howlAmp > 0.15 ? 180 : 120, howlAmp > 0.15 ? 6 : 4, 0.85, howlAmp > 0.15 ? 70 : 40);

      drawLoop(ctx, { x: LAYOUT.wedgeL.ox, y: LAYOUT.wedgeL.oy }, mic, howlAmp, t, b.notch);
      drawCable(ctx, mic, LAYOUT.nullyn, LAYOUT.mixer, howlAmp, b.nullyn, t);
      drawNullyn(ctx, LAYOUT.nullyn.x, LAYOUT.nullyn.y, b.nullyn);
      drawPerformer(ctx, pos.x, pos.y, t, b.walk, singing);
      drawVoice(ctx, mic, t, howlAmp > 0.5 ? C.howl : C.primary, 0.7 * singing);

      if (howlAmp > 0.35 && b.notch < 0.55) {
        label(ctx, "Feedback", (LAYOUT.wedgeL.ox + mic.x) / 2, Math.min(LAYOUT.wedgeL.oy, mic.y) - 78, C.howl);
      } else if (b.nullyn > 0.7 && howlAmp < 0.22 && b.end < 0.2) {
        label(ctx, "Clean output", LAYOUT.mixer.x - 40, LAYOUT.mixer.y - 78, C.primary);
      }

      (function () {
        const pk = (typeof panelScale === "function") ? panelScale() : 1;
        const sw = 520 * pk, sh = 280 * pk;
        const sx = Math.max(48, W - sw - 48);
        const sy = 32;
        drawSpectrum(ctx, sx, sy, howlAmp, b.notch, t);
      })();

      // Fade-in overlay
      if (b.fadeIn < 1) {
        ctx.save();
        ctx.globalAlpha = 1 - b.fadeIn;
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      drawEndCard(ctx, b.end);
    }

    let start = performance.now();
    let raf = 0;
    function tick(now) {
      const t = ((now - start) / 1000) % DURATION;
      draw(t);
      raf = requestAnimationFrame(tick);
    }
    function setTime(t) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      draw(((t % DURATION) + DURATION) % DURATION);
    }
    function play() {
      start = performance.now();
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    window.NULLYN = { duration: DURATION, setTime, play };
    function pause() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function boot() {
      if (reduced) {
        setTime(6.6);
        return;
      }
      setTime(0);
      const root = stageRoot;
      if (!("IntersectionObserver" in window)) {
        play();
        return;
      }
      const io = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) {
          if (!raf) play();
        } else {
          pause();
        }
      }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
      io.observe(root);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(boot);
    } else {
      boot();
    }
})();

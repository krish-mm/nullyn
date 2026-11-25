/* Site-native simulated-evaluation charts for /research/. Numbers come from media/research-data.json only. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const COL = {
    none: "#FF1A1A",
    classic: "#A3A3A3",
    nullyn_v0: "#B6FF00",
    bg: "#121212",
    text: "#F3F4F1",
    muted: "#9A9A9A",
    line: "rgba(243, 244, 241, 0.10)",
    lineStrong: "rgba(243, 244, 241, 0.18)",
  };

  function el(tag, attrs, kids) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      n.setAttribute(k, String(v));
    }
    (kids || []).forEach((c) => n.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  }
  function fmtPct(x) {
    return (x * 100).toFixed(1) + "%";
  }
  function fmtNum(x, digits) {
    return Number(x).toFixed(digits);
  }
  function fmtInt(n) {
    return Number(n).toLocaleString("en-US");
  }
  function simulatedNote(runsLabel) {
    return "Simulated · " + runsLabel;
  }

  function legend(svg, processors, x, y) {
    let lx = x;
    processors.forEach((p) => {
      svg.appendChild(el("rect", { x: lx, y: y - 9, width: 10, height: 10, rx: 2, fill: COL[p.id] }));
      const t = el("text", {
        x: lx + 14, y: y, fill: COL.muted, "font-size": 12,
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [p.label]);
      svg.appendChild(t);
      lx += 14 + Math.max(72, p.label.length * 6.6) + 16;
    });
  }

  function caption(svg, text, width, height) {
    svg.appendChild(el("text", {
      x: 20, y: height - 14, fill: COL.muted, "font-size": 12,
      "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
    }, [text]));
  }

  function groupedBars(opts) {
    const { title, aria, processors, groups, valueOf, formatValue, yMax, yLabel, note, width, height } = opts;
    const pad = { t: 72, r: 20, b: 86, l: 52 };
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;
    const svg = el("svg", {
      viewBox: "0 0 " + width + " " + height,
      width: "100%",
      role: "img",
      "aria-label": aria || title,
    });
    svg.appendChild(el("rect", { width: width, height: height, rx: 16, fill: COL.bg }));
    svg.appendChild(el("text", {
      x: 20, y: 28, fill: COL.text, "font-size": 16, "font-weight": 600,
      "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
    }, [title]));
    legend(svg, processors, 20, 50);

    const nG = groups.length, nP = processors.length;
    const groupW = innerW / nG;
    const gapG = Math.min(18, groupW * 0.18);
    const usable = groupW - gapG;
    const bw = usable / nP;
    const maxV = yMax || Math.max(0.0001, ...groups.flatMap((g) => processors.map((p) => valueOf(g, p.id))));

    // y grid
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = (maxV * i) / ticks;
      const y = pad.t + innerH - (v / maxV) * innerH;
      svg.appendChild(el("line", { x1: pad.l, x2: width - pad.r, y1: y, y2: y, stroke: COL.line, "stroke-width": 1 }));
      svg.appendChild(el("text", {
        x: pad.l - 8, y: y + 4, fill: COL.muted, "font-size": 11, "text-anchor": "end",
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [formatValue(v)]));
    }
    if (yLabel) {
      svg.appendChild(el("text", {
        x: 16, y: pad.t + innerH / 2, fill: COL.muted, "font-size": 11, "text-anchor": "middle",
        transform: "rotate(-90 16 " + (pad.t + innerH / 2) + ")",
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [yLabel]));
    }

    groups.forEach((g, gi) => {
      const gx = pad.l + gi * groupW + gapG / 2;
      processors.forEach((p, pi) => {
        const v = valueOf(g, p.id);
        const h = Math.max(0, (v / maxV) * innerH);
        const x = gx + pi * bw + 1;
        const y = pad.t + innerH - h;
        const bar = el("rect", {
          class: "chart-bar",
          x: x, y: y, width: Math.max(1, bw - 2), height: Math.max(h, 0),
          rx: 3, fill: COL[p.id],
        });
        bar.appendChild(el("title", {}, [p.label + ": " + formatValue(v)]));
        svg.appendChild(bar);
        if (nG <= 4) {
          const ly = h > 14 ? y - 6 : pad.t + innerH - 8;
          const fill = h > 14 ? COL.text : COL.muted;
          svg.appendChild(el("text", {
            x: x + (bw - 2) / 2, y: ly, fill: fill, "font-size": 11, "text-anchor": "middle",
            "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
          }, [formatValue(v)]));
        }
      });
      if (nG === 1) {
        processors.forEach((p, pi) => {
          const lines = String(p.label).split("\n");
          lines.forEach((line, li) => {
            svg.appendChild(el("text", {
              x: gx + pi * bw + bw / 2,
              y: pad.t + innerH + 16 + li * 14,
              fill: COL.muted, "font-size": 11, "text-anchor": "middle",
              "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
            }, [line]));
          });
        });
      } else {
        const lines = String(g.label).split("\n");
        lines.forEach((line, li) => {
          svg.appendChild(el("text", {
            x: gx + usable / 2,
            y: pad.t + innerH + 16 + li * 14,
            fill: COL.muted, "font-size": 11, "text-anchor": "middle",
            "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
          }, [line]));
        });
      }
    });
    caption(svg, note, width, height);
    return svg;
  }


  function simpleBars(opts) {
    const { title, aria, items, formatValue, yMax, yLabel, note, width, height } = opts;
    const processors = items.map((it) => ({ id: it.id, label: it.label }));
    return groupedBars({
      title: title,
      aria: aria,
      processors: processors,
      groups: [{ label: "", items: items }],
      valueOf: (g, id) => (g.items.find((it) => it.id === id) || {}).value || 0,
      formatValue: formatValue,
      yMax: yMax,
      yLabel: yLabel,
      note: note,
      width: width,
      height: height,
    });
  }

  function lineChart(opts) {
    const { title, aria, processors, curves, xOf, yOf, xLabel, yLabel, xMin, xMax, invertX, note, width, height, formatY, formatX } = opts;
    const pad = { t: 72, r: 24, b: 86, l: 52 };
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;
    const svg = el("svg", {
      viewBox: "0 0 " + width + " " + height,
      width: "100%",
      role: "img",
      "aria-label": aria || title,
    });
    svg.appendChild(el("rect", { width: width, height: height, rx: 16, fill: COL.bg }));
    svg.appendChild(el("text", {
      x: 20, y: 28, fill: COL.text, "font-size": 16, "font-weight": 600,
      "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
    }, [title]));
    legend(svg, processors, 20, 50);

    const allY = processors.flatMap((p) => (curves[p.id] || []).map(yOf));
    const yMax = 1; // howl rate 0-100%
    const xAt = (x) => {
      const u = (x - xMin) / (xMax - xMin);
      return pad.l + (invertX ? 1 - u : u) * innerW;
    };
    const yAt = (y) => pad.t + innerH - (y / yMax) * innerH;

    for (let i = 0; i <= 5; i++) {
      const v = i / 5;
      const y = yAt(v);
      svg.appendChild(el("line", { x1: pad.l, x2: width - pad.r, y1: y, y2: y, stroke: COL.line, "stroke-width": 1 }));
      svg.appendChild(el("text", {
        x: pad.l - 8, y: y + 4, fill: COL.muted, "font-size": 11, "text-anchor": "end",
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [formatY(v)]));
    }
    // x = 0 reference (stability limit)
    if (xMin < 0 && xMax > 0) {
      const zx = xAt(0);
      svg.appendChild(el("line", {
        x1: zx, x2: zx, y1: pad.t, y2: pad.t + innerH,
        stroke: COL.lineStrong, "stroke-width": 1, "stroke-dasharray": "3 4",
      }));
    }
    const xTicks = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += 2.5) xTicks.push(x);
    // nicer static ticks matching the official axis
    const ticks = [5, 2.5, 0, -2.5, -5, -7.5, -10, -12.5];
    ticks.filter((x) => x >= xMin && x <= xMax).forEach((x) => {
      const px = xAt(x);
      svg.appendChild(el("line", { x1: px, x2: px, y1: pad.t + innerH, y2: pad.t + innerH + 5, stroke: COL.muted, "stroke-width": 1 }));
      svg.appendChild(el("text", {
        x: px, y: pad.t + innerH + 18, fill: COL.muted, "font-size": 11, "text-anchor": "middle",
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [formatX(x)]));
    });
    if (yLabel) {
      svg.appendChild(el("text", {
        x: 16, y: pad.t + innerH / 2, fill: COL.muted, "font-size": 11, "text-anchor": "middle",
        transform: "rotate(-90 16 " + (pad.t + innerH / 2) + ")",
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [yLabel]));
    }
    if (xLabel) {
      svg.appendChild(el("text", {
        x: pad.l + innerW / 2, y: height - 32, fill: COL.muted, "font-size": 11, "text-anchor": "middle",
        "font-family": "Segoe UI, ui-sans-serif, system-ui, sans-serif",
      }, [xLabel]));
    }

    processors.forEach((p) => {
      const pts = (curves[p.id] || []).slice().sort((a, b) => xOf(a) - xOf(b));
      if (!pts.length) return;
      const d = pts.map((pt, i) => {
        const cmd = i === 0 ? "M" : "L";
        return cmd + " " + xAt(xOf(pt)).toFixed(2) + " " + yAt(yOf(pt)).toFixed(2);
      }).join(" ");
      const path = el("path", {
        class: "chart-line",
        d: d, fill: "none", stroke: COL[p.id], "stroke-width": 2.25, "stroke-linejoin": "round", "stroke-linecap": "round",
      });
      svg.appendChild(path);
      pts.forEach((pt) => {
        svg.appendChild(el("circle", {
          cx: xAt(xOf(pt)), cy: yAt(yOf(pt)), r: 2.6, fill: COL[p.id],
        }));
      });
    });
    caption(svg, note, width, height);
    return svg;
  }

  function mount(host, svg) {
    host.innerHTML = "";
    host.appendChild(svg);
  }

  function animateIn(root) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = () => root.classList.add("is-in");
    if (reduced) { go(); return; }
    if (!("IntersectionObserver" in window)) { go(); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { go(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(root);
  }

  function render(data) {
    const processors = data.processors;
    const noteHeld = simulatedNote(
      fmtInt(data.heldout.runs_per_condition) + " held-out runs per condition (" +
      fmtInt(data.heldout.scenarios) + " scenarios)"
    );

    const venueHost = document.getElementById("chart-howl-by-venue");
    if (venueHost) {
      mount(venueHost, groupedBars({
        title: "Howl rate by venue",
        aria: "Grouped bar chart of simulated howl rate by venue for no processing, classic notch, and Nullyn AI.",
        processors: processors,
        groups: data.per_venue.map((v) => ({
          label: v.label.replace(" ", "\n"),
          howl_rate: v.howl_rate,
        })),
        valueOf: (g, id) => g.howl_rate[id],
        formatValue: fmtPct,
        yMax: 0.7,
        yLabel: "Howl rate",
        note: noteHeld,
        width: 960,
        height: 420,
      }));
      animateIn(venueHost);
    }

    const marginHost = document.getElementById("chart-howl-vs-margin");
    if (marginHost) {
      const curves = data.howl_vs_margin.curves;
      const xs = Object.values(curves).flat().map((p) => p.margin_db_mid);
      mount(marginHost, lineChart({
        title: "Howl rate vs. fader margin",
        aria: "Line chart of simulated howl rate against worst stability margin along the trajectory, for no processing, classic notch, and Nullyn AI.",
        processors: processors,
        curves: curves,
        xOf: (p) => p.margin_db_mid,
        yOf: (p) => p.howl_rate,
        xMin: Math.min(-14, ...xs),
        xMax: Math.max(6, ...xs),
        invertX: true,
        xLabel: "Worst stability margin along the trajectory (dB; < 0 = fader above the broadband limit)",
        yLabel: "Howl rate",
        formatY: fmtPct,
        formatX: (x) => (x > 0 ? "+" : "") + String(x),
        note: noteHeld,
        width: 960,
        height: 440,
      }));
      animateIn(marginHost);
    }

    const heldHost = document.getElementById("chart-heldout-summary");
    if (heldHost) {
      const wrap = document.createElement("div");
      wrap.className = "sim-split";
      const left = document.createElement("div");
      const right = document.createElement("div");
      left.appendChild(simpleBars({
        title: "Held-out howl rate",
        aria: "Bar chart of simulated held-out howl rate for no processing, classic notch, and Nullyn AI.",
        items: processors.map((p) => ({ id: p.id, label: p.label.replace(" ", "\n"), value: data.heldout.by_processor[p.id].howl_rate })),
        formatValue: fmtPct,
        yMax: 0.6,
        yLabel: "Howl rate",
        note: noteHeld,
        width: 460,
        height: 400,
      }));
      right.appendChild(simpleBars({
        title: "Held-out false notches per run",
        aria: "Bar chart of simulated held-out false notches per run for no processing, classic notch, and Nullyn AI.",
        items: processors.map((p) => ({ id: p.id, label: p.label.replace(" ", "\n"), value: data.heldout.by_processor[p.id].mean_false_notches_per_run })),
        formatValue: (v) => fmtNum(v, 1),
        yMax: 10,
        yLabel: "False notches per run",
        note: noteHeld,
        width: 460,
        height: 400,
      }));
      wrap.appendChild(left);
      wrap.appendChild(right);
      heldHost.innerHTML = "";
      heldHost.appendChild(wrap);
      animateIn(heldHost);
    }
  }

  function boot() {
    const need = document.getElementById("chart-howl-by-venue") ||
      document.getElementById("chart-howl-vs-margin") ||
      document.getElementById("chart-heldout-summary");
    if (!need) return;
    const src = need.getAttribute("data-src") || "/media/research-data.json";
    fetch(src).then((r) => {
      if (!r.ok) throw new Error("research-data.json " + r.status);
      return r.json();
    }).then(render).catch((err) => {
      console.error(err);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

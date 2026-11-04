// Draws a Layout as SVG in the crayon style: rough.js strokes and hachure fills, pastel palette,
// handwritten face. Everything is precomputed here; the HTML only toggles classes.

import rough from 'roughjs/bundled/rough.esm.js';
import { readFileSync } from 'node:fs';
import type { Chart, Report } from './types.ts';
import { FONT, HEADER, type EdgeGeom, type Layout, type NodeGeom } from './layout.ts';

export const PALETTE = {
  blue: '#A8D8EA',
  green: '#B5EAD7',
  orange: '#FFDAC1',
  purple: '#C7CEEA',
  pink: '#FFB7B2',
};
const ORDER = [PALETTE.blue, PALETTE.green, PALETTE.orange, PALETTE.purple];
export const INK = '#222222';
export const RED = '#cd2834';
export const HIGHLIGHT = '#f2b705';
export const ENABLED = '#1b6ca8';

export const FRAME = { w: 1920, h: 1080 };
export const FONT_FAMILY = `'Patrick Hand', 'Segoe Print', 'Bradley Hand', 'Comic Neue', cursive`;

let fontCss: string | null = null;
/** @font-face for the vendored OFL handwriting face, base64-inlined so the file stands alone. */
export function fontFace(): string {
  if (fontCss !== null) return fontCss;
  try {
    const url = new URL('../node_modules/@fontsource/patrick-hand/files/patrick-hand-latin-400-normal.woff2', import.meta.url);
    const b64 = readFileSync(url).toString('base64');
    fontCss = `@font-face{font-family:'Patrick Hand';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  } catch {
    fontCss = '';
  }
  return fontCss;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Gen = ReturnType<typeof rough.generator>;

function drawableToSvg(g: Gen, d: ReturnType<Gen['rectangle']>, extra = ''): string {
  const o = d.options;
  let out = '';
  for (const set of d.sets) {
    const path = g.opsToPath(set).replace(/-?\d+\.\d{2,}/g, (m) => Number(m).toFixed(1));
    if (set.type === 'path') out += `<path d="${path}" fill="none" stroke="${o.stroke}" stroke-width="${o.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    else if (set.type === 'fillPath') out += `<path d="${path}" fill="${o.fill}" stroke="none" ${extra}/>`;
    else if (set.type === 'fillSketch') out += `<path d="${path}" fill="none" stroke="${o.fill}" stroke-width="${o.fillWeight}" stroke-linecap="round" ${extra}/>`;
  }
  return out;
}

function textLines(lines: string[], cx: number, cy: number, size: number, opts: { fill?: string; anchor?: string; halo?: boolean; weight?: string } = {}): string {
  const lh = size * FONT.lineH;
  const y0 = cy - ((lines.length - 1) * lh) / 2;
  const fill = opts.fill ?? INK;
  const common = `font-family="${FONT_FAMILY}" font-size="${size}" text-anchor="${opts.anchor ?? 'middle'}" dominant-baseline="central"${opts.weight ? ` font-weight="${opts.weight}"` : ''}`;
  let out = '';
  lines.forEach((l, i) => {
    const y = y0 + i * lh;
    if (opts.halo) out += `<text x="${cx}" y="${y}" ${common} fill="#fff" stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${esc(l)}</text>`;
    out += `<text x="${cx}" y="${y}" ${common} fill="${fill}">${esc(l)}</text>`;
  });
  return out;
}

/** Polyline with every interior bend rounded off (quadratic corner, radius capped by the shorter leg). */
function smooth(points: Array<{ x: number; y: number }>, radius = 22): string {
  const pts = points.filter((p, i) => i === 0 || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) > 0.5);
  if (pts.length < 2) return '';
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y), l2 = Math.hypot(c.x - b.x, c.y - b.y);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const p1 = { x: b.x - ((b.x - a.x) / l1) * r, y: b.y - ((b.y - a.y) / l1) * r };
    const p2 = { x: b.x + ((c.x - b.x) / l2) * r, y: b.y + ((c.y - b.y) / l2) * r };
    d += ` L${p1.x} ${p1.y} Q${b.x} ${b.y} ${p2.x} ${p2.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${last.x} ${last.y}`;
  return d;
}

function colorKey(chart: Chart, id: string): string {
  let cur: string | null = chart.states[id].parent;
  while (cur) { if (chart.states[cur].kind === 'composite') return cur; cur = chart.states[cur].parent; }
  return id;
}

export interface RenderOptions {
  report?: Report | null;
  /** Transition ids on the first bug path, for the red crayon pass. */
  bugEdgeIds?: string[];
  title?: string | null;
  seed?: number;
}

export function renderChartSvg(chart: Chart, L: Layout, opts: RenderOptions = {}): string {
  const seed = opts.seed ?? 11;
  const g = rough.generator({ options: { seed, roughness: 1.25, bowing: 1.1, strokeWidth: 2.6, stroke: INK } });
  const keys: string[] = [];
  const colorOf = (id: string) => {
    const k = colorKey(chart, id);
    if (!keys.includes(k)) keys.push(k);
    return ORDER[keys.indexOf(k) % ORDER.length];
  };
  const bugEdges = new Set(opts.bugEdgeIds ?? []);
  const finals = new Set(chart.finals);
  let out = '';

  // Composites first (behind), deepest last so nested boxes sit on top of their parents.
  const depth = (n: NodeGeom) => { let d = 0; let p = n.parent; while (p) { d++; p = chart.states[p].parent; } return d; };
  const comps = L.nodes.filter((n) => n.kind === 'composite').sort((a, b) => depth(a) - depth(b));
  for (const n of comps) {
    const band = HEADER;
    const rect = g.rectangle(n.x, n.y, n.w, n.h, { fill: 'none', strokeWidth: 2.4, seed: seed + n.x });
    const header = g.rectangle(n.x + 2, n.y + 2, n.w - 4, band - 4, { fill: colorOf(n.id), fillStyle: 'hachure', hachureGap: 10, fillWeight: 1.1, hachureAngle: -41, stroke: 'none', seed: seed + n.y });
    const hl = g.rectangle(n.x - 5, n.y - 5, n.w + 10, n.h + 10, { stroke: HIGHLIGHT, strokeWidth: 2.2, roughness: 1.4, seed: seed + 3 });
    out += `<g class="state composite" data-id="${esc(n.id)}">`;
    out += `<g class="hl">${drawableToSvg(g, hl)}</g>`;
    out += drawableToSvg(g, header) + drawableToSvg(g, rect);
    out += textLines([n.label], n.x + n.w / 2, n.y + band / 2, 24, { halo: false });
    out += `</g>`;
  }
  for (const d of L.dividers) {
    const line = g.line(d.x1, d.y1, d.x2, d.y2, { strokeWidth: 1.8, roughness: 1.2, seed: seed + 5 });
    out += `<g class="divider">${drawableToSvg(g, line, 'stroke-dasharray="9 9"')}</g>`;
  }

  // Edges under leaves so arrows tuck beneath boxes at the ends.
  for (const e of L.edges) {
    out += renderEdge(g, e, chart, bugEdges, seed);
  }

  for (const n of L.nodes) {
    if (n.kind === 'start') {
      const c = g.circle(n.x + n.w / 2, n.y + n.h / 2, n.w, { fill: INK, fillStyle: 'solid', strokeWidth: 1.5, seed: seed + 7 });
      out += `<g class="start" data-id="${esc(n.id)}">${drawableToSvg(g, c)}</g>`;
      continue;
    }
    if (n.kind !== 'leaf') continue;
    const st = chart.states[n.id];
    const breaks = st.classes.includes('breaks');
    const may = st.classes.includes('mayBreak');
    const onPath = st.classes.includes('bugPath');
    const fill = breaks ? PALETTE.pink : colorOf(n.id);
    const stroke = breaks ? RED : INK;
    const r = Math.min(16, n.h / 3);
    const path = roundRectPath(n.x, n.y, n.w, n.h, r);
    const body = g.path(path, { fill, fillStyle: 'hachure', hachureGap: 6, fillWeight: 1.7, hachureAngle: -41, stroke, strokeWidth: breaks ? 3.2 : 2.6, seed: seed + Math.round(n.x + n.y) });
    const hl = g.path(roundRectPath(n.x - 7, n.y - 7, n.w + 14, n.h + 14, r + 6), { stroke: HIGHLIGHT, strokeWidth: 5.5, roughness: 1.7, seed: seed + 9 });
    out += `<g class="state leaf${breaks ? ' breaks' : ''}${may ? ' mayBreak' : ''}${onPath ? ' bugPath' : ''}" data-id="${esc(n.id)}">`;
    out += `<g class="hl">${drawableToSvg(g, hl)}</g>`;
    out += drawableToSvg(g, body);
    if (finals.has(n.id)) out += drawableToSvg(g, g.path(roundRectPath(n.x + 5, n.y + 5, n.w - 10, n.h - 10, Math.max(r - 4, 4)), { strokeWidth: 1.6, seed: seed + 13 }));
    if (may) out += drawableToSvg(g, g.path(roundRectPath(n.x - 3, n.y - 3, n.w + 6, n.h + 6, r + 2), { stroke: RED, strokeWidth: 1.8, roughness: 1.6, seed: seed + 17 }), 'stroke-dasharray="6 7"');
    if (onPath && !breaks) out += drawableToSvg(g, g.line(n.x + 8, n.y + n.h + 5, n.x + n.w - 8, n.y + n.h + 5, { stroke: RED, strokeWidth: 2.2, roughness: 1.8, seed: seed + 19 }));
    out += textLines(n.lines, n.x + n.w / 2, n.y + n.h / 2, FONT.size, { fill: breaks ? '#8b1e26' : INK });
    out += `</g>`;
  }
  return out;
}

function roundRectPath(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}

function renderEdge(g: Gen, e: EdgeGeom, chart: Chart, bugEdges: Set<string>, seed: number): string {
  const t = chart.transitions.find((x) => x.id === e.id);
  const onBug = bugEdges.has(e.id);
  const stroke = onBug ? RED : '#333';
  const d = smooth(e.points);
  const line = g.path(d, { stroke, strokeWidth: onBug ? 3 : 2.2, roughness: 0.9, bowing: 0.6, seed: seed + Math.round(e.points[0].x) });
  const n = e.points.length;
  const a = e.points[n - 2], b = e.points[n - 1];
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const len = 16, spread = 0.46;
  const p1 = { x: b.x - len * Math.cos(ang - spread), y: b.y - len * Math.sin(ang - spread) };
  const p2 = { x: b.x - len * Math.cos(ang + spread), y: b.y - len * Math.sin(ang + spread) };
  const head = g.linearPath([[p1.x, p1.y], [b.x, b.y], [p2.x, p2.y]], { stroke, strokeWidth: onBug ? 3 : 2.4, roughness: 0.8, seed: seed + 23 });
  const classes = ['edge', e.kind === 'start' ? 'startEdge' : 'transition', onBug ? 'bugEdge' : ''].filter(Boolean).join(' ');
  let out = `<g class="${classes}" data-id="${esc(e.id)}"${t ? ` data-from="${esc(t.from)}" data-to="${esc(t.to)}"` : ''}>`;
  out += `<path class="hit" d="${d}" fill="none" stroke="transparent" stroke-width="26"/>`;
  out += `<g class="ink">${drawableToSvg(g, line)}${drawableToSvg(g, head)}</g>`;
  if (e.label && t) {
    out += `<g class="label">${textLines(e.label.lines, e.label.x, e.label.y, FONT.size * 0.8, { halo: true, fill: onBug ? '#8b1e26' : '#333' })}</g>`;
  }
  out += `</g>`;
  return out;
}

export interface FrameOptions extends RenderOptions {
  subtitle?: string | null;
}

/** The 16:9 plate: title, legend, chart scaled to fit, and the checked/unchecked footer. */
export function renderFrameSvg(chart: Chart, L: Layout, opts: FrameOptions = {}): string {
  const title = opts.title ?? chart.title ?? '';
  const report = opts.report ?? null;
  const legend = chart.legend;
  const margin = 60;
  const top = title ? 150 : 70;
  const bottom = FRAME.h - 90;
  const areaW = FRAME.w - margin * 2 - (legend.length ? 440 : 0);
  const areaH = bottom - top;
  const scale = Math.min(areaW / L.width, areaH / L.height, 1.5);
  const ox = margin + (areaW - L.width * scale) / 2;
  const oy = top + (areaH - L.height * scale) / 2;
  const g = rough.generator({ options: { seed: (opts.seed ?? 11) + 31, roughness: 1.3, strokeWidth: 2.2, stroke: INK } });

  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FRAME.w} ${FRAME.h}" width="${FRAME.w}" height="${FRAME.h}" class="plate">`;
  // Play-mode styling is scoped to `.playing` so a static plate (PNG, print) shows every arrow in full ink.
  out += `<style>${fontFace()} .hl{display:none} .state.active>.hl{display:inline} .edge .hit{cursor:default} .playing .edge.enabled .hit{cursor:pointer} .playing .edge.enabled .ink path{stroke:${ENABLED}} .playing .edge.enabled .label text:last-of-type{fill:${ENABLED}} .playing .edge.disabled{opacity:.38} .playing .edge.fired .ink path{stroke:${HIGHLIGHT}}</style>`;
  out += `<rect width="${FRAME.w}" height="${FRAME.h}" fill="#ffffff"/>`;
  if (title) out += textLines([title], margin, 84, 52, { anchor: 'start' });
  if (opts.subtitle) out += textLines([opts.subtitle], margin, 124, 24, { anchor: 'start', fill: '#555' });

  if (legend.length) {
    const lx = FRAME.w - margin - 400, ly = top, lw = 400, lh = 44 + legend.length * 40;
    out += `<g class="legend">${drawableToSvg(g, g.rectangle(lx, ly, lw, lh, { fill: '#fbfbf7', fillStyle: 'solid', strokeWidth: 1.8 }))}`;
    out += textLines(['legend'], lx + 18, ly + 24, 24, { anchor: 'start', fill: '#444' });
    legend.forEach((le, i) => {
      const y = ly + 60 + i * 40;
      const isBreak = le.classes.includes('breaks');
      const swatch = isBreak
        ? g.rectangle(lx + 18, y - 12, 34, 24, { fill: PALETTE.pink, fillStyle: 'hachure', hachureGap: 5, fillWeight: 1.5, stroke: RED, strokeWidth: 2.4 })
        : g.line(lx + 18, y, lx + 52, y, { stroke: RED, strokeWidth: 2.4, roughness: 1.8 });
      out += drawableToSvg(g, swatch);
      out += textLines([le.label], lx + 64, y, 21, { anchor: 'start', fill: '#333' });
    });
    out += `</g>`;
  }

  out += `<g class="chart" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${scale.toFixed(4)})">${renderChartSvg(chart, L, opts)}</g>`;

  // Footer: what this picture claims.
  let footer: string;
  let footerFill = '#555';
  if (report) {
    const broke = report.bugs.map((b) => b.rule);
    const held = report.holds;
    footer = `checked by TLC · ${held.length} rule${held.length === 1 ? '' : 's'} hold${held.length ? ` (${held.join(', ')})` : ''}` + (broke.length ? ` · ${broke.length} break${broke.length === 1 ? 's' : ''}: ${broke.join(', ')}` : ' · nothing breaks');
    if (report.notChecked.length) footer += ` · not checked: ${report.notChecked.join(', ')}`;
  } else {
    footer = 'a sketch, not a checked model — no TLC report was given';
    footerFill = '#8a5a00';
    out += drawableToSvg(g, g.rectangle(margin - 10, FRAME.h - 66, 24, 24, { fill: '#ffe9a8', fillStyle: 'hachure', hachureGap: 4, fillWeight: 1.6, stroke: '#8a5a00', strokeWidth: 1.8 }));
  }
  out += textLines([footer], margin + (report ? 0 : 26), FRAME.h - 54, 22, { anchor: 'start', fill: footerFill });
  out += `</svg>`;
  return out;
}

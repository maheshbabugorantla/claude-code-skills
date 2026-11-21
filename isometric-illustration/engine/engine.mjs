// Isometric scene engine. Zero dependencies. Runs unchanged in Node 18+ and in browsers.
//
// One scene spec in, three things out:
//   resolve(scene)        -> per-step frames (what is on stage, in what state)
//   validate(scene)       -> errors and layout warnings, each naming the ids involved
//   renderSVG / renderParts -> the picture for one frame
//
// The rule that makes specs predictable: STATE IS CUMULATIVE, MOTION IS PER-STEP.
// show / hide / set / gauges persist into later steps. focus / packets do not.
//
// Keep every top-level declaration in the form `export function` / `export const` or plain
// `function` / `const`: bin/iso.mjs inlines this file into lesson.html by stripping `export`.

export const SPEC_VERSION = 1;
export const KINDS = ['node', 'store', 'client', 'actors', 'queue', 'zone', 'note', 'ring'];
export const SOLID_KINDS = ['node', 'store', 'client', 'actors', 'queue'];
export const HUES = ['neutral', 'blue', 'green', 'amber', 'red', 'violet', 'teal'];
export const LINK_STYLES = ['solid', 'dashed', 'cut', 'pulse', 'off'];
export const STATES = ['ok', 'warn', 'down', 'ghost'];
export const PACKET_KINDS = ['request', 'response', 'event', 'data', 'error'];
export const STEP_TAGS = ['problem', 'idea', 'mechanism', 'failure', 'fix', 'tradeoff', 'recap'];
export const TONES = ['good', 'warn', 'bad', 'info'];
export const SIZES = ['s', 'm', 'l'];
export const SHAPES = ['block', 'slab', 'tower'];
export const VIAS = ['x', 'y', 'xyx', 'yxy', 'straight'];

// One grid cell is 2U wide and U tall on screen (2:1 dimetric projection).
export const U = 40;

// ---------- small helpers ----------

const f = (n) => (Math.round(n * 100) / 100).toString();
const xy = (p) => f(p[0]) + ',' + f(p[1]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isPair = (v) => Array.isArray(v) && v.length === 2 && isNum(v[0]) && isNum(v[1]);

/** Grid point (gx, gy) at height h (px) to screen [x, y]. */
export function project(gx, gy, h = 0) {
  return [(gx - gy) * U, ((gx + gy) * U) / 2 - h];
}

const NARROW = new Set("iljtfrI.,:;|!'()[]/ ".split(''));
const WIDE = new Set('mwMW@%'.split(''));

/** Estimated rendered width of a string. Deliberately a little generous: clipped text is worse than loose pills. */
export function textWidth(str, size, weight = 400) {
  let w = 0;
  for (const ch of String(str)) {
    if (NARROW.has(ch)) w += 0.32;
    else if (WIDE.has(ch)) w += 0.9;
    else if (ch >= 'A' && ch <= 'Z') w += 0.7;
    else if (ch >= '0' && ch <= '9') w += 0.6;
    else w += 0.56;
  }
  return w * size * (weight >= 600 ? 1.07 : 1.02);
}

// ---------- icons: 24x24, stroke only ----------

export const ICONS = {
  server: 'M4 5h16v6H4z M4 13h16v6H4z M7.5 8h.01 M7.5 16h.01',
  disk: 'M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7 M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18',
  lock: 'M7 11h10v9H7z M9 11V8a3 3 0 016 0v3',
  key: 'M4.5 12a3.5 3.5 0 107 0 3.5 3.5 0 10-7 0 M11.5 12H20 M17 12v3 M20 12v2',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6l1-8z',
  route: 'M3 12h7 M10 12l4-6h7 M10 12l4 6h7 M10 12h11',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z',
  gauge: 'M4 17a8 8 0 0116 0 M12 17l4-6',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16z M12 8v4l3 2',
  chip: 'M7 7h10v10H7z M10 10h4v4h-4z M9 4v3 M15 4v3 M9 17v3 M15 17v3 M4 9h3 M4 15h3 M17 9h3 M17 15h3',
  spark: 'M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3z',
  doc: 'M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5',
  search: 'M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13z M15.5 15.5L20 20',
  filter: 'M4 5h16l-6 7v6l-4 2v-8L4 5z',
  code: 'M9 7l-5 5 5 5 M15 7l5 5-5 5',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8z M4 20c0-4 3.6-6 8-6s8 2 8 6',
  cloud: 'M7 18a4 4 0 01-.5-8A5.5 5.5 0 0117 8.5 4.5 4.5 0 0117.5 18H7z',
  chart: 'M4 20h16 M7 20v-6 M12 20V7 M17 20v-9',
  queue: 'M4 7h16 M4 12h16 M4 17h10',
  layers: 'M12 4l8 4-8 4-8-4 8-4z M4 12l8 4 8-4 M4 16l8 4 8-4',
  gear: 'M12 9a3 3 0 100 6 3 3 0 000-6z M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1',
  box: 'M4 8l8-4 8 4v8l-8 4-8-4V8z M4 8l8 4 8-4 M12 12v8',
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  check: 'M5 12l5 5 9-10',
  cross: 'M6 6l12 12 M18 6L6 18',
  bank: 'M4 9l8-5 8 5H4z M6 9v8 M10 9v8 M14 9v8 M18 9v8 M4 20h16',
  table: 'M4 5h16v14H4z M4 10h16 M10 5v14',
  eye: 'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  coin: 'M12 4a8 8 0 100 16 8 8 0 000-16z M12 8v8 M9.5 10.2h5 M9.5 13.8h5',
};

// ---------- resolving steps into frames ----------

/**
 * Turn a scene into frames, one per step (or a single frame when there are no steps).
 * A frame is the full resolved state: nothing in it depends on reading earlier steps.
 */
export function resolve(scene) {
  const cast = scene.cast || [];
  const links = scene.links || [];
  const steps = scene.steps || [];
  const castById = new Map(cast.map((c) => [c.id, c]));
  const linkById = new Map(links.map((l) => [l.id, l]));

  // An id that some step shows is hidden until that step. Everything else is on stage from the start.
  const enters = new Set();
  for (const s of steps) for (const id of s.show || []) enters.add(id);
  let visible = new Set([...castById.keys(), ...linkById.keys()].filter((id) => !enters.has(id)));
  let props = new Map();
  let gauges = {};
  let prevOn = new Set();

  const effective = (vis) => {
    const on = new Set();
    for (const c of cast) if (vis.has(c.id)) on.add(c.id);
    for (const l of links) if (vis.has(l.id) && vis.has(l.from) && vis.has(l.to)) on.add(l.id);
    return on;
  };
  const merged = (base, pr) => {
    const out = new Map();
    for (const item of base) out.set(item.id, { ...item, ...(pr.get(item.id) || {}) });
    return out;
  };

  const frames = [];
  const list = steps.length ? steps : [{}];
  list.forEach((step, index) => {
    visible = new Set(visible);
    for (const id of step.show || []) visible.add(id);
    for (const id of step.hide || []) visible.delete(id);
    props = new Map(props);
    for (const [id, patch] of Object.entries(step.set || {})) props.set(id, { ...(props.get(id) || {}), ...patch });
    gauges = { ...gauges };
    for (const [id, g] of Object.entries(step.gauges || {})) {
      if (g === null) delete gauges[id];
      else gauges[id] = { ...(gauges[id] || {}), ...g };
    }
    const on = effective(visible);
    frames.push({
      index,
      step,
      on,
      cast: merged(cast, props),
      links: merged(links, props),
      gauges,
      entered: [...on].filter((id) => !prevOn.has(id)),
      left: [...prevOn].filter((id) => !on.has(id)),
      focus: step.focus || [],
      packets: step.packets || [],
    });
    prevOn = on;
  });
  return frames;
}

// ---------- measuring: one source of truth for sizes ----------

const NODE = { s: { a: 0.5, h: 18 }, m: { a: 0.66, h: 26 }, l: { a: 0.86, h: 34 } };
const STORE = { s: { r: 22, h: 30 }, m: { r: 28, h: 38 }, l: { r: 35, h: 46 } };

/** Footprint half-extents in grid cells (ax along gx, ay along gy) and body height in px. */
export function measure(e) {
  const size = e.size || 'm';
  switch (e.kind) {
    case 'node': {
      let { a, h } = NODE[size] || NODE.m;
      if (e.shape === 'slab') { a *= 1.18; h *= 0.5; }
      if (e.shape === 'tower') { a *= 0.86; h *= 1.9; }
      return { ax: a, ay: a, h };
    }
    case 'store': {
      const { r, h } = STORE[size] || STORE.m;
      return { ax: r / (U * 1.414), ay: r / (U * 1.414), h, r };
    }
    case 'client':
      return { ax: 0.6, ay: 0.6, h: 52, occ: 8 };
    case 'actors':
      return { ax: 0.78, ay: 0.78, h: 22, occ: 0 };
    case 'queue': {
      const slots = clamp(e.slots || 5, 2, 10);
      const len = slots * 0.44 + 0.3;
      return e.axis === 'y' ? { ax: 0.36, ay: len / 2, h: 20, slots } : { ax: len / 2, ay: 0.36, h: 20, slots };
    }
    case 'zone': {
      const span = isPair(e.span) ? e.span : [3, 3];
      return { ax: span[0] / 2, ay: span[1] / 2, h: 0 };
    }
    case 'ring': {
      const r = e.radius || 1.6;
      return { ax: r, ay: r, h: 0 };
    }
    default:
      return { ax: 0.5, ay: 0.5, h: 0 };
  }
}

function noteSize(e) {
  const lines = e.lines || [];
  let w = e.title ? textWidth(e.title, 11.5, 700) : 0;
  for (const l of lines) w = Math.max(w, textWidth(l, 11.5));
  return { w: clamp(w + 24, 84, 250), h: (e.title ? 22 : 8) + lines.length * 16 + 8 };
}

/** Screen-space bounding box of an entity body (no caption). */
export function bodyBox(e) {
  const [gx, gy] = e.at;
  const m = measure(e);
  if (e.kind === 'note') {
    const { w, h } = noteSize(e);
    const c = project(gx, gy);
    return { x0: c[0] - w / 2, y0: c[1] - h - 8, x1: c[0] + w / 2, y1: c[1] - 8 };
  }
  if (e.kind === 'store') {
    const c = project(gx, gy);
    return { x0: c[0] - m.r, y0: c[1] - m.h - m.r / 2, x1: c[0] + m.r, y1: c[1] + m.r / 2 };
  }
  const N = project(gx - m.ax, gy - m.ay), E = project(gx + m.ax, gy - m.ay);
  const S = project(gx + m.ax, gy + m.ay), W = project(gx - m.ax, gy + m.ay);
  return { x0: W[0], y0: N[1] - m.h, x1: E[0], y1: S[1] };
}

/** Screen-space box of an entity's caption, or null when it has none. */
export function captionBox(e) {
  if (!e.label || e.kind === 'note' || e.kind === 'zone') return null;
  const b = bodyBox(e);
  const cx = (b.x0 + b.x1) / 2;
  const w = Math.max(textWidth(e.label, 12.5, 600), e.sub ? textWidth(e.sub, 10.5) : 0);
  const side = e.labelSide || 'below';
  if (side === 'below') return { x0: cx - w / 2, y0: b.y1 + 4, x1: cx + w / 2, y1: b.y1 + (e.sub ? 34 : 20), anchor: 'middle', tx: cx, ty: b.y1 + 17 };
  const ty = b.y1 - (b.y1 - b.y0) * 0.28;
  if (side === 'left') return { x0: b.x0 - 8 - w, y0: ty - 12, x1: b.x0 - 8, y1: ty + (e.sub ? 18 : 5), anchor: 'end', tx: b.x0 - 8, ty };
  return { x0: b.x1 + 8, y0: ty - 12, x1: b.x1 + 8 + w, y1: ty + (e.sub ? 18 : 5), anchor: 'start', tx: b.x1 + 8, ty };
}

const boxesOverlap = (a, b, pad = 0) => a.x0 < b.x1 - pad && b.x0 < a.x1 - pad && a.y0 < b.y1 - pad && b.y0 < a.y1 - pad;

// ---------- link routing (grid space, then projected) ----------

/**
 * Grid-space route between two entities. Routes follow the lattice:
 *   x / y     one elbow (run along gx first, or along gy first)
 *   xyx / yxy two elbows through a shared bus line; "bend" (0..1) places the bus
 *   straight  a direct run, also used when the two already share a row or column
 */
export function routeGrid(a, b, via, bend) {
  const [ax, ay] = a.at, [bx, by] = b.at;
  const dx = bx - ax, dy = by - ay;
  if (via === 'straight' || Math.abs(dx) < 0.01 || Math.abs(dy) < 0.01) return [[ax, ay], [bx, by]];
  const k = isNum(bend) ? clamp(bend, 0.1, 0.9) : 0.5;
  if (via === 'xyx') return [[ax, ay], [ax + dx * k, ay], [ax + dx * k, by], [bx, by]];
  if (via === 'yxy') return [[ax, ay], [ax, ay + dy * k], [bx, ay + dy * k], [bx, by]];
  return via === 'y' ? [[ax, ay], [ax, by], [bx, by]] : [[ax, ay], [bx, ay], [bx, by]];
}

/** How far from an entity's centre (in cells) a link must stop to stay visible at that end. */
function endClearance(pts, ent, atStart) {
  const m = measure(ent);
  const i = atStart ? 0 : pts.length - 1, j = atStart ? 1 : pts.length - 2;
  const dx = pts[j][0] - pts[i][0], dy = pts[j][1] - pts[i][1];
  if (!SOLID_KINDS.includes(ent.kind)) return 0.12;
  let ext;
  if (Math.abs(dy) < 0.01) ext = m.ax;
  else if (Math.abs(dx) < 0.01) ext = m.ay;
  else ext = Math.max(m.ax, m.ay) * 1.15;
  // A run that arrives from behind (lower gx or gy) is hidden by the body's height,
  // so it stops where it meets the silhouette, not the footprint.
  return ext + (dx + dy < 0 ? Math.max(0.16, (m.occ === undefined ? m.h : m.occ) / U + 0.06) : 0.16);
}

function trimEnd(pts, ent, atStart) {
  const i = atStart ? 0 : pts.length - 1, j = atStart ? 1 : pts.length - 2;
  const p = pts[i], q = pts[j];
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.min(endClearance(pts, ent, atStart), len * 0.6) / len;
  const out = pts.slice();
  out[i] = [p[0] + dx * t, p[1] + dy * t];
  return out;
}

/** Screen polyline for a link, with trimmed ends and rounded elbows. */
export function linkPolyline(link, castMap) {
  const a = castMap.get(link.from), b = castMap.get(link.to);
  let g = routeGrid(a, b, link.via, link.bend);
  g = trimEnd(g, a, true);
  g = trimEnd(g, b, false);
  const out = [g[0]];
  for (let i = 1; i < g.length - 1; i++) {
    const p0 = g[i - 1], c = g[i], p1 = g[i + 1];
    const l0 = Math.hypot(c[0] - p0[0], c[1] - p0[1]) || 1, l1 = Math.hypot(p1[0] - c[0], p1[1] - c[1]) || 1;
    const r = Math.min(0.42, l0 * 0.5, l1 * 0.5);
    const c0 = [c[0] + ((p0[0] - c[0]) / l0) * r, c[1] + ((p0[1] - c[1]) / l0) * r];
    const c1 = [c[0] + ((p1[0] - c[0]) / l1) * r, c[1] + ((p1[1] - c[1]) / l1) * r];
    out.push(c0);
    for (let k = 1; k < 6; k++) {
      const t = k / 6, u = 1 - t;
      out.push([u * u * c0[0] + 2 * u * t * c[0] + t * t * c1[0], u * u * c0[1] + 2 * u * t * c[1] + t * t * c1[1]]);
    }
    out.push(c1);
  }
  out.push(g[g.length - 1]);
  return out.map((p) => project(p[0], p[1]));
}

/** Point and heading at fraction t (0..1) along a polyline. */
export function pointAt(poly, t) {
  let total = 0;
  const seg = [];
  for (let i = 1; i < poly.length; i++) {
    const d = Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]);
    seg.push(d);
    total += d;
  }
  let want = clamp(t, 0, 1) * total;
  for (let i = 0; i < seg.length; i++) {
    if (want <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? want / seg[i] : 0;
      const a = poly[i], b = poly[i + 1];
      return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, dx: (b[0] - a[0]) / (seg[i] || 1), dy: (b[1] - a[1]) / (seg[i] || 1) };
    }
    want -= seg[i];
  }
  return { x: poly[0][0], y: poly[0][1], dx: 1, dy: 0 };
}

// ---------- validation ----------

/** Check a scene. Errors make it unrenderable; warnings are layout and teaching problems worth fixing. */
export function validate(scene, themeNames) {
  const errors = [], warnings = [];
  const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
  if (!scene || typeof scene !== 'object') return { errors: ['scene is not an object'], warnings };
  if (scene.version !== SPEC_VERSION) err(`version must be ${SPEC_VERSION}`);
  if (!scene.title) warn('scene has no title');
  if (themeNames && scene.theme && !themeNames.includes(scene.theme)) err(`unknown theme "${scene.theme}" (have: ${themeNames.join(', ')})`);
  const cast = Array.isArray(scene.cast) ? scene.cast : [];
  const links = Array.isArray(scene.links) ? scene.links : [];
  const steps = Array.isArray(scene.steps) ? scene.steps : [];
  if (!cast.length) err('cast is empty');

  const ids = new Set();
  const idOk = (id, where) => {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id)) { err(`${where}: id "${id}" must be lowercase letters, digits and dashes`); return; }
    if (ids.has(id)) err(`duplicate id "${id}"`);
    ids.add(id);
  };
  const castIds = new Set(), linkIds = new Set();
  for (const c of cast) {
    idOk(c.id, 'cast');
    castIds.add(c.id);
    if (!KINDS.includes(c.kind)) err(`${c.id}: unknown kind "${c.kind}" (have: ${KINDS.join(', ')})`);
    if (!isPair(c.at)) err(`${c.id}: "at" must be [gx, gy]`);
    if (c.hue && !HUES.includes(c.hue)) err(`${c.id}: unknown hue "${c.hue}" (have: ${HUES.join(', ')})`);
    if (c.state && !STATES.includes(c.state)) err(`${c.id}: unknown state "${c.state}"`);
    if (c.size && !SIZES.includes(c.size)) err(`${c.id}: size must be one of ${SIZES.join(', ')}`);
    if (c.shape && !SHAPES.includes(c.shape)) err(`${c.id}: shape must be one of ${SHAPES.join(', ')}`);
    if (c.icon && !ICONS[c.icon]) err(`${c.id}: unknown icon "${c.icon}" (have: ${Object.keys(ICONS).join(', ')})`);
    if (c.labelSide && !['below', 'left', 'right'].includes(c.labelSide)) err(`${c.id}: labelSide must be "below", "left" or "right"`);
    if (c.kind === 'zone' && !isPair(c.span)) err(`${c.id}: a zone needs "span": [cells along gx, cells along gy]`);
    if (c.label && String(c.label).length > 22) warn(`${c.id}: label "${c.label}" is over 22 characters; shorten it or move detail to "sub"`);
    if (c.kind === 'note' && (c.lines || []).length > 6) warn(`${c.id}: a note reads best at 6 lines or fewer`);
  }
  for (const l of links) {
    idOk(l.id, 'links');
    linkIds.add(l.id);
    for (const end of ['from', 'to']) if (!castIds.has(l[end])) err(`${l.id}: "${end}" names "${l[end]}", which is not in cast`);
    if (l.from === l.to) err(`${l.id}: from and to are the same entity`);
    if (l.style && !LINK_STYLES.includes(l.style)) err(`${l.id}: unknown style "${l.style}" (have: ${LINK_STYLES.join(', ')})`);
    if (l.via && !VIAS.includes(l.via)) err(`${l.id}: via must be one of ${VIAS.join(', ')}`);
    if (l.bend !== undefined && !(isNum(l.bend) && l.bend > 0 && l.bend < 1)) err(`${l.id}: bend must be a number between 0 and 1`);
    if (l.arrows && !['end', 'both', 'none'].includes(l.arrows)) err(`${l.id}: arrows must be "end", "both" or "none"`);
    if (l.label && String(l.label).length > 26) warn(`${l.id}: link label is over 26 characters`);
  }
  const stepIds = new Set();
  steps.forEach((s, i) => {
    const at = `step ${i + 1}`;
    if (!s.title) err(`${at}: missing title`);
    if (s.id) { if (stepIds.has(s.id)) err(`${at}: duplicate step id "${s.id}"`); stepIds.add(s.id); }
    if (s.tag && !STEP_TAGS.includes(s.tag)) err(`${at}: unknown tag "${s.tag}" (have: ${STEP_TAGS.join(', ')})`);
    for (const key of ['show', 'hide', 'focus']) for (const id of s[key] || []) if (!ids.has(id)) err(`${at}: ${key} names unknown id "${id}"`);
    for (const [id, patch] of Object.entries(s.set || {})) {
      if (!ids.has(id)) { err(`${at}: set names unknown id "${id}"`); continue; }
      if (patch.id || patch.kind || patch.from || patch.to) err(`${at}: set on "${id}" may not change id, kind, from or to`);
      if (patch.state && !STATES.includes(patch.state)) err(`${at}: set on "${id}" has unknown state "${patch.state}"`);
      if (patch.hue && !HUES.includes(patch.hue)) err(`${at}: set on "${id}" has unknown hue "${patch.hue}"`);
      if (patch.style && !LINK_STYLES.includes(patch.style)) err(`${at}: set on "${id}" has unknown style "${patch.style}"`);
      if (patch.at && !isPair(patch.at)) err(`${at}: set on "${id}" has a bad "at"`);
      if (patch.badge && typeof patch.badge === 'object' && patch.badge.tone && !TONES.includes(patch.badge.tone)) err(`${at}: badge tone on "${id}" must be one of ${TONES.join(', ')}`);
    }
    for (const p of s.packets || []) {
      if (!linkIds.has(p.on)) err(`${at}: packet travels on unknown link "${p.on}"`);
      if (p.kind && !PACKET_KINDS.includes(p.kind)) err(`${at}: unknown packet kind "${p.kind}" (have: ${PACKET_KINDS.join(', ')})`);
    }
    for (const g of Object.values(s.gauges || {})) if (g && g.tone && !TONES.includes(g.tone)) err(`${at}: gauge tone must be one of ${TONES.join(', ')}`);
    const words = (s.body || []).join(' ').split(/\s+/).filter(Boolean).length;
    if (words > 80) warn(`${at}: body is ${words} words; keep a step under 80 so the picture carries it`);
  });
  if (steps.length > 14) warn(`${steps.length} steps; lessons hold attention best at 6 to 12`);
  if (errors.length) return { errors, warnings };

  // Layout and teaching checks need resolved frames.
  const frames = resolve(scene);
  const everOn = new Set();
  const seen = new Map();
  frames.forEach((fr, i) => {
    const at = '@';
    const warn = (m) => { if (!seen.has(m)) seen.set(m, []); seen.get(m).push(i + 1); };
    for (const id of fr.on) everOn.add(id);
    for (const id of fr.focus) if (!fr.on.has(id)) warn(`${at}: focus names "${id}", which is not on stage in this step`);
    for (const p of fr.packets) if (!fr.on.has(p.on)) warn(`${at}: packet travels on "${p.on}", which is not on stage in this step`);
    const solids = [...fr.cast.values()].filter((e) => fr.on.has(e.id) && SOLID_KINDS.includes(e.kind));
    if (solids.length > 14) warn(`${at}: ${solids.length} solid entities on stage; over 14 reads as clutter`);
    for (let a = 0; a < solids.length; a++) {
      for (let b = a + 1; b < solids.length; b++) {
        const A = solids[a], B = solids[b], ma = measure(A), mb = measure(B);
        if (Math.abs(A.at[0] - B.at[0]) < ma.ax + mb.ax + 0.45 && Math.abs(A.at[1] - B.at[1]) < ma.ay + mb.ay + 0.45) {
          warn(`${at}: "${A.id}" and "${B.id}" are too close; move one at least ${f(ma.ax + mb.ax + 0.5)} cells away along gx or ${f(ma.ay + mb.ay + 0.5)} along gy`);
        }
      }
    }
    const caps = solids.map((e) => ({ id: e.id, box: captionBox(e) })).filter((c) => c.box);
    for (let a = 0; a < caps.length; a++) {
      for (let b = a + 1; b < caps.length; b++) if (boxesOverlap(caps[a].box, caps[b].box, 2)) warn(`${at}: captions of "${caps[a].id}" and "${caps[b].id}" overlap`);
      for (const e of solids) if (e.id !== caps[a].id && boxesOverlap(caps[a].box, bodyBox(e), 6)) warn(`${at}: caption of "${caps[a].id}" is covered by "${e.id}"; move one of them, or set "labelSide" on "${caps[a].id}" to "left" or "right"`);
    }
    for (const l of fr.links.values()) {
      if (!fr.on.has(l.id)) continue;
      const g = routeGrid(fr.cast.get(l.from), fr.cast.get(l.to), l.via, l.bend);
      for (const e of solids) {
        if (e.id === l.from || e.id === l.to) continue;
        const m = measure(e);
        let hit = false;
        for (let s = 1; s < g.length && !hit; s++) {
          for (let k = 0; k <= 20 && !hit; k++) {
            const px = g[s - 1][0] + ((g[s][0] - g[s - 1][0]) * k) / 20, py = g[s - 1][1] + ((g[s][1] - g[s - 1][1]) * k) / 20;
            if (Math.abs(px - e.at[0]) < m.ax + 0.05 && Math.abs(py - e.at[1]) < m.ay + 0.05) hit = true;
          }
        }
        if (hit) warn(`${at}: link "${l.id}" runs under "${e.id}"; flip its "via" or move "${e.id}"`);
      }
      // A straight link between two close solids can be almost wholly hidden behind the nearer body.
      if (g.length === 2) {
        const a = fr.cast.get(l.from), b = fr.cast.get(l.to);
        if (SOLID_KINDS.includes(a.kind) && SOLID_KINDS.includes(b.kind)) {
          const full = Math.hypot(g[1][0] - g[0][0], g[1][1] - g[0][1]);
          const shown = full - endClearance(g, a, true) - endClearance(g, b, false);
          if (shown < 0.5) warn(`${at}: only ${f(Math.max(0, shown))} cells of link "${l.id}" show between "${a.id}" and "${b.id}"; move them at least ${f(full - shown + 0.8)} cells apart`);
        }
      }
    }
    if (steps.length && i > 0) {
      const newSolids = fr.entered.filter((id) => SOLID_KINDS.includes((fr.cast.get(id) || {}).kind));
      if (newSolids.length > 3) warn(`${at}: ${newSolids.length} entities enter at once (${newSolids.join(', ')}); one idea per step usually means 1 to 3`);
      const s = fr.step;
      const changed = fr.entered.length || fr.left.length || Object.keys(s.set || {}).length || (s.packets || []).length || (s.focus || []).length || Object.keys(s.gauges || {}).length;
      if (!changed) warn(`${at}: nothing changes on stage; give the step a show, set, focus, packet or gauge`);
    }
  });
  for (const [m, at] of seen) {
    const runs = [];
    for (const n of at) { const last = runs[runs.length - 1]; if (last && last[1] === n - 1) last[1] = n; else runs.push([n, n]); }
    const where = !steps.length ? 'scene' : (at.length > 1 ? 'steps ' : 'step ') + runs.map((r) => (r[0] === r[1] ? r[0] : `${r[0]}-${r[1]}`)).join(', ');
    warnings.push(m.replace('@', where));
  }
  for (const id of ids) if (!everOn.has(id)) warn(`"${id}" is never on stage`);
  const [, , vw, vh] = computeLayout(scene, frames).viewBox;
  if (vw > 840 || vh > 600) warn(`the stage is ${Math.round(vw)} by ${Math.round(vh)} units; past about 840 by 600 the labels get small on a phone. Pull entities closer or split the scene`);
  return { errors, warnings };
}

/** Plain-text table of what each step resolves to. Read this to see what persists. */
export function explain(scene) {
  const frames = resolve(scene);
  const out = [];
  frames.forEach((fr, i) => {
    const s = fr.step;
    out.push(`STEP ${i + 1}${s.tag ? ` [${s.tag}]` : ''}  ${s.title || '(static scene)'}`);
    out.push(`  on stage : ${[...fr.on].join(', ') || '(nothing)'}`);
    if (fr.entered.length && i > 0) out.push(`  enters   : ${fr.entered.join(', ')}`);
    if (fr.left.length) out.push(`  leaves   : ${fr.left.join(', ')}`);
    const durable = [];
    for (const map of [fr.cast, fr.links]) {
      for (const e of map.values()) {
        if (!fr.on.has(e.id)) continue;
        const bits = [];
        if (e.state && e.state !== 'ok') bits.push(`state=${e.state}`);
        if (e.badge) bits.push(`badge="${typeof e.badge === 'object' ? e.badge.text : e.badge}"`);
        if (e.style && e.style !== 'solid') bits.push(`style=${e.style}`);
        if (bits.length) durable.push(`${e.id}(${bits.join(' ')})`);
      }
    }
    if (durable.length) out.push(`  persists : ${durable.join(', ')}`);
    if (fr.focus.length) out.push(`  focus    : ${fr.focus.join(', ')}  (this step only)`);
    if (fr.packets.length) out.push(`  packets  : ${fr.packets.map((p) => `${p.kind || 'request'} on ${p.on}${p.reverse ? ' (reverse)' : ''}`).join('; ')}  (this step only)`);
    const g = Object.entries(fr.gauges).map(([k, v]) => `${v.label || k}=${v.value}`);
    if (g.length) out.push(`  gauges   : ${g.join(', ')}`);
  });
  return out.join('\n');
}

// ---------- layout: one viewBox for every frame, so the stage never jumps ----------

export function computeLayout(scene, frames) {
  frames = frames || resolve(scene);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  let gx0 = Infinity, gy0 = Infinity, gx1 = -Infinity, gy1 = -Infinity;
  const grow = (b) => { x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); };
  for (const fr of frames) {
    for (const e of fr.cast.values()) {
      const m = measure(e);
      if (e.kind !== 'note') {
        gx0 = Math.min(gx0, e.at[0] - m.ax); gx1 = Math.max(gx1, e.at[0] + m.ax);
        gy0 = Math.min(gy0, e.at[1] - m.ay); gy1 = Math.max(gy1, e.at[1] + m.ay);
      }
      const b = bodyBox(e);
      grow({ x0: b.x0 - 8, y0: b.y0 - (e.badge ? 34 : 10), x1: b.x1 + 8, y1: b.y1 + 6 });
      const c = captionBox(e);
      if (c) grow(c);

      if (e.kind === 'zone' && e.label) grow({ x0: b.x0, y0: b.y0, x1: b.x1 + 8, y1: b.y1 + 20 });
      if (e.kind === 'ring') grow({ x0: b.x0 - 46, y0: b.y0 - 26, x1: b.x1 + 46, y1: b.y1 + 22 });
    }
  }
  const pad = 0.7;
  const board = { gx0: gx0 - pad, gy0: gy0 - pad, gx1: gx1 + pad, gy1: gy1 + pad };
  const corners = [project(board.gx0, board.gy0), project(board.gx1, board.gy0), project(board.gx1, board.gy1), project(board.gx0, board.gy1)];
  for (const c of corners) grow({ x0: c[0], y0: c[1], x1: c[0], y1: c[1] + 12 });
  const m = 14;
  return { board, viewBox: [x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m] };
}

// ---------- drawing ----------

function hueOf(th, e) {
  const name = e.state === 'down' ? 'neutral' : e.hue || (e.kind === 'store' ? 'violet' : e.kind === 'queue' ? 'amber' : 'neutral');
  return th.hues[name] || th.hues.neutral;
}

function outlineAttrs(th) {
  return th.stroke.width > 0 ? ` stroke="${th.stroke.color}" stroke-width="${th.stroke.width}" stroke-linejoin="round" stroke-linecap="round"` : '';
}

function face(pts, fill, th, ghost) {
  const d = 'M' + pts.map(xy).join('L') + 'Z';
  if (ghost) return `<path d="${d}" fill="none" stroke="${th.link.muted}" stroke-width="1.3" stroke-dasharray="4 4" stroke-linejoin="round"/>`;
  return `<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="${th.round}" stroke-linejoin="round"/>`;
}

/** A box sitting on the floor: left face, right face, top face, then edges. */
function prism(gx, gy, ax, ay, h, hue, th, ghost, base = 0) {
  const up = (p, k) => [p[0], p[1] - k];
  const N = up(project(gx - ax, gy - ay), base), E = up(project(gx + ax, gy - ay), base);
  const S = up(project(gx + ax, gy + ay), base), W = up(project(gx - ax, gy + ay), base);
  const Nt = up(N, h), Et = up(E, h), St = up(S, h), Wt = up(W, h);
  let s = face([Wt, St, S, W], hue.left, th, ghost) + face([St, Et, E, S], hue.right, th, ghost) + face([Nt, Et, St, Wt], hue.top, th, ghost);
  if (!ghost) {
    if (th.stroke.width > 0) {
      s += `<path d="M${xy(Nt)}L${xy(Et)}L${xy(E)}L${xy(S)}L${xy(W)}L${xy(Wt)}Z M${xy(Wt)}L${xy(St)}L${xy(Et)} M${xy(St)}L${xy(S)}" fill="none"${outlineAttrs(th)}/>`;
    } else if (th.highlight) {
      s += `<path d="M${xy(Wt)}L${xy(St)}L${xy(Et)}" fill="none" stroke="${th.highlight}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
    }
  }
  return { html: s, top: [St[0], (Nt[1] + St[1]) / 2], S, N: Nt };
}

/** An icon painted on a horizontal surface: upright, foreshortened 2:1. */
function decal(name, cx, cy, k, color) {
  if (!name || !ICONS[name]) return '';
  return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${f(k)} ${f(k / 2)}) translate(-12 -12)" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name]}"/></g>`;
}

function shadow(gx, gy, ax, ay, h, th) {
  const k = Math.min(0.9, h / 44);
  const pts = [project(gx + ax, gy - ay), project(gx + ax + k, gy - ay), project(gx + ax + k, gy + ay), project(gx + ax, gy + ay), project(gx - ax, gy + ay), project(gx - ax, gy + ay + 0.12), project(gx + ax + 0.1, gy + ay + 0.12)];
  return `<path d="M${xy(pts[0])}L${xy(pts[1])}L${xy(pts[2])}L${xy(pts[6])}L${xy(pts[5])}L${xy(pts[4])}L${xy(pts[3])}Z" fill="${th.shadow.color}" opacity="${th.shadow.opacity}"/>`;
}

function drawNode(e, th) {
  const [gx, gy] = e.at, m = measure(e), hue = hueOf(th, e), ghost = e.state === 'ghost';
  const p = prism(gx, gy, m.ax, m.ay, m.h, hue, th, ghost);
  const k = (m.ax * U * 1.15) / 12;
  return (ghost ? '' : shadow(gx, gy, m.ax, m.ay, m.h, th)) + p.html + decal(e.icon, p.top[0], p.top[1], k, ghost ? th.link.muted : hue.ink);
}

function drawStore(e, th) {
  const [gx, gy] = e.at, m = measure(e), hue = hueOf(th, e), ghost = e.state === 'ghost';
  const c = project(gx, gy), rx = m.r, ry = m.r / 2, ty = c[1] - m.h;
  const body = `M${f(c[0] - rx)},${f(ty)}V${f(c[1])}A${rx},${ry} 0 0 0 ${f(c[0] + rx)},${f(c[1])}V${f(ty)}Z`;
  if (ghost) {
    return `<path d="${body}" fill="none" stroke="${th.link.muted}" stroke-width="1.3" stroke-dasharray="4 4"/><ellipse cx="${f(c[0])}" cy="${f(ty)}" rx="${rx}" ry="${ry}" fill="none" stroke="${th.link.muted}" stroke-width="1.3" stroke-dasharray="4 4"/>`;
  }
  const split = c[0] + rx * 0.12;
  const right = `M${f(split)},${f(ty)}V${f(c[1] + ry * 0.99)}A${rx},${ry} 0 0 0 ${f(c[0] + rx)},${f(c[1])}V${f(ty)}Z`;
  let s = `<ellipse cx="${f(c[0] + rx * 0.5)}" cy="${f(c[1] + 3)}" rx="${f(rx * 1.05)}" ry="${f(ry * 1.05)}" fill="${th.shadow.color}" opacity="${th.shadow.opacity}"/>`;
  s += `<path d="${body}" fill="${hue.left}"/><path d="${right}" fill="${hue.right}"/>`;
  for (const t of [0.36, 0.7]) {
    const y = ty + m.h * t;
    s += `<path d="M${f(c[0] - rx)},${f(y)}A${rx},${ry} 0 0 0 ${f(c[0] + rx)},${f(y)}" fill="none" stroke="${hue.ink}" stroke-width="1" opacity=".28"/>`;
  }
  s += `<ellipse cx="${f(c[0])}" cy="${f(ty)}" rx="${rx}" ry="${ry}" fill="${hue.top}"/>`;
  if (th.stroke.width > 0) s += `<path d="${body}" fill="none"${outlineAttrs(th)}/><ellipse cx="${f(c[0])}" cy="${f(ty)}" rx="${rx}" ry="${ry}" fill="none"${outlineAttrs(th)}/>`;
  else if (th.highlight) s += `<path d="M${f(c[0] - rx)},${f(ty)}A${rx},${ry} 0 0 0 ${f(c[0] + rx)},${f(ty)}" fill="none" stroke="${th.highlight}" stroke-width="1" opacity=".7"/>`;
  return s + decal(e.icon, c[0], ty, rx / 15, hue.ink);
}

function drawClient(e, th) {
  const [gx, gy] = e.at, hue = hueOf(th, e), ghost = e.state === 'ghost';
  const base = prism(gx, gy, 0.6, 0.6, 6, th.hues.neutral, th, ghost);
  // An upright screen standing along the gx axis, leaning on nothing: bottom edge slopes down-right.
  const w = 0.42, lift = 10, hs = 36, t = 0.09;
  const b0 = project(gx - w, gy + 0.05, lift), b1 = project(gx + w, gy + 0.05, lift);
  const k0 = project(gx - w, gy + 0.05 - t, lift), k1 = project(gx + w, gy + 0.05 - t, lift);
  const up = (p) => [p[0], p[1] - hs];
  let s = (ghost ? '' : shadow(gx, gy, 0.6, 0.6, 6, th)) + base.html;
  const post = project(gx, gy + 0.05, 6);
  s += `<path d="M${f(post[0])},${f(post[1])}V${f(post[1] - 6)}" stroke="${ghost ? th.link.muted : th.ink}" stroke-width="3" stroke-linecap="round"/>`;
  if (ghost) return s + face([up(b0), up(b1), b1, b0], '', th, true);
  s += face([up(k0), up(k1), up(b1), up(b0)], hue.top, th) + face([up(b1), up(k1), k1, b1], hue.right, th);
  s += face([up(b0), up(b1), b1, b0], th.screen.bg, th);
  const sk = (px, py) => [b0[0] + px, b0[1] - hs + py + px * 0.5];
  const bar = (px, py, len, col, wd) => `<path d="M${xy(sk(px, py))}L${xy(sk(px + len, py))}" stroke="${col}" stroke-width="${wd}" stroke-linecap="round"/>`;
  s += bar(5, 7, 12, hue.edge || hue.left, 3) + bar(5, 15, 22, th.screen.line, 2) + bar(5, 21, 16, th.screen.line, 2) + bar(5, 27, 20, th.screen.line, 2);
  if (th.stroke.width > 0) s += `<path d="M${xy(up(b0))}L${xy(up(b1))}L${xy(b1)}L${xy(b0)}Z" fill="none"${outlineAttrs(th)}/>`;
  return s;
}

const PEG_SPOTS = [[0, 0], [-0.42, 0.1], [0.42, -0.1], [0.05, 0.45], [-0.05, -0.45], [-0.45, -0.38], [0.45, 0.38], [-0.4, 0.52], [0.4, -0.52], [0, 0.0], [0.2, 0.2], [-0.2, -0.2]];

function drawActors(e, th) {
  const [gx, gy] = e.at, n = clamp(e.count || 6, 1, 9), ghost = e.state === 'ghost';
  const order = e.hue ? [e.hue] : ['blue', 'amber', 'green', 'violet', 'red', 'teal'];
  const pegs = PEG_SPOTS.slice(0, n).map((p, i) => ({ g: [gx + p[0], gy + p[1]], hue: th.hues[order[i % order.length]] }));
  pegs.sort((a, b) => a.g[0] + a.g[1] - (b.g[0] + b.g[1]));
  let s = '';
  for (const p of pegs) {
    const c = project(p.g[0], p.g[1]);
    if (ghost) {
      s += `<rect x="${f(c[0] - 5)}" y="${f(c[1] - 15)}" width="10" height="15" rx="5" fill="none" stroke="${th.link.muted}" stroke-dasharray="3 3"/><circle cx="${f(c[0])}" cy="${f(c[1] - 20)}" r="4.6" fill="none" stroke="${th.link.muted}" stroke-dasharray="3 3"/>`;
      continue;
    }
    s += `<ellipse cx="${f(c[0] + 3)}" cy="${f(c[1] + 0.5)}" rx="7.5" ry="3.2" fill="${th.shadow.color}" opacity="${th.shadow.opacity}"/>`;
    s += `<rect x="${f(c[0] - 5)}" y="${f(c[1] - 15)}" width="10" height="16" rx="5" fill="${p.hue.left}"${outlineAttrs(th)}/><path d="M${f(c[0])},${f(c[1] - 14)}v14" stroke="${p.hue.right}" stroke-width="4" stroke-linecap="round" transform="translate(2.4 0)" opacity="${th.stroke.width > 0 ? 0 : 1}"/>`;
    s += `<circle cx="${f(c[0])}" cy="${f(c[1] - 20)}" r="4.8" fill="${p.hue.top}"${outlineAttrs(th)}/>`;
  }
  return s;
}

function drawQueue(e, th) {
  const [gx, gy] = e.at, m = measure(e), hue = hueOf(th, e), ghost = e.state === 'ghost';
  const tray = prism(gx, gy, m.ax, m.ay, 7, th.hues.neutral, th, ghost);
  let s = (ghost ? '' : shadow(gx, gy, m.ax, m.ay, 7, th)) + tray.html;
  const fill = clamp(e.fill === undefined ? m.slots : e.fill, 0, m.slots);
  const alongY = e.axis === 'y';
  const cells = [];
  for (let i = 0; i < m.slots; i++) {
    const off = (i - (m.slots - 1) / 2) * 0.44;
    cells.push({ i, g: alongY ? [gx, gy + off] : [gx + off, gy] });
  }
  cells.sort((a, b) => a.g[0] + a.g[1] - (b.g[0] + b.g[1]));
  for (const c of cells) {
    // The head of the queue is the high-gx (or high-gy) end: items leave from there.
    const filled = c.i >= m.slots - fill;
    if (filled && !ghost) s += prism(c.g[0], c.g[1], 0.15, 0.15, 11, hue, th, false, 7).html;
    else {
      const a = 0.13, p = [project(c.g[0] - a, c.g[1] - a, 7), project(c.g[0] + a, c.g[1] - a, 7), project(c.g[0] + a, c.g[1] + a, 7), project(c.g[0] - a, c.g[1] + a, 7)];
      s += `<path d="M${p.map(xy).join('L')}Z" fill="none" stroke="${th.link.muted}" stroke-width="1" stroke-dasharray="2 2.5"/>`;
    }
  }
  return s;
}

function drawZone(e, th) {
  const [gx, gy] = e.at, m = measure(e), hue = th.hues[e.hue || 'blue'] || th.hues.neutral;
  const pts = [project(gx - m.ax, gy - m.ay), project(gx + m.ax, gy - m.ay), project(gx + m.ax, gy + m.ay), project(gx - m.ax, gy + m.ay)];
  let s = `<path d="M${pts.map(xy).join('L')}Z" fill="${hue.top}" fill-opacity="${th.zone.fill}" stroke="${hue.edge || hue.left}" stroke-width="1.4" stroke-dasharray="6 5" stroke-linejoin="round"/>`;
  if (e.label) {
    // Lettered along the front-right edge, outside the zone: flows enter from the back, so nothing crosses here.
    const S = pts[2], E = pts[1], k = 0.08;
    const x = S[0] + (E[0] - S[0]) * k + 7, y = S[1] + (E[1] - S[1]) * k + 13;
    s += `<text transform="translate(${f(x)} ${f(y)}) rotate(-26.565)" font-size="11.5" font-weight="600" letter-spacing=".4" fill="${hue.edge || hue.right}">${esc(e.label)}</text>`;
  }
  return s;
}

function drawRing(e, th) {
  const [gx, gy] = e.at, m = measure(e), c = project(gx, gy);
  const rx = m.ax * U * 1.414, ry = rx / 2, ghost = e.state === 'ghost';
  const at = (deg, k = 1) => { const a = (deg * Math.PI) / 180; return [c[0] + Math.sin(a) * rx * k, c[1] - Math.cos(a) * ry * k]; };
  let s = `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${ghost ? th.link.muted : th.link.color}" stroke-width="2"${ghost ? ' stroke-dasharray="5 5"' : ''}/>`;
  for (const arc of e.arcs || []) {
    const hue = th.hues[arc.hue || 'blue'] || th.hues.blue;
    const sweep = ((arc.to - arc.from) % 360 + 360) % 360;
    const p0 = at(arc.from), p1 = at(arc.to);
    s += `<path d="M${xy(p0)}A${f(rx)},${f(ry)} 0 ${sweep > 180 ? 1 : 0} 1 ${xy(p1)}" fill="none" stroke="${hue.edge || hue.left}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  }
  const marks = (e.marks || []).slice().sort((a, b) => at(a.at)[1] - at(b.at)[1]);
  for (const mk of marks) {
    const p = at(mk.at), hue = th.hues[mk.hue || (mk.kind === 'key' ? 'amber' : 'blue')] || th.hues.blue;
    if (mk.kind === 'key') {
      s += `<path d="M${f(p[0] - 6)},${f(p[1])}L${f(p[0])},${f(p[1] - 3)}L${f(p[0] + 6)},${f(p[1])}L${f(p[0])},${f(p[1] + 3)}Z" fill="${hue.edge || hue.left}" stroke="${th.board.top}" stroke-width="1.2"/>`;
    } else {
      s += `<path d="M${f(p[0] - 10)},${f(p[1] - 9)}V${f(p[1])}A10,5 0 0 0 ${f(p[0] + 10)},${f(p[1])}V${f(p[1] - 9)}Z" fill="${hue.left}"/><ellipse cx="${f(p[0])}" cy="${f(p[1] - 9)}" rx="10" ry="5" fill="${hue.top}"${outlineAttrs(th)}/>`;
    }
    if (mk.label) {
      const o = at(mk.at, 1.0), right = Math.sin((mk.at * Math.PI) / 180) >= 0;
      s += `<text x="${f(o[0] + (right ? 15 : -15))}" y="${f(o[1] - (mk.kind === 'key' ? 5 : 12))}" text-anchor="${right ? 'start' : 'end'}" font-size="11" font-weight="600" fill="${th.ink}" ${halo(th)}>${esc(mk.label)}</text>`;
    }
  }
  return s;
}

function drawNote(e, th) {
  const b = bodyBox(e), w = b.x1 - b.x0, h = b.y1 - b.y0;
  let s = `<rect x="${f(b.x0)}" y="${f(b.y0)}" width="${f(w)}" height="${f(h)}" rx="5" fill="${th.note.bg}" stroke="${th.note.border}" stroke-width="1.2"/>`;
  let y = b.y0 + 17;
  if (e.title) { s += `<text x="${f(b.x0 + 12)}" y="${f(y)}" font-size="11.5" font-weight="700" fill="${th.ink}">${esc(e.title)}</text>`; y += 17; }
  else y -= 1;
  for (const raw of e.lines || []) {
    const mark = raw.slice(0, 2);
    const tone = mark === '+ ' ? th.tones.good : mark === '- ' ? th.tones.bad : mark === '! ' ? th.tones.warn : null;
    s += `<text x="${f(b.x0 + 12)}" y="${f(y)}" font-size="11.5" fill="${tone ? tone.ink : th.muted}">${esc(raw)}</text>`;
    y += 16;
  }
  return s;
}

const halo = (th) => `paint-order="stroke" stroke="${th.board.top}" stroke-width="3" stroke-linejoin="round"`;

function drawCaption(e, th) {
  if (!e.label || e.kind === 'note' || e.kind === 'zone') return '';
  const c = captionBox(e), muted = e.state === 'ghost' || e.state === 'down';
  let s = `<text x="${f(c.tx)}" y="${f(c.ty)}" text-anchor="${c.anchor}" font-size="12.5" font-weight="600" fill="${muted ? th.muted : th.ink}" ${halo(th)}>${esc(e.label)}</text>`;
  if (e.sub) s += `<text x="${f(c.tx)}" y="${f(c.ty + 14)}" text-anchor="${c.anchor}" font-size="10.5" fill="${th.muted}" ${halo(th)}>${esc(e.sub)}</text>`;
  return s;
}

export function pill(cx, cy, text, th, tone, size = 10.5) {
  const w = textWidth(text, size, 600) + 14, h = size + 8;
  const bg = tone ? tone.bg : th.pill.bg, ink = tone ? tone.ink : th.pill.ink, border = tone ? tone.ink : th.pill.border;
  return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}" fill="${bg}" stroke="${border}" stroke-width="1"/><text x="${f(cx)}" y="${f(cy + size * 0.36)}" text-anchor="middle" font-size="${size}" font-weight="600" fill="${ink}">${esc(text)}</text>`;
}

function drawBadge(e, th) {
  let badge = e.badge;
  if (!badge && e.state === 'down') badge = { text: 'down', tone: 'bad' };
  if (!badge) return '';
  if (typeof badge === 'string') badge = { text: badge, tone: e.state === 'down' ? 'bad' : e.state === 'warn' ? 'warn' : undefined };
  const b = bodyBox(e);
  return pill((b.x0 + b.x1) / 2, b.y0 - 15, badge.text, th, badge.tone ? th.tones[badge.tone] : null);
}

function arrowHead(tip, dx, dy, color) {
  const bx = tip[0] - dx * 8, by = tip[1] - dy * 8, nx = -dy * 4.2, ny = dx * 4.2;
  return `<path d="M${xy(tip)}L${f(bx + nx)},${f(by + ny)}L${f(bx - nx)},${f(by - ny)}Z" fill="${color}" stroke="${color}" stroke-width="1" stroke-linejoin="round"/>`;
}

function drawLink(l, poly, th) {
  const style = l.style || 'solid', arrows = l.arrows || 'end';
  const color = style === 'off' ? th.link.muted : style === 'cut' ? th.tones.bad.ink : th.link.color;
  const width = style === 'off' ? 1.4 : th.link.width;
  const dash = style === 'dashed' ? ' stroke-dasharray="6 5"' : style === 'pulse' ? ' stroke-dasharray="1.5 6"' : style === 'cut' ? ' stroke-dasharray="5 4"' : '';
  const a = pointAt(poly, 0), b = pointAt(poly, 1);
  const pts = poly.slice();
  const withEnd = arrows !== 'none' && style !== 'cut', withStart = arrows === 'both' && style !== 'cut';
  if (withEnd) pts[pts.length - 1] = [b.x - b.dx * 5, b.y - b.dy * 5];
  if (withStart) pts[0] = [a.x + a.dx * 5, a.y + a.dy * 5];
  const line = (p) => `<path class="trace" d="M${p.map(xy).join('L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
  let s = '';
  if (style === 'cut') {
    const total = 24, head = [], tail = [];
    for (let i = 0; i <= total; i++) { const p = pointAt(poly, i / total); (i <= 10 ? head : i >= 14 ? tail : []).push([p.x, p.y]); }
    const mid = pointAt(poly, 0.5);
    s += line(head) + line(tail) + `<path d="M${f(mid.x - 4.5)},${f(mid.y - 4.5)}l9,9M${f(mid.x + 4.5)},${f(mid.y - 4.5)}l-9,9" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>`;
  } else {
    s += line(pts);
    if (withEnd) s += arrowHead([b.x, b.y], b.dx, b.dy, color);
    if (withStart) s += arrowHead([a.x, a.y], -a.dx, -a.dy, color);
  }
  return s;
}

/** A packet token: a small tile lying on the floor. */
export function tokenShape(th, kind) {
  const c = th.packets[kind || 'request'] || th.packets.request;
  return `<path d="M-8,1.5L0,-2.5L8,1.5L0,5.5Z" fill="${th.shadow.color}" opacity=".22"/><path d="M-8,-3L0,-7L8,-3L0,1Z" fill="${c}" stroke="${th.board.top}" stroke-width="1.2" stroke-linejoin="round"/>`;
}

function boardDefs(th) {
  return `<pattern id="lattice" patternUnits="userSpaceOnUse" width="${2 * U}" height="${U}" x="${-1.6}" y="${-1.6}"><circle cx="1.6" cy="1.6" r="1.3" fill="${th.board.dot}"/><circle cx="${U + 1.6}" cy="${U / 2 + 1.6}" r="1.3" fill="${th.board.dot}"/></pattern>`;
}

function drawBoard(layout, th) {
  const b = layout.board, t = 10;
  const N = project(b.gx0, b.gy0), E = project(b.gx1, b.gy0), S = project(b.gx1, b.gy1), W = project(b.gx0, b.gy1);
  const dn = (p) => [p[0], p[1] + t];
  let s = face([W, S, dn(S), dn(W)], th.board.left, th) + face([S, E, dn(E), dn(S)], th.board.right, th) + face([N, E, S, W], th.board.top, th);
  s += `<path d="M${[N, E, S, W].map(xy).join('L')}Z" fill="url(#lattice)"/>`;
  if (th.stroke.width > 0) s += `<path d="M${xy(N)}L${xy(E)}L${xy(dn(E))}L${xy(dn(S))}L${xy(dn(W))}L${xy(W)}Z M${xy(W)}L${xy(S)}L${xy(E)} M${xy(S)}L${xy(dn(S))}" fill="none"${outlineAttrs(th)}/>`;
  return s;
}

function drawHalo(e, th) {
  const m = measure(e), [gx, gy] = e.at, k = 0.3;
  const pts = [project(gx - m.ax - k, gy - m.ay - k), project(gx + m.ax + k, gy - m.ay - k), project(gx + m.ax + k, gy + m.ay + k), project(gx - m.ax - k, gy + m.ay + k)];
  return `<path class="halo" d="M${pts.map(xy).join('L')}Z" fill="${th.focus}" fill-opacity=".16" stroke="${th.focus}" stroke-width="1.6" stroke-linejoin="round"/>`;
}

const DRAW = { node: drawNode, store: drawStore, client: drawClient, actors: drawActors, queue: drawQueue };

/**
 * Everything needed to draw one frame, as keyed pieces. The static renderer joins them;
 * the player diffs them by key so that only what changed is touched.
 */
export function renderParts(scene, theme, frame, layout, opts = {}) {
  const th = theme;
  const focus = new Set(frame.focus);
  const busy = new Set(frame.packets.map((p) => p.on));
  const spot = focus.size > 0;
  const lit = (id) => !spot || focus.has(id);
  const linkLit = (l) => !spot || focus.has(l.id) || busy.has(l.id) || (focus.has(l.from) && focus.has(l.to));
  const wrap = (key, html, on) => ({ key, html: `<g data-key="${key}"${on ? '' : ' opacity=".36"'}>${html}</g>` });

  const floor = [], links = [], solids = [], labels = [], notes = [], paths = {};
  const cast = [...frame.cast.values()].filter((e) => frame.on.has(e.id));
  for (const e of cast) if (e.kind === 'zone') floor.push(wrap('zone:' + e.id, drawZone(e, th), lit(e.id)));
  for (const e of cast) if (e.kind === 'ring') floor.push(wrap('ring:' + e.id, drawRing(e, th), lit(e.id)));
  for (const e of cast) if (focus.has(e.id) && SOLID_KINDS.includes(e.kind)) floor.push(wrap('halo:' + e.id, drawHalo(e, th), true));

  for (const l of frame.links.values()) {
    if (!frame.on.has(l.id)) continue;
    const poly = linkPolyline(l, frame.cast);
    paths[l.id] = poly;
    links.push(wrap('link:' + l.id, drawLink(l, poly, th), linkLit(l)));
    if (l.label) {
      const mid = pointAt(poly, l.labelAt === undefined ? 0.5 : l.labelAt);
      labels.push(wrap('linklabel:' + l.id, pill(mid.x, mid.y - 14, l.label, th, null, 10), linkLit(l)));
    }
  }

  const sorted = cast.filter((e) => DRAW[e.kind]).sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]) || a.at[0] - b.at[0]);
  for (const e of sorted) {
    solids.push(wrap('ent:' + e.id, DRAW[e.kind](e, th), lit(e.id)));
    const cap = drawCaption(e, th) + drawBadge(e, th);
    if (cap) labels.push(wrap('cap:' + e.id, cap, lit(e.id)));
  }
  for (const e of cast) if (e.kind === 'ring' && e.label) labels.push(wrap('cap:' + e.id, drawCaption(e, th), lit(e.id)));
  for (const e of cast) if (e.kind === 'note') notes.push(wrap('note:' + e.id, drawNote(e, th), true));

  const tokens = [];
  if (opts.staticPackets !== false) {
    frame.packets.forEach((p, pi) => {
      const poly = paths[p.on];
      if (!poly) return;
      const n = clamp(p.count || 1, 1, 6);
      let html = '';
      for (let i = 0; i < n; i++) {
        // Forward tokens sit before the midpoint, returning ones after it, so a round trip shows both.
        const t = clamp((p.reverse ? 0.6 : 0.4) + (i - (n - 1) / 2) * 0.13, 0.06, 0.94), pos = pointAt(poly, t);
        html += `<g transform="translate(${f(pos.x)} ${f(pos.y)})">${tokenShape(th, p.kind)}</g>`;
      }
      tokens.push({ key: 'pkt:' + pi, html: `<g data-key="pkt:${pi}">${html}</g>` });
    });
  }
  // Packet labels sit above the solids so a block in front never hides them.
  frame.packets.forEach((p, pi) => {
    const poly = paths[p.on];
    if (!poly || !p.label) return;
    const pos = pointAt(poly, p.reverse ? 0.6 : 0.4);
    labels.push({ key: 'pktlabel:' + pi + ':' + p.label, html: `<g data-key="pktlabel:${pi}">${pill(pos.x, pos.y - 19, p.label, th, null, 10)}</g>` });
  });

  return {
    viewBox: layout.viewBox,
    defs: boardDefs(th),
    paths,
    layers: [
      { name: 'board', items: [{ key: 'board', html: `<g data-key="board">${drawBoard(layout, th)}</g>` }] },
      { name: 'floor', items: floor },
      { name: 'links', items: links },
      { name: 'packets', items: tokens },
      { name: 'solids', items: solids },
      { name: 'labels', items: labels },
      { name: 'notes', items: notes },
    ],
  };
}

/** Packet kinds used anywhere in the scene, in a stable order. */
export function packetKindsUsed(scene) {
  const used = new Set();
  for (const s of scene.steps || []) for (const p of s.packets || []) used.add(p.kind || 'request');
  return PACKET_KINDS.filter((k) => used.has(k));
}

/** A standalone SVG document for one frame. opts: { step, width, caption, legend } */
export function renderSVG(scene, theme, opts = {}) {
  const frames = resolve(scene);
  const index = opts.step === undefined || opts.step === 'last' ? frames.length - 1 : clamp(opts.step, 0, frames.length - 1);
  const frame = frames[index];
  const layout = computeLayout(scene, frames);
  const parts = renderParts(scene, theme, frame, layout);
  let [x, y, w, h] = parts.viewBox;
  const th = theme;
  let extra = '';
  if (opts.caption !== false && (scene.steps || []).length && frame.step.title) {
    y -= 30; h += 30;
    extra += `<text x="${f(x + 22)}" y="${f(y + 30)}" font-size="15" font-weight="700" fill="${th.ink}">${esc(frame.step.title)}</text>`;
    extra += `<text x="${f(x + w - 22)}" y="${f(y + 30)}" text-anchor="end" font-size="11" fill="${th.muted}">${index + 1} of ${frames.length}</text>`;
  }
  const kinds = opts.legend === false ? [] : packetKindsUsed(scene);
  if (kinds.length) {
    h += 26;
    let lx = x + 30;
    for (const k of kinds) {
      extra += `<g transform="translate(${f(lx)} ${f(y + h - 16)})">${tokenShape(th, k)}</g><text x="${f(lx + 13)}" y="${f(y + h - 14)}" font-size="10.5" fill="${th.muted}">${k}</text>`;
      lx += 30 + textWidth(k, 10.5);
    }
  }
  const width = opts.width || Math.round(w * 1.6);
  const body = parts.layers.map((l) => `<g class="layer-${l.name}">${l.items.map((i) => i.html).join('')}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(x)} ${f(y)} ${f(w)} ${f(h)}" width="${width}" height="${Math.round((width * h) / w)}" font-family="${esc(th.font.label)}" role="img" aria-label="${esc(scene.title || 'Isometric diagram')}"><title>${esc(scene.title || 'Isometric diagram')}</title><defs>${parts.defs}</defs><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${th.bg}"/>${body}${extra}</svg>\n`;
}

/** Keys every theme file must define. validateTheme lists what is missing. */
export function validateTheme(th) {
  const missing = [];
  const need = (path) => { let v = th; for (const k of path.split('.')) v = v == null ? undefined : v[k]; if (v === undefined || v === null || v === '') missing.push(path); };
  ['name', 'mode', 'bg', 'ink', 'muted', 'round', 'focus', 'font.label', 'font.page', 'board.top', 'board.left', 'board.right', 'board.dot', 'stroke.color', 'stroke.width', 'shadow.color', 'shadow.opacity', 'link.color', 'link.muted', 'link.width', 'zone.fill', 'pill.bg', 'pill.ink', 'pill.border', 'note.bg', 'note.border', 'screen.bg', 'screen.line', 'page.bg', 'page.ink', 'page.muted', 'page.rule', 'page.accent'].forEach(need);
  for (const h of HUES) for (const k of ['top', 'left', 'right', 'ink']) need(`hues.${h}.${k}`);
  for (const p of PACKET_KINDS) need(`packets.${p}`);
  for (const t of TONES) for (const k of ['bg', 'ink']) need(`tones.${t}.${k}`);
  return missing;
}

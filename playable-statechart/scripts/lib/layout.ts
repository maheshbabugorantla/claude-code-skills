// Lays the chart out with ELK's layered algorithm (compound nodes for composites and regions,
// hierarchy-crossing edges, per-node padding for header bands). Output is plain geometry the
// renderer draws and the HTML never recomputes — same input, same picture.

import ELK from 'elkjs/lib/elk.bundled.js';
import type { Chart } from './types.ts';

export const FONT = { size: 26, charW: 0.47, lineH: 1.25 };
const PAD = { x: 22, y: 14 };
export const HEADER = 38;
const START_R = 10;

export interface Box { x: number; y: number; w: number; h: number }
export interface NodeGeom extends Box { id: string; label: string; lines: string[]; kind: 'leaf' | 'composite' | 'start' | 'region'; parent: string | null }
export interface EdgeGeom {
  id: string;
  from: string;
  to: string;
  points: Array<{ x: number; y: number }>;
  label: { x: number; y: number; w: number; h: number; lines: string[] } | null;
  kind: 'transition' | 'start';
}
export interface Divider { x1: number; y1: number; x2: number; y2: number }
export interface Layout {
  width: number;
  height: number;
  nodes: NodeGeom[];
  edges: EdgeGeom[];
  dividers: Divider[];
}

export function measure(text: string, size = FONT.size, maxChars = 22): { lines: string[]; w: number; h: number } {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return { lines, w: longest * size * FONT.charW, h: lines.length * size * FONT.lineH };
}

type ElkLabel = { text: string; width: number; height: number; x?: number; y?: number };
type ElkEdge = { id: string; sources: string[]; targets: string[]; labels?: ElkLabel[]; layoutOptions?: Record<string, string>; container?: string; sections?: Array<{ startPoint: { x: number; y: number }; endPoint: { x: number; y: number }; bendPoints?: Array<{ x: number; y: number }> }> };
type ElkNode = { id: string; width?: number; height?: number; x?: number; y?: number; children?: ElkNode[]; edges?: ElkEdge[]; layoutOptions?: Record<string, string> };

const DIR: Record<Chart['direction'], string> = { LR: 'RIGHT', RL: 'LEFT', TB: 'DOWN', BT: 'UP' };

export async function layoutChart(chart: Chart): Promise<Layout> {
  const elk = new ELK();
  const starts: Array<{ id: string; parent: string | null }> = [];
  const regionIds = new Map<string, string>(); // `${composite}__r${i}` → composite
  // With INCLUDE_CHILDREN every edge can live at the root; ELK re-homes it to the right container.
  const rootEdges: ElkEdge[] = [];

  const leafNode = (id: string, label: string): ElkNode => {
    const m = measure(label);
    return { id, width: m.w + PAD.x * 2, height: m.h + PAD.y * 2 };
  };
  const startNode = (parent: string | null, target: string): ElkNode => {
    const id = `__start_${starts.length}`;
    starts.push({ id, parent });
    rootEdges.push({ id, sources: [id], targets: [target] });
    return { id, width: START_R * 2, height: START_R * 2 };
  };
  const padding = (top: number) => `[top=${top},left=16,bottom=16,right=16]`;

  const build = (id: string): ElkNode => {
    const s = chart.states[id];
    if (s.kind === 'leaf') return leafNode(id, s.label);
    const node: ElkNode = { id, children: [], layoutOptions: { 'elk.padding': padding(HEADER + 14) } };
    if (s.regions.length > 1) {
      // Regions: one compound per region. With no edges between them ELK puts them in one layer,
      // which stacks them across the flow axis — the divider goes between.
      s.regions.forEach((group, i) => {
        const single = group.length === 1 && chart.states[group[0]].kind === 'composite';
        if (single) { node.children!.push(build(group[0])); return; }
        const rid = `${id}__r${i}`;
        regionIds.set(rid, id);
        const region: ElkNode = { id: rid, children: [], layoutOptions: { 'elk.padding': padding(16) } };
        const init = s.initials[i];
        if (init && chart.states[init].kind === 'leaf') region.children!.push(startNode(rid, init));
        for (const m of group) region.children!.push(build(m));
        node.children!.push(region);
      });
      return node;
    }
    const init = s.initials[0];
    if (init && chart.states[init].kind === 'leaf') node.children!.push(startNode(id, init));
    for (const c of s.children) node.children!.push(build(c));
    return node;
  };

  const root: ElkNode = {
    id: '__root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': DIR[chart.direction],
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.edgeRouting': 'POLYLINE',
      'elk.spacing.nodeNode': '44',
      'elk.spacing.edgeNode': '28',
      'elk.spacing.edgeEdge': '18',
      'elk.spacing.edgeLabel': '8',
      'elk.layered.spacing.nodeNodeBetweenLayers': '84',
      'elk.layered.spacing.edgeNodeBetweenLayers': '34',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '22',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
      'elk.edgeLabels.inline': 'false',
      'elk.layered.edgeLabels.sideSelection': 'ALWAYS_UP',
      'elk.padding': '[top=12,left=12,bottom=12,right=12]',
    },
    children: [],
    edges: rootEdges,
  };
  for (const id of chart.initial) if (chart.states[id].kind === 'leaf') root.children!.push(startNode(null, id));
  for (const id of chart.roots) root.children!.push(build(id));
  // Declaration order is the author's reading order: an arrow to a later-declared state should
  // point with the flow, an arrow back to an earlier one is the loop. Cycle breaking honours this.
  const order = Object.keys(chart.states);
  for (const t of chart.transitions) {
    const m = t.label ? measure(t.label, FONT.size * 0.8, 26) : null;
    const forward = order.indexOf(t.to) >= order.indexOf(t.from);
    rootEdges.push({
      id: t.id,
      sources: [t.from],
      targets: [t.to],
      labels: m ? [{ text: t.label, width: m.w + 8, height: m.h + 4 }] : undefined,
      layoutOptions: { 'elk.layered.priority.direction': forward ? '10' : '0' },
    });
  }

  const out = (await elk.layout(root as any)) as ElkNode;

  // Flatten to absolute coordinates.
  const nodes: NodeGeom[] = [];
  const abs = new Map<string, { x: number; y: number }>();
  abs.set('__root', { x: 0, y: 0 });
  const walk = (n: ElkNode, ox: number, oy: number, parent: string | null) => {
    for (const c of n.children ?? []) {
      const x = ox + (c.x ?? 0), y = oy + (c.y ?? 0);
      abs.set(c.id, { x, y });
      const st = chart.states[c.id];
      const box = { x, y, w: c.width ?? 0, h: c.height ?? 0 };
      if (st?.kind === 'composite') nodes.push({ id: c.id, label: st.label, lines: [st.label], kind: 'composite', parent, ...box });
      else if (st) nodes.push({ id: c.id, label: st.label, lines: measure(st.label).lines, kind: 'leaf', parent, ...box });
      else if (c.id.startsWith('__start_')) nodes.push({ id: c.id, label: '', lines: [], kind: 'start', parent, ...box });
      else if (regionIds.has(c.id)) nodes.push({ id: c.id, label: '', lines: [], kind: 'region', parent, ...box });
      walk(c, x, y, st ? c.id : regionIds.has(c.id) ? regionIds.get(c.id)! : parent);
    }
  };
  walk(out, 0, 0, null);

  const edges: EdgeGeom[] = [];
  const collect = (n: ElkNode) => {
    for (const e of n.edges ?? []) {
      const base = abs.get(e.container ?? n.id) ?? { x: 0, y: 0 };
      const sec = e.sections?.[0];
      if (!sec) continue;
      const points = [sec.startPoint, ...(sec.bendPoints ?? []), sec.endPoint].map((p) => ({ x: p.x + base.x, y: p.y + base.y }));
      const t = chart.transitions.find((x) => x.id === e.id);
      const lbl = e.labels?.[0];
      edges.push({
        id: e.id,
        from: t ? t.from : e.sources[0],
        to: t ? t.to : e.targets[0],
        points,
        label: t && lbl && lbl.x !== undefined
          ? { x: lbl.x + base.x + lbl.width / 2, y: (lbl.y ?? 0) + base.y + lbl.height / 2, w: lbl.width, h: lbl.height, lines: measure(t.label, FONT.size * 0.8, 26).lines }
          : null,
        kind: e.id.startsWith('__start_') ? 'start' : 'transition',
      });
    }
    for (const c of n.children ?? []) collect(c);
  };
  collect(out);

  // Dividers between adjacent regions of a parallel state.
  const dividers: Divider[] = [];
  for (const s of Object.values(chart.states)) {
    if (s.regions.length < 2) continue;
    const parentBox = nodes.find((n) => n.id === s.id)!;
    const boxes = s.regions.map((group, i) => {
      const single = group.length === 1 && chart.states[group[0]].kind === 'composite';
      return nodes.find((n) => n.id === (single ? group[0] : `${s.id}__r${i}`))!;
    });
    const vertical = chart.direction === 'LR' || chart.direction === 'RL';
    const sorted = [...boxes].sort((a, b) => (vertical ? a.y - b.y : a.x - b.x));
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i], b = sorted[i + 1];
      if (vertical) { const y = (a.y + a.h + b.y) / 2; dividers.push({ x1: parentBox.x + 10, y1: y, x2: parentBox.x + parentBox.w - 10, y2: y }); }
      else { const x = (a.x + a.w + b.x) / 2; dividers.push({ x1: x, y1: parentBox.y + HEADER + 6, x2: x, y2: parentBox.y + parentBox.h - 10 }); }
    }
  }

  return { width: out.width ?? 0, height: out.height ?? 0, nodes, edges, dividers };
}

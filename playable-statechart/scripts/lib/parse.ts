// Parses the subset of Mermaid `stateDiagram-v2` that pstack's /statechart emits, plus a
// pstack `report.md`. Hand-written charts in the same subset work too; see references/mermaid-subset.md.

import type { Chart, Direction, Guard, Report, StateNode, Transition } from './types.ts';

const LEGEND_ID = 'legend';

export class ParseError extends Error {
  line: number;
  constructor(message: string, line: number) {
    super(`line ${line}: ${message}`);
    this.line = line;
  }
}

function stripFrontmatter(src: string): { body: string; title: string | null; offset: number } {
  const lines = src.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { body: src, title: null, offset: 0 };
  let end = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === '---') { end = i; break; }
  if (end === -1) throw new ParseError('unterminated frontmatter', 1);
  let title: string | null = null;
  for (const l of lines.slice(1, end)) {
    const m = /^\s*title:\s*(.+?)\s*$/.exec(l);
    if (m) title = m[1].replace(/^["']|["']$/g, '');
  }
  return { body: lines.slice(end + 1).join('\n'), title, offset: end + 1 };
}

export function splitGuard(label: string): { text: string; guard: Guard | null } {
  const m = /^(.*?)\s*\[([^\]]+)\]\s*$/.exec(label);
  if (!m) return { text: label.trim(), guard: null };
  const text = m[1].trim();
  const inner = m[2].trim();
  const g = /^(when|while|if|unless)\s+(.+)$/i.exec(inner);
  if (!g) return { text, guard: { kind: 'other', text: inner } };
  const kw = g[1].toLowerCase();
  return { text, guard: { kind: kw === 'unless' ? 'unless' : 'when', text: g[2].trim() } };
}

function unquote(s: string): string {
  return s.trim().replace(/^"(.*)"$/, '$1');
}

export function parseChart(src: string): Chart {
  const { body, title, offset } = stripFrontmatter(src);
  const chart: Chart = {
    title,
    direction: 'TB',
    states: {},
    roots: [],
    initial: [],
    finals: [],
    transitions: [],
    legend: [],
    classDefs: {},
  };

  // Block stack: null = top level, otherwise the composite id. Each frame tracks the region
  // currently being filled so `--` can start a new one.
  const stack: Array<{ id: string | null; regionIdx: number }> = [{ id: null, regionIdx: 0 }];
  const top = () => stack[stack.length - 1];
  const inLegend = () => stack.some((f) => f.id === LEGEND_ID);
  let tcount = 0;
  let inNote = false;

  const ensure = (id: string, lineNo: number, label?: string): StateNode => {
    if (id === '[*]') throw new ParseError('[*] cannot be declared', lineNo);
    let s = chart.states[id];
    if (!s) {
      const parent = top().id;
      s = { id, label: label ?? id, kind: 'leaf', parent, children: [], regions: [[]], initials: [null], classes: [] };
      chart.states[id] = s;
      if (parent === null) chart.roots.push(id);
      else {
        const p = chart.states[parent];
        p.children.push(id);
        p.regions[top().regionIdx].push(id);
      }
    } else if (label !== undefined) {
      s.label = label;
    }
    return s;
  };

  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const lineNo = offset + i + 1;
    const raw = lines[i];
    const line = raw.replace(/%%.*$/, '').trim();
    if (!line) continue;
    if (inNote) { if (/^end note$/i.test(line)) inNote = false; continue; }
    if (/^note\b/i.test(line)) { if (!/:/.test(line)) inNote = true; continue; }
    if (/^stateDiagram(-v2)?$/.test(line)) continue;

    let m: RegExpExecArray | null;

    if ((m = /^direction\s+(LR|TB|RL|BT)$/.exec(line))) {
      if (top().id === null) chart.direction = m[1] as Direction;
      continue;
    }
    if ((m = /^classDef\s+(\S+)\s+(.+)$/.exec(line))) { chart.classDefs[m[1]] = m[2]; continue; }
    if ((m = /^class\s+(\S+)\s+(\S+)$/.exec(line))) {
      for (const id of m[1].split(',')) {
        const le = chart.legend.find((l) => l.id === id);
        if (le) le.classes.push(m[2]);
        else if (chart.states[id]) chart.states[id].classes.push(m[2]);
        else throw new ParseError(`class on unknown state ${id}`, lineNo);
      }
      continue;
    }
    if (line === '}') {
      if (stack.length === 1) throw new ParseError('unmatched }', lineNo);
      stack.pop();
      continue;
    }
    if (line === '--') {
      const f = top();
      if (f.id === null) throw new ParseError('-- outside a state block', lineNo);
      chart.states[f.id].regions.push([]);
      chart.states[f.id].initials.push(null);
      f.regionIdx++;
      continue;
    }
    // state "label" as id {   |  state "label" as id  |  state id {
    if ((m = /^state\s+(?:"([^"]*)"\s+as\s+)?(\S+?)\s*(\{)?$/.exec(line))) {
      const [, label, id, open] = m;
      if (id === LEGEND_ID && top().id === null) {
        if (!open) throw new ParseError('legend must be a block', lineNo);
        stack.push({ id: LEGEND_ID, regionIdx: 0 });
        continue;
      }
      if (inLegend()) throw new ParseError('nested state inside legend', lineNo);
      const s = ensure(id, lineNo, label !== undefined ? label : undefined);
      if (open) { s.kind = 'composite'; stack.push({ id, regionIdx: 0 }); }
      continue;
    }
    // a --> b: label  |  [*] --> a  |  a --> [*]
    if ((m = /^(\S+)\s*-->\s*(\S+?)\s*(?::\s*(.*))?$/.exec(line))) {
      const [, from, to, label = ''] = m;
      if (inLegend()) throw new ParseError('transition inside legend', lineNo);
      if (from === '[*]' && to === '[*]') throw new ParseError('[*] --> [*]', lineNo);
      if (from === '[*]') {
        const s = ensure(to, lineNo);
        const f = top();
        if (f.id === null) chart.initial.push(s.id);
        else chart.states[f.id].initials[f.regionIdx] = s.id;
        continue;
      }
      if (to === '[*]') {
        ensure(from, lineNo);
        if (top().id === null) chart.finals.push(from);
        continue;
      }
      ensure(from, lineNo);
      ensure(to, lineNo);
      const { text, guard } = splitGuard(label);
      const t: Transition = { id: `t${tcount++}`, from, to, label: label.trim(), text, guard, classes: [] };
      chart.transitions.push(t);
      continue;
    }
    // id: label
    if ((m = /^(\S+?)\s*:\s*(.+)$/.exec(line))) {
      const [, id, label] = m;
      if (inLegend()) { chart.legend.push({ id, label: unquote(label), classes: [] }); continue; }
      ensure(id, lineNo, unquote(label));
      continue;
    }
    throw new ParseError(`cannot parse: ${raw.trim()}`, lineNo);
  }
  if (stack.length !== 1) throw new ParseError('unclosed state block', offset + lines.length);

  // A region with no [*] enters its first child.
  for (const s of Object.values(chart.states)) {
    if (s.kind !== 'composite') continue;
    s.regions.forEach((group, i) => { if (s.initials[i] === null && group.length) s.initials[i] = group[0]; });
  }
  if (chart.initial.length === 0 && chart.roots.length) chart.initial.push(chart.roots[0]);
  return chart;
}

// ---------------------------------------------------------------- report.md

export function parseReport(src: string): Report {
  const report: Report = { summary: null, bugs: [], holds: [], notChecked: [] };
  const lines = src.split(/\r?\n/);
  let section: 'none' | 'bug' | 'holds' | 'notChecked' = 'none';
  let bug: { rule: string; steps: Array<{ step: string | null; state: string }> } | null = null;
  const summary: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    let m: RegExpExecArray | null;
    if ((m = /^##\s+(.+?)\s+breaks$/.exec(line))) {
      bug = { rule: m[1], steps: [] };
      report.bugs.push(bug);
      section = 'bug';
      continue;
    }
    if (/^##\s+Rules that hold/i.test(line)) { section = 'holds'; continue; }
    if (/^##\s+Rules not checked/i.test(line)) { section = 'notChecked'; continue; }
    if (/^#\s/.test(line)) { section = 'none'; continue; }
    if (!line) continue;
    if (section === 'bug' && bug && (m = /^(\d+)\.\s+(.*)$/.exec(line))) {
      const n = Number(m[1]);
      const rest = m[2];
      if (n === 0) bug.steps.push({ step: null, state: rest.trim() });
      else {
        // "step label [guard]: state label" — split on the last ": " so labels may contain colons.
        const idx = rest.lastIndexOf(': ');
        if (idx === -1) bug.steps.push({ step: rest.trim(), state: '' });
        else bug.steps.push({ step: rest.slice(0, idx).trim(), state: rest.slice(idx + 2).trim() });
      }
      continue;
    }
    if (section === 'holds') report.holds.push(...line.split(',').map((s) => s.trim()).filter(Boolean));
    else if (section === 'notChecked') report.notChecked.push(...line.split(',').map((s) => s.trim()).filter(Boolean));
    else if (section === 'none') summary.push(line);
  }
  report.summary = summary.length ? summary.join(' ') : null;
  return report;
}

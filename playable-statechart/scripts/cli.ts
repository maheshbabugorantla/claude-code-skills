#!/usr/bin/env node
// playable-statechart CLI.
//
//   node cli.ts render <chart.mmd> [--report report.md] [--out DIR] [--name SLUG] [--title T]
//                      [--subtitle S] [--png] [--svg] [--seed N]
//
// Writes <out>/<name>.html (always), <name>.svg (--svg), <name>.png (--png, needs Playwright).

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { parseChart, parseReport } from './lib/parse.ts';
import { layoutChart } from './lib/layout.ts';
import { renderFrameSvg } from './lib/render.ts';
import { buildHtml } from './lib/html.ts';
import { resolveBugPath } from './runtime/play.mjs';
import { exportPng } from './lib/png.ts';

interface Args { cmd: string; chart?: string; report?: string; out: string; name?: string; title?: string; subtitle?: string; png: boolean; svg: boolean; seed: number; help: boolean }

function parseArgs(argv: string[]): Args {
  const a: Args = { cmd: argv[0] ?? 'help', out: 'img', png: false, svg: false, seed: 11, help: false };
  for (let i = 1; i < argv.length; i++) {
    const x = argv[i];
    const next = () => { const v = argv[++i]; if (v === undefined) throw new Error(`${x} needs a value`); return v; };
    if (x === '--report') a.report = next();
    else if (x === '--out') a.out = next();
    else if (x === '--name') a.name = next();
    else if (x === '--title') a.title = next();
    else if (x === '--subtitle') a.subtitle = next();
    else if (x === '--seed') a.seed = Number(next());
    else if (x === '--png') a.png = true;
    else if (x === '--svg') a.svg = true;
    else if (x === '-h' || x === '--help') a.help = true;
    else if (x.startsWith('-')) throw new Error(`unknown flag ${x}`);
    else if (!a.chart) a.chart = x;
    else throw new Error(`unexpected argument ${x}`);
  }
  return a;
}

const USAGE = `usage: playable-statechart render <chart.mmd> [--report report.md] [--out DIR] [--name SLUG]
                                  [--title T] [--subtitle S] [--png] [--svg] [--seed N]

  chart.mmd   Mermaid stateDiagram-v2 (the subset pstack's /statechart writes; see references/mermaid-subset.md)
  --report    pstack report.md; enables bug-path replay and the "checked by TLC" footer
  --out       output directory (default: img)
  --name      file stem (default: chart file stem)
  --png       also write <name>.png at 1920x1080 via Playwright
  --svg       also write the plate as <name>.svg
`;

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'chart';
}

export async function main(argv: string[]): Promise<number> {
  let a: Args;
  try { a = parseArgs(argv); } catch (e) { console.error(String((e as Error).message)); console.error(USAGE); return 2; }
  if (a.help || a.cmd === 'help') { console.log(USAGE); return 0; }
  if (a.cmd !== 'render' || !a.chart) { console.error(USAGE); return 2; }
  if (!existsSync(a.chart)) { console.error(`no such file: ${a.chart}`); return 2; }

  const chart = parseChart(readFileSync(a.chart, 'utf8'));
  const report = a.report ? parseReport(readFileSync(a.report, 'utf8')) : null;
  const bugEdgeIds = report?.bugs.length ? (resolveBugPath(chart, report.bugs[0]).filter(Boolean) as string[]) : [];
  const L = await layoutChart(chart);
  const title = a.title ?? chart.title ?? '';
  const plate = renderFrameSvg(chart, L, { report, bugEdgeIds, title, subtitle: a.subtitle ?? null, seed: a.seed });
  const name = a.name ?? slugify(basename(a.chart).replace(/\.mmd$/, ''));
  mkdirSync(a.out, { recursive: true });
  const htmlPath = join(a.out, `${name}.html`);
  writeFileSync(htmlPath, buildHtml({ title: title || name, plateSvg: plate, chart, report, generatedBy: 'playable-statechart' }));
  const written = [htmlPath];
  if (a.svg) { const p = join(a.out, `${name}.svg`); writeFileSync(p, plate); written.push(p); }
  if (a.png) {
    const p = join(a.out, `${name}.png`);
    try { await exportPng(resolve(htmlPath), p); written.push(p); } catch (e) { console.error((e as Error).message); return 3; }
  }
  const unresolved = report?.bugs.length ? resolveBugPath(chart, report.bugs[0]).filter((x) => x === null).length : 0;
  console.log(written.map((p) => `wrote ${p}`).join('\n'));
  console.log(`${Object.keys(chart.states).length} states, ${chart.transitions.length} transitions, ${chart.direction}` + (report ? `, ${report.bugs.length} bug path${report.bugs.length === 1 ? '' : 's'}` : ', unchecked'));
  if (unresolved) console.error(`warning: ${unresolved} bug-path step(s) did not match a chart transition; replay will skip them`);
  return 0;
}

if (import.meta.url === new URL(process.argv[1], 'file://').href || process.argv[1]?.endsWith('cli.ts')) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}

// Assembles the single-file HTML: plate SVG + chart JSON + report JSON + inlined runtime.

import { readFileSync } from 'node:fs';
import type { Chart, Report } from './types.ts';
import { FONT_FAMILY, fontFace } from './render.ts';

function inlineModule(name: string): string {
  const src = readFileSync(new URL(`../runtime/${name}`, import.meta.url), 'utf8');
  // Strip ESM surface so the file runs as a classic script; keep everything else verbatim.
  return src.replace(/^export\s+/gm, '').replace(/^import\s.*$/gm, '').replace(/^\/\*\*\s*@typedef.*$/gm, '');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** JSON inside a <script> must not be able to close it. */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, (c) => '\\u' + c.charCodeAt(0).toString(16));

export interface HtmlOptions {
  title: string;
  plateSvg: string;
  chart: Chart;
  report: Report | null;
  /** Hide the controls (used for PNG export). Can also be forced at view time with `?static`. */
  staticOnly?: boolean;
  generatedBy?: string;
}

export function buildHtml(o: HtmlOptions): string {
  const replays = (o.report?.bugs ?? []).map((b, i) => `<button type="button" class="ctl replay" data-replay="${i}">replay: ${esc(b.rule)} breaks</button>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(o.title)}</title>
<meta name="generator" content="${esc(o.generatedBy ?? 'playable-statechart')}">
<style>
${fontFace()}
:root{color-scheme:light}
html,body{margin:0;background:#f4f1ea;font-family:${FONT_FAMILY};color:#222}
main{max-width:1920px;margin:0 auto;padding:16px}
.plate-wrap{background:#fff;box-shadow:0 2px 14px rgba(0,0,0,.08);border-radius:6px;overflow:hidden}
svg.plate{display:block;width:100%;height:auto}
#controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:14px 4px}
button.ctl,button.step{font:inherit;font-size:20px;padding:6px 14px;border:2px solid #222;border-radius:14px 10px 16px 9px / 10px 15px 9px 14px;background:#fff;cursor:pointer}
button.ctl:disabled{opacity:.4;cursor:default}
button.step{background:#A8D8EA}
button.replay{background:#FFB7B2}
#caption{flex-basis:100%;font-size:22px;color:#333;padding:2px 4px}
#steps{display:flex;flex-wrap:wrap;gap:8px;flex-basis:100%}
.help{flex-basis:100%;font-size:16px;color:#666}
.static #controls{display:none}
.sr{position:absolute;left:-9999px}
@media print{html,body{background:#fff}#controls{display:none}}
</style>
</head>
<body class="${o.staticOnly ? 'static' : ''}">
<main id="app">
<div class="plate-wrap">
${o.plateSvg}
</div>
<div id="controls">
  <div id="caption">start</div>
  <div id="steps"></div>
  <button type="button" class="ctl" id="undo">undo</button>
  <button type="button" class="ctl" id="reset">reset</button>
  <button type="button" class="ctl" id="auto">auto-walk</button>
  ${replays}
  <div class="help">tap an arrow or a numbered step · keys: 1–9 step, Backspace undo, R reset, Space auto-walk</div>
</div>
<div id="live" class="sr" aria-live="polite"></div>
<script type="application/json" id="chart-data">${jsonForScript(o.chart)}</script>
${o.report ? `<script type="application/json" id="report-data">${jsonForScript(o.report)}</script>` : ''}
<script>
${inlineModule('play.mjs')}
${inlineModule('ui.mjs')}
if (new URLSearchParams(location.search).has('static')) document.body.classList.add('static');
if (!document.body.classList.contains('static')) document.body.classList.add('playing');
window.playable = mountPlayable(document.getElementById('app'));
</script>
</main>
</body>
</html>
`;
}

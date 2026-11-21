#!/usr/bin/env node
// iso: validate, explain, render and build isometric explainer scenes. Node 18+, no dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import * as engine from '../engine/engine.mjs';
import { coverPrompt, coverRequest, extractImage, COVER_MODEL } from '../engine/cover.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME_DIR = path.join(ROOT, 'themes');

const HELP = `iso <command> <scene.json> [options]

Commands
  validate   Check the spec. Exit 1 on errors. Warnings name the ids to move or shorten.
  explain    Print what each step resolves to: on stage, entering, persisting, per-step.
  render     Write a static SVG.            --step <n|last|all>  --png  --width <px>
  build      Write a self-contained lesson.html with the step player.
  cover      Write cover-prompt.md, and cover.jpg when GEMINI_API_KEY is set.
             --aspect 16:9  --size 2K  --reference <png>  --prompt-only  --no-title  --model <id>
  themes     List the bundled themes.

Options
  --theme <name|path.json>   Overrides the scene's "theme". Default: daylight.
  --out <path>               Output file (or directory for --step all).
  --no-caption  --no-legend  Leave the step title or packet legend off a static SVG.
`;

function parseArgs(argv) {
  const flags = {}, pos = [];
  const bool = new Set(['png', 'prompt-only', 'no-caption', 'no-legend', 'no-title', 'help']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const [k, v] = a.slice(2).split('=');
    if (bool.has(k)) flags[k] = true;
    else if (v !== undefined) flags[k] = v;
    else flags[k] = argv[++i];
  }
  return { flags, pos };
}

function die(msg) { process.stderr.write(msg + '\n'); process.exit(1); }

export function themeNames() {
  return fs.readdirSync(THEME_DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
}

export function loadTheme(ref) {
  const name = ref || 'daylight';
  const file = name.endsWith('.json') || name.includes(path.sep) ? path.resolve(name) : path.join(THEME_DIR, name + '.json');
  if (!fs.existsSync(file)) die(`theme not found: ${name}\nbundled themes: ${themeNames().join(', ')}`);
  const theme = JSON.parse(fs.readFileSync(file, 'utf8'));
  const missing = engine.validateTheme(theme);
  if (missing.length) die(`theme ${name} is missing tokens: ${missing.join(', ')}`);
  return theme;
}

function loadScene(file) {
  if (!file) die(HELP);
  if (!fs.existsSync(file)) die(`scene not found: ${file}`);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { die(`${file} is not valid JSON: ${e.message}`); }
}

function report(scene) {
  const { errors, warnings } = engine.validate(scene, themeNames());
  for (const w of warnings) process.stderr.write(`warning  ${w}\n`);
  for (const e of errors) process.stderr.write(`error    ${e}\n`);
  return { errors, warnings };
}

function has(cmd) {
  try { execFileSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' }); return true; } catch { return false; }
}

/** Rasterise with whatever is installed. Returns the tool used, or null. */
export function toPng(svgFile, pngFile, width) {
  const tries = [
    ['rsvg-convert', ['-w', String(width), svgFile, '-o', pngFile]],
    ['resvg', ['-w', String(width), svgFile, pngFile]],
    ['magick', ['-background', 'none', '-density', '192', svgFile, '-resize', `${width}x`, pngFile]],
    ['inkscape', [svgFile, '--export-type=png', `--export-filename=${pngFile}`, `--export-width=${width}`]],
  ];
  for (const [cmd, args] of tries) {
    if (!has(cmd)) continue;
    try { execFileSync(cmd, args, { stdio: 'ignore' }); if (fs.existsSync(pngFile)) return cmd; } catch { /* try the next tool */ }
  }
  return null;
}

/** Inline engine + player + theme + scene into one HTML file that needs no network. */
export function buildHTML(scene, theme) {
  const strip = (src) => src.replace(/^import .*$/gm, '').replace(/^export\s+/gm, '');
  const engineSrc = strip(fs.readFileSync(path.join(ROOT, 'engine', 'engine.mjs'), 'utf8'));
  const playerSrc = strip(fs.readFileSync(path.join(ROOT, 'engine', 'player.mjs'), 'utf8'));
  const css = fs.readFileSync(path.join(ROOT, 'engine', 'player.css'), 'utf8');
  const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
  const title = String(scene.title || 'Explainer').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${css}
</style>
</head>
<body>
<main id="lesson"></main>
<script type="application/json" id="scene-data">${json(scene)}</script>
<script type="application/json" id="theme-data">${json(theme)}</script>
<script type="module">
${engineSrc}
${playerSrc}
mountLesson(document.getElementById('lesson'), JSON.parse(document.getElementById('scene-data').textContent), JSON.parse(document.getElementById('theme-data').textContent));
</script>
</body>
</html>
`;
}

async function main() {
  const { flags, pos } = parseArgs(process.argv.slice(2));
  const [command, sceneFile] = pos;
  if (!command || flags.help || command === 'help') { process.stdout.write(HELP); return; }
  if (command === 'themes') { process.stdout.write(themeNames().join('\n') + '\n'); return; }
  if (!['validate', 'explain', 'render', 'build', 'cover'].includes(command)) die(`unknown command "${command}"\n\n${HELP}`);

  const scene = loadScene(sceneFile);
  const dir = path.dirname(path.resolve(sceneFile));
  const { errors, warnings } = report(scene);
  if (command === 'validate') {
    process.stdout.write(errors.length ? `${errors.length} error(s), ${warnings.length} warning(s)\n` : `ok, ${warnings.length} warning(s)\n`);
    process.exit(errors.length ? 1 : 0);
  }
  if (errors.length) die('fix the errors above first');
  if (command === 'explain') { process.stdout.write(engine.explain(scene) + '\n'); return; }

  const theme = loadTheme(flags.theme || scene.theme);
  const width = flags.width ? Number(flags.width) : undefined;

  if (command === 'render') {
    const count = engine.resolve(scene).length;
    const opts = { width, caption: !flags['no-caption'], legend: !flags['no-legend'] };
    const write = (file, step) => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, engine.renderSVG(scene, theme, { ...opts, step }));
      process.stdout.write(`wrote ${path.relative(process.cwd(), file)}\n`);
      if (flags.png) {
        const png = file.replace(/\.svg$/, '.png');
        const tool = toPng(file, png, width || 1600);
        process.stdout.write(tool ? `wrote ${path.relative(process.cwd(), png)} (${tool})\n` : 'no rasteriser found (rsvg-convert, resvg, magick, inkscape); the SVG is the output\n');
      }
    };
    if (flags.step === 'all') {
      const outDir = flags.out ? path.resolve(flags.out) : path.join(dir, 'steps');
      for (let i = 0; i < count; i++) write(path.join(outDir, `step-${String(i + 1).padStart(2, '0')}.svg`), i);
    } else {
      const step = flags.step === undefined || flags.step === 'last' ? 'last' : Number(flags.step) - 1;
      if (step !== 'last' && !(step >= 0 && step < count)) die(`--step must be 1 to ${count}, "last" or "all"`);
      write(flags.out ? path.resolve(flags.out) : path.join(dir, 'still.svg'), step);
    }
    return;
  }

  if (command === 'build') {
    const out = flags.out ? path.resolve(flags.out) : path.join(dir, 'lesson.html');
    fs.writeFileSync(out, buildHTML(scene, theme));
    process.stdout.write(`wrote ${path.relative(process.cwd(), out)} (${Math.round(fs.statSync(out).size / 1024)} KB, no network needed)\n`);
    return;
  }

  if (command === 'cover') {
    const prompt = coverPrompt(scene, theme, { aspect: flags.aspect, title: !flags['no-title'] });
    const promptFile = path.join(dir, 'cover-prompt.md');
    fs.writeFileSync(promptFile, prompt + '\n');
    process.stdout.write(`wrote ${path.relative(process.cwd(), promptFile)}\n`);
    const key = process.env.GEMINI_API_KEY;
    if (flags['prompt-only'] || !key) {
      process.stdout.write(key ? '' : `GEMINI_API_KEY is not set: paste the prompt into an image model, or set the key and rerun (model ${flags.model || COVER_MODEL}).\n`);
      return;
    }
    let reference;
    if (flags.reference) reference = { mime: 'image/png', base64: fs.readFileSync(path.resolve(flags.reference)).toString('base64') };
    const req = coverRequest(prompt, key, { aspect: flags.aspect, size: flags.size, model: flags.model, reference });
    const res = await fetch(req.url, req.init);
    const text = await res.text();
    if (!res.ok) die(`image request failed: HTTP ${res.status}\n${text.slice(0, 600)}`);
    const image = extractImage(JSON.parse(text));
    if (!image) die('the response held no image; the prompt is in cover-prompt.md');
    const out = flags.out ? path.resolve(flags.out) : path.join(dir, image.mime.includes('png') ? 'cover.png' : 'cover.jpg');
    fs.writeFileSync(out, Buffer.from(image.base64, 'base64'));
    process.stdout.write(`wrote ${path.relative(process.cwd(), out)}\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => die(e.stack || String(e)));
}

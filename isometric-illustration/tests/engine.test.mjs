import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import * as E from '../engine/engine.mjs';
import { coverPrompt, coverRequest, extractImage, COVER_MODEL } from '../engine/cover.mjs';
import { buildHTML, loadTheme, themeNames } from '../bin/iso.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'bin', 'iso.mjs');
const example = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'references', 'examples', name), 'utf8'));
const clone = (v) => JSON.parse(JSON.stringify(v));

const base = () => ({
  version: 1,
  title: 'Two services',
  cast: [
    { id: 'a', kind: 'node', at: [0, 0], label: 'A' },
    { id: 'b', kind: 'node', at: [3, 0], label: 'B' },
    { id: 'c', kind: 'store', at: [3, 3], label: 'C' },
  ],
  links: [
    { id: 'a-b', from: 'a', to: 'b' },
    { id: 'b-c', from: 'b', to: 'c' },
  ],
  steps: [
    { title: 'Start', packets: [{ on: 'a-b' }], gauges: { load: { label: 'Load', value: '10%' } } },
    { title: 'Add the store', show: ['c'], focus: ['c'], set: { b: { state: 'warn', badge: 'hot' } } },
    { title: 'Settle', gauges: { load: { value: '40%' } } },
    { title: 'Remove', hide: ['c'], set: { b: { state: 'ok', badge: null } }, gauges: { load: null } },
  ],
});

/** Minimal XML well-formedness check: every tag opened is closed, in order. */
function wellFormed(xml) {
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|[^>"])*?)(\/?)>/g;
  let m;
  while ((m = re.exec(xml))) {
    const [, close, name, , selfClose] = m;
    if (selfClose) continue;
    if (close) { if (stack.pop() !== name) return false; } else stack.push(name);
  }
  return stack.length === 0;
}

test('projection is 2:1: one cell along gx moves right U and down U/2', () => {
  assert.deepEqual(E.project(0, 0), [0, 0]);
  assert.deepEqual(E.project(1, 0), [E.U, E.U / 2]);
  assert.deepEqual(E.project(0, 1), [-E.U, E.U / 2]);
  assert.deepEqual(E.project(1, 1, 10), [0, E.U - 10]);
});

test('state is cumulative, motion is per-step', () => {
  const fr = E.resolve(base());
  assert.equal(fr.length, 4);
  // "c" is named in a show list, so it is hidden until that step. Its link follows it.
  assert.ok(!fr[0].on.has('c') && !fr[0].on.has('b-c'));
  assert.ok(fr[1].on.has('c') && fr[1].on.has('b-c'));
  assert.deepEqual(fr[1].entered.sort(), ['b-c', 'c']);
  // set persists into the next step...
  assert.equal(fr[2].cast.get('b').state, 'warn');
  assert.equal(fr[2].cast.get('b').badge, 'hot');
  // ...until a later set changes it.
  assert.equal(fr[3].cast.get('b').state, 'ok');
  assert.equal(fr[3].cast.get('b').badge, null);
  // gauges merge and persist; null removes.
  assert.deepEqual(fr[1].gauges.load, { label: 'Load', value: '10%' });
  assert.deepEqual(fr[2].gauges.load, { label: 'Load', value: '40%' });
  assert.equal(fr[3].gauges.load, undefined);
  // focus and packets belong to their own step only.
  assert.deepEqual(fr[2].focus, []);
  assert.deepEqual(fr[1].packets, []);
  // hide removes, and reports what left.
  assert.deepEqual(fr[3].left.sort(), ['b-c', 'c']);
});

test('resolving does not mutate the scene', () => {
  const scene = base(), before = JSON.stringify(scene);
  E.resolve(scene); E.validate(scene); E.renderSVG(scene, loadTheme('daylight'));
  assert.equal(JSON.stringify(scene), before);
});

test('a scene without steps is one frame with everything on stage', () => {
  const scene = base(); delete scene.steps;
  const fr = E.resolve(scene);
  assert.equal(fr.length, 1);
  assert.equal(fr[0].on.size, 5);
});

test('routes follow the lattice', () => {
  const a = { at: [0, 0] }, b = { at: [4, 2] };
  assert.deepEqual(E.routeGrid(a, b), [[0, 0], [4, 0], [4, 2]]);
  assert.deepEqual(E.routeGrid(a, b, 'y'), [[0, 0], [0, 2], [4, 2]]);
  assert.deepEqual(E.routeGrid(a, b, 'xyx'), [[0, 0], [2, 0], [2, 2], [4, 2]]);
  assert.deepEqual(E.routeGrid(a, b, 'xyx', 0.25), [[0, 0], [1, 0], [1, 2], [4, 2]]);
  assert.deepEqual(E.routeGrid(a, b, 'yxy'), [[0, 0], [0, 1], [4, 1], [4, 2]]);
  assert.deepEqual(E.routeGrid(a, b, 'straight'), [[0, 0], [4, 2]]);
  assert.deepEqual(E.routeGrid(a, { at: [4, 0] }, 'xyx'), [[0, 0], [4, 0]]);
});

test('a link stops at the silhouette: further back when it arrives from behind', () => {
  const cast = new Map([
    ['a', { id: 'a', kind: 'node', at: [0, 0] }],
    ['b', { id: 'b', kind: 'node', at: [4, 0], size: 'l' }],
  ]);
  const fwd = E.linkPolyline({ from: 'a', to: 'b' }, cast);
  const back = E.linkPolyline({ from: 'b', to: 'a' }, cast);
  const gapAtB = (p) => Math.hypot(p[0] - E.project(4, 0)[0], p[1] - E.project(4, 0)[1]);
  const m = E.measure(cast.get('b'));
  // Arriving at b from lower gx: must clear the body height, not just the footprint.
  assert.ok(gapAtB(fwd[fwd.length - 1]) > gapAtB(back[0]) - 1e-9);
  assert.ok(gapAtB(fwd[fwd.length - 1]) >= Math.hypot(m.ax * E.U, (m.ax * E.U) / 2));
});

test('pointAt walks a polyline by length', () => {
  const poly = [[0, 0], [10, 0], [10, 10]];
  assert.deepEqual([E.pointAt(poly, 0).x, E.pointAt(poly, 0).y], [0, 0]);
  assert.deepEqual([E.pointAt(poly, 0.5).x, E.pointAt(poly, 0.5).y], [10, 0]);
  assert.deepEqual([E.pointAt(poly, 0.75).x, E.pointAt(poly, 0.75).y], [10, 5]);
  assert.deepEqual([E.pointAt(poly, 1).x, E.pointAt(poly, 1).y], [10, 10]);
});

test('validate accepts a clean scene', () => {
  const r = E.validate(base(), themeNames());
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
});

test('validate reports structural errors by id', () => {
  const cases = [
    [(s) => { s.version = 2; }, /version/],
    [(s) => { s.cast[1].id = 'a'; }, /duplicate id "a"/],
    [(s) => { s.cast[0].kind = 'cube'; }, /unknown kind "cube"/],
    [(s) => { s.cast[0].hue = 'pink'; }, /unknown hue "pink"/],
    [(s) => { s.cast[0].icon = 'unicorn'; }, /unknown icon "unicorn"/],
    [(s) => { s.cast[0].at = [1]; }, /"at" must be/],
    [(s) => { s.cast[0].id = 'Bad_Id'; }, /lowercase/],
    [(s) => { s.links[0].to = 'zz'; }, /"to" names "zz"/],
    [(s) => { s.links[0].via = 'diag'; }, /via must be/],
    [(s) => { s.links[0].bend = 2; }, /bend must be/],
    [(s) => { s.steps[0].tag = 'intro'; }, /unknown tag "intro"/],
    [(s) => { s.steps[0].packets = [{ on: 'nope' }]; }, /unknown link "nope"/],
    [(s) => { s.steps[1].show = ['ghost']; }, /show names unknown id "ghost"/],
    [(s) => { s.steps[1].set = { b: { kind: 'store' } }; }, /may not change id, kind/],
    [(s) => { delete s.steps[2].title; }, /step 3: missing title/],
    [(s) => { s.theme = 'neon'; }, /unknown theme "neon"/],
  ];
  for (const [mutate, pattern] of cases) {
    const scene = base();
    mutate(scene);
    const r = E.validate(scene, themeNames());
    assert.ok(r.errors.some((e) => pattern.test(e)), `expected ${pattern} in ${JSON.stringify(r.errors)}`);
  }
});

test('validate is a layout critic: each warning names what to move', () => {
  const close = base(); close.cast[1].at = [1.2, 0];
  assert.ok(E.validate(close).warnings.some((w) => /"a" and "b" are too close/.test(w)));

  const under = base();
  under.cast.push({ id: 'mid', kind: 'node', at: [1.5, 0], label: 'Mid' });
  under.cast[1].at = [5, 0];
  under.links = [{ id: 'a-b', from: 'a', to: 'b' }];
  assert.ok(E.validate(under).warnings.some((w) => /link "a-b" runs under "mid"/.test(w)));

  const covered = base(); covered.cast[2].at = [1.3, 1.6];
  assert.ok(E.validate(covered).warnings.some((w) => /caption of "a" is covered by "c".*labelSide/.test(w)));

  const idle = base(); idle.steps.splice(2, 0, { title: 'Nothing happens' });
  assert.ok(E.validate(idle).warnings.some((w) => /step 3: nothing changes on stage/.test(w)));

  const unused = base(); unused.steps.push({ title: 'Never', show: [] }); unused.cast.push({ id: 'd', kind: 'node', at: [9, 9] });
  unused.steps[0].hide = ['d'];
  assert.ok(E.validate(unused).warnings.some((w) => /"d" is never on stage/.test(w)));

  const stub = base(); stub.cast[1] = { id: 'b', kind: 'node', size: 'l', at: [2.3, 0], label: 'B' };
  assert.ok(E.validate(stub).warnings.some((w) => /cells of link "a-b" show between "a" and "b"; move them at least/.test(w)));

  const wide = base(); wide.cast[1].at = [16, 0];
  assert.ok(E.validate(wide).warnings.some((w) => /labels get small on a phone/.test(w)));
});

test('a warning that holds across steps is reported once, with the step range', () => {
  const scene = base();
  scene.cast.push({ id: 'd', kind: 'node', at: [0.9, 0], label: 'D' });
  const hits = E.validate(scene).warnings.filter((w) => /"a" and "d" are too close/.test(w));
  assert.equal(hits.length, 1);
  assert.match(hits[0], /^steps 1-4:/);
});

test('explain shows what persists and what does not', () => {
  const text = E.explain(base());
  assert.match(text, /STEP 2 {2}Add the store/);
  assert.match(text, /enters {3}: c, b-c|enters {3}: b-c, c/);
  assert.match(text, /STEP 3[\s\S]*persists : b\(state=warn badge="hot"\)/);
  assert.match(text, /focus {4}: c {2}\(this step only\)/);
});

test('every bundled theme defines every token', () => {
  assert.deepEqual(themeNames(), ['blueprint', 'daylight', 'print']);
  for (const name of themeNames()) assert.deepEqual(E.validateTheme(loadTheme(name)), [], name);
  assert.ok(E.validateTheme({ name: 'x' }).includes('hues.blue.top'));
});

test('renderSVG is well-formed, numeric and escaped in every theme and step', () => {
  const scene = example('every-kind.scene.json');
  scene.cast[0].label = 'R&D <team> "x"';
  for (const name of themeNames()) {
    const svg = E.renderSVG(scene, loadTheme(name));
    assert.ok(wellFormed(svg), `${name}: not well-formed`);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), `${name}: bad number or missing token`);
    assert.ok(svg.includes('R&amp;D &lt;team&gt; &quot;x&quot;'), `${name}: label not escaped`);
    for (const e of scene.cast) assert.ok(svg.includes(`data-key="${e.kind === 'zone' ? 'zone' : e.kind === 'ring' ? 'ring' : e.kind === 'note' ? 'note' : 'ent'}:${e.id}"`), `${name}: missing ${e.id}`);
  }
  const gw = example('llm-gateway.scene.json');
  const boxes = new Set();
  for (let i = 0; i < gw.steps.length; i++) {
    const svg = E.renderSVG(gw, loadTheme('daylight'), { step: i, caption: false, legend: false });
    assert.ok(wellFormed(svg) && !/NaN|undefined/.test(svg), `step ${i + 1}`);
    boxes.add(svg.match(/viewBox="([^"]+)"/)[1]);
  }
  assert.equal(boxes.size, 1, 'the stage must not move between steps');
});

test('focus dims what is outside it, and only for that step', () => {
  const scene = base(), th = loadTheme('daylight');
  const dimmed = (i) => (E.renderSVG(scene, th, { step: i }).match(/data-key="ent:a" opacity/g) || []).length;
  assert.equal(dimmed(1), 1);
  assert.equal(dimmed(2), 0);
});

test('the shipped examples stay clean: no errors, no warnings', () => {
  for (const file of fs.readdirSync(path.join(ROOT, 'references', 'examples')).filter((f) => f.endsWith('.scene.json'))) {
    const r = E.validate(example(file), themeNames());
    assert.deepEqual(r.errors, [], file);
    // every-kind is a specimen sheet of all eight kinds, wider than a lesson should be. That is its one allowed warning.
    const allowed = file === 'every-kind.scene.json' ? r.warnings.filter((w) => !/labels get small on a phone/.test(w)) : r.warnings;
    assert.deepEqual(allowed, [], file);
  }
});

test('lesson.html is self-contained and safe to embed text in', () => {
  const scene = example('llm-gateway.scene.json');
  scene.title = 'Gateways </script><script>alert(1)</script>';
  const html = buildHTML(scene, loadTheme('blueprint'));
  assert.ok(!/^(export|import)\s/m.test(html), 'module syntax left in the inlined script');
  assert.ok(!/(src|href)\s*=\s*["']https?:/i.test(html), 'external resource');
  assert.ok(!/@import|url\(\s*["']?https?:/i.test(html), 'external stylesheet or font');
  assert.equal((html.match(/<\/script>/g) || []).length, 3, 'scene text closed a script tag');
  assert.ok(html.includes('mountLesson('));
  const embedded = html.match(/<script type="application\/json" id="scene-data">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(embedded).steps.length, 10);
});

test('cover prompt carries the title and only theme colours', () => {
  const scene = example('llm-gateway.scene.json'), th = loadTheme('daylight');
  const prompt = coverPrompt(scene, th, { aspect: '16:9' });
  assert.ok(prompt.includes(scene.title));
  assert.ok(prompt.includes(th.bg) && prompt.includes(th.board.top) && prompt.includes(th.hues.blue.left));
  assert.ok(/16:9/.test(prompt));
  assert.ok(/no outlines/.test(prompt));
  assert.ok(/line-work/.test(coverPrompt(scene, loadTheme('blueprint'))));
  assert.ok(/Text: none/.test(coverPrompt(scene, th, { title: false })));
});

test('cover request matches the documented Interactions API shape', () => {
  const req = coverRequest('a prompt', 'KEY', { aspect: '1:1', size: '1K' });
  assert.equal(req.url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
  assert.equal(req.init.headers['x-goog-api-key'], 'KEY');
  const body = JSON.parse(req.init.body);
  assert.equal(body.model, COVER_MODEL);
  assert.equal(COVER_MODEL, 'gemini-3-pro-image');
  assert.deepEqual(body.input, [{ type: 'text', text: 'a prompt' }]);
  assert.deepEqual(body.response_format, { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '1:1', image_size: '1K' });
  const withRef = JSON.parse(coverRequest('p', 'K', { reference: { mime: 'image/png', base64: 'AAAA' } }).init.body);
  assert.deepEqual(withRef.input[1], { type: 'image', mime_type: 'image/png', data: 'AAAA' });
  assert.throws(() => coverRequest('p', 'K', { aspect: '7:3' }), /aspect must be/);
  assert.throws(() => coverRequest('p', 'K', { size: '8K' }), /size must be/);
});

test('extractImage finds the last image block however it is nested', () => {
  const data = 'A'.repeat(400);
  assert.deepEqual(extractImage({ steps: [{ type: 'model_output', content: [{ type: 'text', text: 'x' }, { type: 'image', mime_type: 'image/jpeg', data }] }] }), { mime: 'image/jpeg', base64: data });
  assert.deepEqual(extractImage({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data } }] } }] }), { mime: 'image/png', base64: data });
  assert.equal(extractImage({ steps: [{ content: [{ type: 'text', text: 'no image' }] }] }), null);
});

test('CLI: validate exits 0 on a clean scene and 1 on a broken one', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iso-'));
  const good = path.join(dir, 'scene.json'), bad = path.join(dir, 'bad.json');
  fs.writeFileSync(good, JSON.stringify(base()));
  const broken = base(); broken.links[0].to = 'missing';
  fs.writeFileSync(bad, JSON.stringify(broken));
  assert.match(execFileSync('node', [CLI, 'validate', good], { encoding: 'utf8' }), /^ok, 0 warning/);
  const r = spawnSync('node', [CLI, 'validate', bad], { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /error {4}a-b: "to" names "missing"/);
});

test('CLI: render and build write next to the scene; cover falls back to a prompt without a key', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iso-'));
  const file = path.join(dir, 'scene.json');
  fs.writeFileSync(file, JSON.stringify(base()));
  const env = { ...process.env }; delete env.GEMINI_API_KEY;
  execFileSync('node', [CLI, 'render', file], { env });
  execFileSync('node', [CLI, 'render', file, '--step', 'all', '--theme', 'print'], { env });
  execFileSync('node', [CLI, 'build', file, '--theme', 'blueprint'], { env });
  const out = execFileSync('node', [CLI, 'cover', file], { env, encoding: 'utf8' });
  assert.ok(fs.readFileSync(path.join(dir, 'still.svg'), 'utf8').startsWith('<svg'));
  assert.deepEqual(fs.readdirSync(path.join(dir, 'steps')).sort(), ['step-01.svg', 'step-02.svg', 'step-03.svg', 'step-04.svg']);
  assert.ok(fs.readFileSync(path.join(dir, 'lesson.html'), 'utf8').includes('"name":"blueprint"'));
  assert.ok(fs.existsSync(path.join(dir, 'cover-prompt.md')) && !fs.existsSync(path.join(dir, 'cover.jpg')));
  assert.match(out, /GEMINI_API_KEY is not set/);
  assert.equal(spawnSync('node', [CLI, 'render', file, '--step', '9'], { env }).status, 1);
});

const WRITER = path.resolve(ROOT, '..', 'technical-explainer');

test('both skills ship the same lesson format', { skip: !fs.existsSync(WRITER) }, () => {
  const mine = fs.readFileSync(path.join(ROOT, 'references', 'lesson-format.md'), 'utf8');
  const theirs = fs.readFileSync(path.join(WRITER, 'references', 'lesson-format.md'), 'utf8');
  assert.equal(mine, theirs);
});

test('the worked lesson and the worked scene tell the same story', { skip: !fs.existsSync(WRITER) }, () => {
  const lesson = fs.readFileSync(path.join(WRITER, 'references', 'examples', 'llm-gateway.lesson.md'), 'utf8');
  const scene = example('llm-gateway.scene.json');
  const front = Object.fromEntries(lesson.split('---')[1].trim().split('\n').map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]));
  assert.equal(front.format, 'technical-explainer/v1');
  assert.equal(front.title, scene.title);
  const titles = [...lesson.matchAll(/^### \d+\. (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(titles, scene.steps.map((s) => s.title));
  const tags = [...lesson.matchAll(/^- tag: (\w+)$/gm)].map((m) => m[1]);
  assert.deepEqual(tags, scene.steps.map((s) => s.tag));
  const section = (name) => lesson.split(`## ${name}`)[1].split('\n## ')[0];
  const rows = (name) => section(name).split('\n').filter((l) => /^\| [a-z]/.test(l) && !/^\| id /.test(l)).map((l) => l.split('|').map((c) => c.trim()));
  const castById = new Map(scene.cast.map((c) => [c.id, c]));
  for (const [, id, name, , kind] of rows('Cast')) {
    assert.ok(castById.has(id), `cast id ${id} missing from scene`);
    assert.equal(castById.get(id).kind, kind, `kind of ${id}`);
    assert.equal(castById.get(id).label || castById.get(id).title, name, `name of ${id}`);
  }
  assert.equal(rows('Cast').length, scene.cast.length);
  const gaugeIds = new Set(scene.steps.flatMap((s) => Object.keys(s.gauges || {})));
  assert.deepEqual(rows('Gauges').map((r) => r[1]).sort(), [...gaugeIds].sort());
  // Body text is the writer's: the scene must carry it word for word.
  for (const step of scene.steps) for (const para of step.body) assert.ok(lesson.includes(para), `scene step "${step.title}" body differs from the lesson`);
  for (const step of scene.steps) if (step.idea) assert.ok(lesson.includes('> ' + step.idea), `idea of "${step.title}"`);
});

test('SKILL.md frontmatter uses only Agent Skills fields, and every file it points to exists', () => {
  for (const dir of [ROOT, WRITER].filter((d) => fs.existsSync(d))) {
    const text = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
    const front = text.split('---')[1];
    const keys = [...front.matchAll(/^([a-z-]+):/gm)].map((m) => m[1]);
    for (const k of keys) assert.ok(['name', 'description', 'compatibility', 'metadata', 'license'].includes(k), `${path.basename(dir)}: unexpected frontmatter key ${k}`);
    assert.equal(front.match(/^name: (.+)$/m)[1], path.basename(dir));
    const description = front.match(/^description: (.+)$/m)[1];
    assert.ok(description.length <= 1024 && !description.includes(': '), 'description must be a plain one-line YAML scalar');
    assert.ok(!/[<>]/.test(description), 'no angle brackets in a description: some skill validators reject them');
    for (const [, target] of text.matchAll(/\]\((references\/[^)]+)\)/g)) assert.ok(fs.existsSync(path.join(dir, target)), `${path.basename(dir)}: broken link ${target}`);
  }
});

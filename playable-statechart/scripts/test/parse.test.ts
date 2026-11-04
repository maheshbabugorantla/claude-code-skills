import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseChart, parseReport, splitGuard, ParseError } from '../lib/parse.ts';

const EX = new URL('../../references/examples/', import.meta.url);
const read = (name: string) => readFileSync(new URL(name, EX), 'utf8');

test('splitGuard parses when/unless/other', () => {
  assert.deepEqual(splitGuard('a new batch [when barista free]'), { text: 'a new batch', guard: { kind: 'when', text: 'barista free' } });
  assert.deepEqual(splitGuard('an order comes in [unless cooking pearls]'), { text: 'an order comes in', guard: { kind: 'unless', text: 'cooking pearls' } });
  assert.deepEqual(splitGuard('a request is served [during a burst]'), { text: 'a request is served', guard: { kind: 'other', text: 'during a burst' } });
  assert.deepEqual(splitGuard('plain'), { text: 'plain', guard: null });
});

test('flat chart with legend, classes and frontmatter title', () => {
  const c = parseChart(read('stale-token-bug.mmd'));
  assert.equal(c.title, 'the stale token bug');
  assert.deepEqual(c.roots, ['s0', 's1', 's2', 's3', 's4', 's5']);
  assert.deepEqual(c.initial, ['s0']);
  assert.equal(c.states.s5.label, 'an expired token is served');
  assert.deepEqual(c.states.s5.classes, ['breaks', 'bugPath']);
  assert.equal(c.legend.length, 2);
  assert.deepEqual(c.legend[0].classes, ['breaks']);
  assert.equal(c.transitions.length, 8);
  const served = c.transitions.find((t) => t.to === 's5')!;
  assert.equal(served.text, 'a request is served');
  assert.equal(served.guard?.kind, 'other');
  assert.ok(c.classDefs.breaks.includes('#e72e3b'));
});

test('parent state: nested block, region initial, direction', () => {
  const c = parseChart(read('k8s-pod.mmd'));
  assert.equal(c.direction, 'LR');
  const running = c.states.running;
  assert.equal(running.kind, 'composite');
  assert.deepEqual(running.children, ['init', 'ready', 'notready']);
  assert.deepEqual(running.initials, ['init']);
  assert.equal(c.states.ready.parent, 'running');
});

test('parallel regions split children by --', () => {
  const c = parseChart(read('reconcile-regions.mmd'));
  const all = c.states.all;
  assert.equal(all.regions.length, 2);
  assert.deepEqual(all.regions[0], ['election']);
  assert.deepEqual(all.regions[1], ['loop']);
  assert.deepEqual(c.states.election.initials, ['follower']);
  assert.deepEqual(c.states.loop.initials, ['idle']);
});

test('rejects unknown syntax with a line number', () => {
  assert.throws(() => parseChart('stateDiagram-v2\n  a --> b\n  @@@\n'), (e: unknown) => e instanceof ParseError && /line 3/.test((e as Error).message));
  assert.throws(() => parseChart('stateDiagram-v2\n  state x {\n  a --> b\n'), /unclosed/);
});

test('report.md: bug path, holds', () => {
  const r = parseReport(read('stale-token-bug-report.md'));
  assert.equal(r.bugs.length, 1);
  assert.equal(r.bugs[0].rule, 'NeverServeExpiredToken');
  assert.equal(r.bugs[0].steps.length, 7);
  assert.deepEqual(r.bugs[0].steps[0], { step: null, state: 'freshly issued' });
  assert.deepEqual(r.bugs[0].steps[6], { step: 'a request is served [during a burst]', state: 'an expired token is served' });
  assert.deepEqual(r.holds, ['TypeOK', 'NoDeadlock']);
  assert.ok(r.summary?.includes('36 states'));
});

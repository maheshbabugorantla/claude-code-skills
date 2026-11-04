import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseChart, parseReport } from '../lib/parse.ts';
import { initialConfig, enabled, fire, resolveBugPath, activeLabels, isDone } from '../runtime/play.mjs';

const EX = new URL('../../references/examples/', import.meta.url);
const read = (name: string) => readFileSync(new URL(name, EX), 'utf8');
const byText = (ts: any[], text: string) => ts.find((t) => t.text === text);

test('flat: initial, enabled, fire, done', () => {
  const c = parseChart(read('airflow-task.mmd'));
  let cfg = initialConfig(c);
  assert.deepEqual(cfg, ['s0']);
  assert.deepEqual(enabled(c, cfg).map((t) => t.text), ['the scheduler finds a slot']);
  cfg = fire(c, cfg, enabled(c, cfg)[0]);
  cfg = fire(c, cfg, enabled(c, cfg)[0]);
  assert.deepEqual(cfg, ['s2']);
  // Guards with no matching label: `while retries remain` → when-guard, no active label matches → disabled;
  // `unless retries remain` → enabled. Honest about what the chart can and cannot evaluate.
  const en = enabled(c, cfg).map((t) => t.text);
  assert.deepEqual(en, ['the task returns', 'the task raises']);
  cfg = fire(c, cfg, byText(enabled(c, cfg), 'the task returns'));
  assert.deepEqual(cfg, ['s3']);
  assert.equal(isDone(c, cfg), true);
});

test('parent state: entering descends to the initial child; leaving exits the whole subtree', () => {
  const c = parseChart(read('k8s-pod.mmd'));
  let cfg = initialConfig(c);
  assert.deepEqual(cfg, ['pending']);
  cfg = fire(c, cfg, byText(enabled(c, cfg), 'scheduled and images pulled'));
  assert.deepEqual(cfg, ['init']);
  assert.ok(activeLabels(c, cfg).includes('running'));
  cfg = fire(c, cfg, byText(enabled(c, cfg), 'all containers up'));
  assert.deepEqual(cfg, ['ready']);
  // Transition declared on the parent is enabled while any child is active.
  const out = byText(enabled(c, cfg), 'every container exits 0');
  assert.ok(out);
  cfg = fire(c, cfg, out);
  assert.deepEqual(cfg, ['succeeded']);
});

test('parallel regions: both regions active; when-guard reads the other region', () => {
  const c = parseChart(read('reconcile-regions.mmd'));
  let cfg = initialConfig(c);
  assert.deepEqual(cfg, ['follower', 'idle']);
  // Not leader yet → the loop cannot start.
  assert.deepEqual(enabled(c, cfg).map((t) => t.text), ['the lease is won']);
  cfg = fire(c, cfg, enabled(c, cfg)[0]);
  assert.deepEqual(cfg, ['leader', 'idle']);
  assert.ok(byText(enabled(c, cfg), 'an event arrives'));
  cfg = fire(c, cfg, byText(enabled(c, cfg), 'an event arrives'));
  assert.deepEqual(cfg, ['leader', 'reconciling']);
  // Firing in one region leaves the other untouched.
  cfg = fire(c, cfg, byText(enabled(c, cfg), 'the lease is lost'));
  assert.deepEqual(cfg, ['follower', 'reconciling']);
});

test('self-transition keeps the state', () => {
  const c = parseChart(read('stale-token-bug.mmd'));
  let cfg = initialConfig(c);
  cfg = fire(c, cfg, enabled(c, cfg)[0]); // → valid
  const self = enabled(c, cfg).find((t) => t.from === 's1' && t.to === 's1');
  assert.ok(self);
  assert.deepEqual(fire(c, cfg, self), ['s1']);
});

test('bug path from report resolves to a transition per step', () => {
  const c = parseChart(read('stale-token-bug.mmd'));
  const r = parseReport(read('stale-token-bug-report.md'));
  const ids = resolveBugPath(c, r.bugs[0]);
  assert.equal(ids.length, 6);
  assert.ok(ids.every((id) => id !== null), `unresolved steps: ${JSON.stringify(ids)}`);
  // Replaying lands on the breaking state.
  let cfg = initialConfig(c);
  for (const id of ids) cfg = fire(c, cfg, c.transitions.find((t) => t.id === id)!);
  assert.deepEqual(cfg, ['s5']);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseChart, parseReport } from '../lib/parse.ts';
import { layoutChart } from '../lib/layout.ts';
import { renderFrameSvg, FRAME } from '../lib/render.ts';
import { buildHtml } from '../lib/html.ts';
import { resolveBugPath } from '../runtime/play.mjs';

const EX = new URL('../../references/examples/', import.meta.url);
const read = (name: string) => readFileSync(new URL(name, EX), 'utf8');
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

test('layout: every state gets a box inside the frame and inside its parent', async () => {
  for (const f of ['airflow-task', 'k8s-pod', 'reconcile-regions', 'stale-token-bug']) {
    const c = parseChart(read(`${f}.mmd`));
    const L = await layoutChart(c);
    for (const id of Object.keys(c.states)) {
      const n = L.nodes.find((x) => x.id === id);
      assert.ok(n, `${f}: ${id} laid out`);
      assert.ok(n.w > 0 && n.h > 0);
      if (n.parent) {
        const p = L.nodes.find((x) => x.id === n.parent)!;
        assert.ok(n.x >= p.x && n.y >= p.y && n.x + n.w <= p.x + p.w + 0.5 && n.y + n.h <= p.y + p.h + 0.5, `${f}: ${id} inside ${p.id}`);
      }
    }
    assert.equal(L.edges.filter((e) => e.kind === 'transition').length, c.transitions.length);
    for (const e of L.edges) assert.ok(e.points.length >= 2, `${f}: edge ${e.id} has a route`);
  }
});

test('layout is deterministic', async () => {
  const c = parseChart(read('k8s-pod.mmd'));
  const a = JSON.stringify(await layoutChart(c));
  const b = JSON.stringify(await layoutChart(parseChart(read('k8s-pod.mmd'))));
  assert.equal(a, b);
});

test('declaration order drives flow direction', async () => {
  const c = parseChart(read('reconcile-regions.mmd'));
  const L = await layoutChart(c);
  const x = (id: string) => L.nodes.find((n) => n.id === id)!.x;
  assert.ok(x('follower') < x('leader'));
  assert.ok(x('idle') < x('reconciling') && x('reconciling') < x('requeued'));
  assert.equal(L.dividers.length, 1);
});

test('plate svg: one group per state and transition, legend, footer', async () => {
  const c = parseChart(read('stale-token-bug.mmd'));
  const r = parseReport(read('stale-token-bug-report.md'));
  const L = await layoutChart(c);
  const bugEdgeIds = resolveBugPath(c, r.bugs[0]).filter(Boolean) as string[];
  const svg = renderFrameSvg(c, L, { report: r, bugEdgeIds });
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes(`viewBox="0 0 ${FRAME.w} ${FRAME.h}"`));
  assert.equal(count(svg, /class="state leaf/g), 6);
  assert.equal(count(svg, /class="edge transition/g), 8);
  assert.equal(count(svg, /bugEdge/g), 6);
  assert.ok(svg.includes('class="state leaf breaks bugPath" data-id="s5"'));
  assert.ok(svg.includes('checked by TLC'));
  assert.ok(svg.includes('Path to the NeverServeExpiredToken bug'));
  assert.ok(!/NaN|undefined/.test(svg), 'no NaN/undefined in geometry');
});

test('unchecked chart carries the sketch footer', async () => {
  const c = parseChart(read('airflow-task.mmd'));
  const svg = renderFrameSvg(c, await layoutChart(c));
  assert.ok(svg.includes('a sketch, not a checked model'));
  assert.ok(!svg.includes('checked by TLC'));
});

test('html: self-contained, runtime inlined without ESM syntax, JSON cannot close the script', async () => {
  const c = parseChart(read('k8s-pod.mmd'));
  c.states.pending.label = 'pending </script><b>x</b>';
  const L = await layoutChart(c);
  const html = buildHtml({ title: 't', plateSvg: renderFrameSvg(c, L), chart: c, report: null });
  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(!/^\s*export\s/m.test(html.split('<script>')[1]));
  assert.ok(!/^\s*import\s/m.test(html.split('<script>')[1]));
  assert.ok(html.includes('function mountPlayable'));
  assert.ok(html.includes('function fire'));
  assert.ok(!html.includes('</script><b>'), 'label escaped inside JSON');
  assert.ok(!html.includes('<link') && !html.includes('src="http'), 'no external requests');
  assert.ok(html.includes("font-family:'Patrick Hand'"));
});

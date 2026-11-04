// Statechart execution semantics. Pure functions over the parsed Chart JSON.
// Plain ESM on purpose: Node tests import it, and render inlines it verbatim into the HTML
// (with `export ` stripped). Keep it dependency-free and DOM-free.

/** @typedef {import('../lib/types.ts').Chart} Chart */

/** Root-to-node ancestor path, inclusive of `id`. */
export function pathTo(chart, id) {
  const out = [];
  let cur = id;
  while (cur !== null && cur !== undefined) {
    out.unshift(cur);
    cur = chart.states[cur].parent;
  }
  return out;
}

export function isDescendantOrSelf(chart, id, ancestor) {
  return pathTo(chart, id).includes(ancestor);
}

/** Leaf ids made active by entering `id` (descends initials; enters every region of a parallel state). */
export function enter(chart, id) {
  const s = chart.states[id];
  if (!s || s.kind === 'leaf') return [id];
  const out = [];
  s.regions.forEach((group, i) => {
    const init = s.initials[i] ?? group[0];
    if (init !== undefined && init !== null) out.push(...enter(chart, init));
  });
  return out.length ? out : [id];
}

export function initialConfig(chart) {
  return chart.initial.flatMap((id) => enter(chart, id));
}

/** Active ids including ancestors of active leaves. */
export function activeSet(chart, config) {
  const set = new Set();
  for (const leaf of config) for (const id of pathTo(chart, leaf)) set.add(id);
  return set;
}

export function activeLabels(chart, config) {
  return [...activeSet(chart, config)].map((id) => chart.states[id].label);
}

/**
 * A `when`/`unless` guard names a state in the reader's words. Match exactly against any active
 * label first; otherwise as a whole phrase inside an active *leaf* label. Composite labels are
 * excluded from the loose match so "[when leader]" does not match a region titled "leader election".
 */
export function guardHolds(chart, config, guard) {
  if (!guard || guard.kind === 'other') return true;
  const needle = guard.text.toLowerCase().trim();
  const all = activeLabels(chart, config).map((l) => l.toLowerCase());
  let hit = all.includes(needle);
  if (!hit) {
    const re = new RegExp(`(^|\\W)${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`);
    hit = config.some((leaf) => re.test(chart.states[leaf].label.toLowerCase()));
  }
  return guard.kind === 'when' ? hit : !hit;
}

/** Transitions that can fire from `config`. */
export function enabled(chart, config) {
  const active = activeSet(chart, config);
  return chart.transitions.filter((t) => active.has(t.from) && guardHolds(chart, config, t.guard));
}

/** External-transition semantics: exit the branch under the LCA that holds `from`, enter `to`. */
export function fire(chart, config, t) {
  const fromPath = pathTo(chart, t.from);
  const toPath = pathTo(chart, t.to);
  // Shared prefix of proper ancestors of `from`. Capped below `from` itself so a self-transition
  // or a transition into a descendant still exits `from` (external semantics).
  let k = 0;
  while (k < fromPath.length - 1 && k < toPath.length && fromPath[k] === toPath[k]) k++;
  const lca = k > 0 ? fromPath[k - 1] : null;
  const exitRoot = fromPath[k];
  const next = config.filter((leaf) => !isDescendantOrSelf(chart, leaf, exitRoot));

  // Enter along the path below the LCA. A parallel ancestor on that path brings in its other
  // regions' initials too.
  const start = lca === null ? 0 : toPath.indexOf(lca) + 1;
  for (let i = start; i < toPath.length - 1; i++) {
    const node = chart.states[toPath[i]];
    const child = toPath[i + 1];
    if (node.regions.length > 1) {
      node.regions.forEach((group, r) => {
        if (group.includes(child)) return;
        const init = node.initials[r] ?? group[0];
        if (init !== undefined && init !== null) next.push(...enter(chart, init));
      });
    }
  }
  next.push(...enter(chart, t.to));
  // Keep declaration order stable so repeated runs render identically.
  const order = Object.keys(chart.states);
  return [...new Set(next)].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/** A leaf is "final" when it, or an ancestor, has `--> [*]` at the top level or no outgoing transitions at all. */
export function isDone(chart, config) {
  return enabled(chart, config).length === 0;
}

/**
 * Resolve a pstack bug path against the chart: for each step, pick the enabled transition whose
 * text matches the step label and whose target label matches the reported state. Returns the
 * transition ids, with null where no match was found.
 */
export function resolveBugPath(chart, bug) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  let config = initialConfig(chart);
  const out = [];
  for (const step of bug.steps.slice(1)) {
    const want = norm(step.step ?? '');
    const wantState = norm(step.state ?? '');
    const cands = enabled(chart, config).filter((t) => norm(t.label) === want || norm(t.text) === want);
    let pick = cands.find((t) => wantState && norm(chart.states[t.to].label) === wantState) ?? null;
    if (!pick && cands.length === 1) pick = cands[0];
    if (!pick) {
      // Loose fallback: any enabled transition into a state with the reported label.
      pick = enabled(chart, config).find((t) => wantState && norm(chart.states[t.to].label) === wantState) ?? null;
    }
    out.push(pick ? pick.id : null);
    if (pick) config = fire(chart, config, pick);
  }
  return out;
}

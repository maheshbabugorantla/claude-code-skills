// DOM wiring for the playable HTML. Inlined after play.mjs, so its functions are in scope.
// No framework, no network: the page is the artifact.

export function mountPlayable(root) {
  const chart = JSON.parse(root.querySelector('#chart-data').textContent);
  const reportEl = root.querySelector('#report-data');
  const report = reportEl ? JSON.parse(reportEl.textContent) : null;
  const svg = root.querySelector('svg.plate');
  const caption = root.querySelector('#caption');
  const stepsEl = root.querySelector('#steps');
  const stateEls = new Map([...svg.querySelectorAll('.state')].map((el) => [el.dataset.id, el]));
  const edgeEls = new Map([...svg.querySelectorAll('.edge.transition')].map((el) => [el.dataset.id, el]));
  const byId = (id) => chart.transitions.find((t) => t.id === id);

  let config = initialConfig(chart);
  let history = [];
  let timer = null;

  function paint() {
    const active = activeSet(chart, config);
    for (const [id, el] of stateEls) el.classList.toggle('active', active.has(id));
    const en = new Set(enabled(chart, config).map((t) => t.id));
    for (const [id, el] of edgeEls) {
      el.classList.toggle('enabled', en.has(id));
      el.classList.toggle('disabled', !en.has(id));
    }
    const labels = config.map((id) => chart.states[id].label);
    const done = en.size === 0;
    caption.textContent = (history.length ? `step ${history.length}` : 'start') + ' · ' + labels.join(' + ') + (done ? ' · nothing can happen next' : '');
    stepsEl.innerHTML = '';
    enabled(chart, config).forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'step';
      b.textContent = `${i + 1}. ${t.label}`;
      b.title = `→ ${chart.states[t.to].label}`;
      b.addEventListener('click', () => take(t));
      stepsEl.appendChild(b);
    });
    root.querySelector('#undo').disabled = history.length === 0;
  }

  function take(t, opts = {}) {
    history.push({ config, t: t.id });
    config = fire(chart, config, t);
    const el = edgeEls.get(t.id);
    if (el) { el.classList.add('fired'); setTimeout(() => el.classList.remove('fired'), 650); }
    paint();
    if (!opts.quiet) announce(`${t.label} → ${config.map((id) => chart.states[id].label).join(' + ')}`);
  }

  function announce(text) {
    const live = root.querySelector('#live');
    if (live) live.textContent = text;
  }

  function reset() { stopAuto(); config = initialConfig(chart); history = []; paint(); }
  function undo() { const h = history.pop(); if (h) { config = h.config; paint(); } }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; root.querySelector('#auto').textContent = 'auto-walk'; } }
  function toggleAuto() {
    if (timer) return stopAuto();
    root.querySelector('#auto').textContent = 'stop';
    timer = setInterval(() => {
      const en = enabled(chart, config);
      if (!en.length) return stopAuto();
      take(en[Math.floor(Math.random() * en.length)], { quiet: true });
    }, 900);
  }

  function replay(bugIdx) {
    stopAuto();
    const bug = report.bugs[bugIdx];
    const ids = resolveBugPath(chart, bug);
    config = initialConfig(chart); history = []; paint();
    let i = 0;
    const tick = () => {
      if (i >= ids.length) {
        const unresolved = ids.filter((x) => x === null).length;
        caption.textContent += unresolved ? ` · replay of ${bug.rule}: ${unresolved} step(s) did not match the chart` : ` · ${bug.rule} breaks here`;
        return;
      }
      const id = ids[i++];
      if (id) take(byId(id), { quiet: true });
      timer = setTimeout(tick, 850);
    };
    timer = setTimeout(tick, 400);
  }

  for (const [id, el] of edgeEls) {
    el.addEventListener('click', () => { if (el.classList.contains('enabled')) take(byId(id)); });
  }
  root.querySelector('#reset').addEventListener('click', reset);
  root.querySelector('#undo').addEventListener('click', undo);
  root.querySelector('#auto').addEventListener('click', toggleAuto);
  root.querySelectorAll('[data-replay]').forEach((b) => b.addEventListener('click', () => replay(Number(b.dataset.replay))));
  document.addEventListener('keydown', (ev) => {
    if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
    if (ev.key === 'r') reset();
    else if (ev.key === 'Backspace') { ev.preventDefault(); undo(); }
    else if (ev.key === ' ') { ev.preventDefault(); toggleAuto(); }
    else if (/^[1-9]$/.test(ev.key)) { const t = enabled(chart, config)[Number(ev.key) - 1]; if (t) take(t); }
  });
  paint();
  return { take, reset, undo, replay, get config() { return config; } };
}

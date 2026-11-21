// Step player for lesson.html. Browser only. bin/iso.mjs inlines this file after engine.mjs,
// so the import below is stripped at build time and the names resolve in the shared scope.
import { resolve, computeLayout, renderParts, pointAt, tokenShape, packetKindsUsed, bodyBox, captionBox } from './engine.mjs';

const SVG_NS = 'http://www.w3.org/2000/svg';
const TAG_TONE = { problem: 'bad', failure: 'bad', fix: 'good', idea: 'good', mechanism: 'info', tradeoff: 'warn', recap: 'info' };
const MARK_TONE = { '+': 'good', '-': 'bad', '~': 'info', '!': 'warn' };

const escapeHTML = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escape first, then allow `code` and **strong**. Nothing else is interpreted. */
const inline = (s) => escapeHTML(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

function svgFrom(html) {
  const holder = document.createElementNS(SVG_NS, 'g');
  holder.innerHTML = html;
  return holder.firstElementChild;
}

function mountLesson(root, scene, theme) {
  const frames = resolve(scene);
  const layout = computeLayout(scene, frames);
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasSteps = (scene.steps || []).length > 0;
  let index = 0, paused = false, raf = 0, epoch = 0, movers = [];

  const css = document.documentElement.style;
  const page = theme.page;
  css.setProperty('--bg', page.bg); css.setProperty('--ink', page.ink); css.setProperty('--muted', page.muted);
  css.setProperty('--rule', page.rule); css.setProperty('--accent', page.accent); css.setProperty('--font', theme.font.page);
  css.setProperty('--on-accent', theme.mode === 'dark' ? theme.bg : '#fff');
  for (const [name, tone] of Object.entries(theme.tones)) { css.setProperty(`--${name}`, tone.ink); css.setProperty(`--${name}-bg`, tone.bg); }
  document.documentElement.dataset.mode = theme.mode;

  const gaugeIds = [];
  for (const fr of frames) for (const id of Object.keys(fr.gauges)) if (!gaugeIds.includes(id)) gaugeIds.push(id);
  const kinds = packetKindsUsed(scene);
  const [vx, vy, vw, vh] = layout.viewBox;
  // On a narrow screen the whole board makes labels too small to read, so the view follows the step's focus.
  const canFollow = hasSteps && frames.some((fr) => fr.focus.length);
  let follow = canFollow && (scene.camera ? scene.camera === 'follow' : window.matchMedia('(max-width: 820px)').matches);
  let cam = [vx, vy, vw, vh], camRaf = 0;

  root.innerHTML = `
    <header class="head">
      <h1>${escapeHTML(scene.title || 'Explainer')}</h1>
      ${scene.subtitle ? `<p class="sub">${escapeHTML(scene.subtitle)}</p>` : ''}
    </header>
    <section class="show">
      <svg class="stage" viewBox="${vx} ${vy} ${vw} ${vh}" font-family="${escapeHTML(theme.font.label)}" role="img" aria-label="${escapeHTML(scene.title || 'Diagram')}"></svg>
      <div class="under">
        ${kinds.length ? `<ul class="legend">${kinds.map((k) => `<li><svg viewBox="-10 -9 20 17" aria-hidden="true">${tokenShape(theme, k)}</svg>${k}</li>`).join('')}</ul>` : '<span></span>'}
        ${canFollow ? '<button class="cam" type="button"></button>' : ''}
      </div>
      ${gaugeIds.length ? `<dl class="gauges">${gaugeIds.map((id) => `<div class="gauge" data-id="${id}"><dd>–</dd><dt></dt></div>`).join('')}</dl>` : ''}
    </section>
    <section class="telling" aria-live="polite"></section>
    ${hasSteps ? `<nav class="rail" aria-label="Steps">
      <button class="back" type="button">Back</button>
      <ol class="ticks">${frames.map((fr, i) => `<li><button type="button" data-go="${i}" aria-label="Step ${i + 1}: ${escapeHTML(fr.step.title || '')}"></button></li>`).join('')}</ol>
      <button class="next" type="button"></button>
    </nav>` : ''}`;

  const stage = root.querySelector('.stage');
  const first = renderParts(scene, theme, frames[0], layout, { staticPackets: still });
  stage.innerHTML = `<defs>${first.defs}</defs>` + first.layers.map((l) => `<g data-layer="${l.name}"></g>`).join('');
  const layerEl = (name) => stage.querySelector(`[data-layer="${name}"]`);
  const live = new Map();

  function reconcile(layer, items, animate) {
    const host = layerEl(layer);
    const want = new Set(items.map((i) => i.key));
    for (const [key, entry] of live) {
      if (entry.layer !== layer || want.has(key)) continue;
      live.delete(key);
      if (animate) { entry.el.classList.add('exit'); setTimeout(() => entry.el.remove(), 180); }
      else entry.el.remove();
    }
    for (const item of items) {
      let entry = live.get(item.key);
      if (!entry) {
        entry = { layer, html: item.html, el: svgFrom(item.html) };
        if (animate) entry.el.classList.add('enter');
        live.set(item.key, entry);
      } else if (entry.html !== item.html) {
        const el = svgFrom(item.html);
        entry.el.replaceWith(el);
        entry.el = el; entry.html = item.html;
      }
      host.appendChild(entry.el);
    }
  }

  function startPackets(frame, paths) {
    cancelAnimationFrame(raf);
    const host = layerEl('packets');
    host.innerHTML = '';
    movers = [];
    frame.packets.forEach((p) => {
      const poly = paths[p.on];
      if (!poly) return;
      const n = Math.max(1, Math.min(6, p.count || 1));
      for (let i = 0; i < n; i++) {
        const el = svgFrom(`<g class="token" opacity="0">${tokenShape(theme, p.kind)}</g>`);
        host.appendChild(el);
        movers.push({ el, poly, reverse: !!p.reverse, lag: i * 0.16 + (p.reverse ? 0.55 : 0) });
      }
    });
    if (!movers.length) return;
    epoch = performance.now();
    const TRAVEL = 1500, CYCLE = 3000;
    const tick = (now) => {
      if (!paused) {
        for (const m of movers) {
          const local = ((now - epoch) / CYCLE - m.lag / 2 + 10) % 1;
          const t = (local * CYCLE) / TRAVEL;
          if (t > 1) { m.el.setAttribute('opacity', '0'); continue; }
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const at = pointAt(m.poly, m.reverse ? 1 - eased : eased);
          m.el.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`);
          m.el.setAttribute('opacity', String(Math.min(1, t * 8, (1 - t) * 8)));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function view(frame) {
    if (!follow || !frame.focus.length) return [vx, vy, vw, vh];
    const ids = new Set(frame.focus);
    for (const p of frame.packets) { const l = frame.links.get(p.on); if (l) { ids.add(l.from); ids.add(l.to); } }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const id of ids) {
      const e = frame.cast.get(id);
      if (!e || !e.at || !frame.on.has(id)) continue;
      for (const b of [bodyBox(e), captionBox(e)]) {
        if (!b) continue;
        x0 = Math.min(x0, b.x0 - 30); x1 = Math.max(x1, b.x1 + 30); y0 = Math.min(y0, b.y0 - 40); y1 = Math.max(y1, b.y1 + 16);
      }
    }
    if (!Number.isFinite(x0)) return [vx, vy, vw, vh];
    let w = x1 - x0, h = y1 - y0;
    const aspect = vw / vh, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    if (w < vw * 0.48) { w = vw * 0.48; h = w / aspect; }
    if (w >= vw) return [vx, vy, vw, vh];
    return [Math.max(vx, Math.min(vx + vw - w, cx - w / 2)), Math.max(vy, Math.min(vy + vh - h, cy - h / 2)), w, h];
  }

  function moveCamera(to, animate) {
    cancelAnimationFrame(camRaf);
    if (!animate || still) { cam = to; stage.setAttribute('viewBox', cam.join(' ')); return; }
    const from = cam.slice(), t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / 520), k = 1 - Math.pow(1 - t, 3);
      cam = from.map((v, i) => v + (to[i] - v) * k);
      stage.setAttribute('viewBox', cam.map((v) => v.toFixed(1)).join(' '));
      if (t < 1) camRaf = requestAnimationFrame(step);
    };
    camRaf = requestAnimationFrame(step);
  }

  function tell(frame) {
    const s = frame.step, tone = TAG_TONE[s.tag] || 'info';
    const changes = (s.changes || []).map((c) => {
      const mark = /^[+\-~!] /.test(c) ? c[0] : '';
      return `<li${mark ? ` data-tone="${MARK_TONE[mark]}"` : ''}><span class="mark" aria-hidden="true">${mark === '-' ? '−' : mark}</span>${inline(mark ? c.slice(2) : c)}</li>`;
    }).join('');
    root.querySelector('.telling').innerHTML = `
      ${hasSteps ? `<p class="where">${s.tag ? `<span class="tag" data-tone="${tone}">${s.tag}</span>` : ''}<span class="count">${frame.index + 1} of ${frames.length}</span></p>` : ''}
      ${s.title ? `<h2>${inline(s.title)}</h2>` : ''}
      ${(s.body || []).map((p) => `<p>${inline(p)}</p>`).join('')}
      ${s.idea ? `<p class="idea">${inline(s.idea)}</p>` : ''}
      ${changes ? `<ul class="changes">${changes}</ul>` : ''}`;
  }

  function gauges(frame, animate) {
    for (const el of root.querySelectorAll('.gauge')) {
      const g = frame.gauges[el.dataset.id];
      const dd = el.querySelector('dd'), dt = el.querySelector('dt');
      const value = g ? String(g.value) : '–';
      if (g && g.label) dt.textContent = g.label;
      else if (!dt.textContent) { const later = frames.find((fr) => fr.gauges[el.dataset.id]); dt.textContent = later ? later.gauges[el.dataset.id].label || el.dataset.id : el.dataset.id; }
      if (dd.textContent !== value) {
        dd.textContent = value;
        if (animate) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
      }
      el.dataset.tone = g && g.tone ? g.tone : '';
      el.classList.toggle('idle', !g);
    }
  }

  function go(next, animate = true) {
    index = Math.max(0, Math.min(frames.length - 1, next));
    const frame = frames[index];
    const parts = renderParts(scene, theme, frame, layout, { staticPackets: still });
    for (const layer of parts.layers) {
      if (layer.name === 'packets' && !still) continue;
      reconcile(layer.name, layer.items, animate && !still);
    }
    if (!still) startPackets(frame, parts.paths);
    moveCamera(view(frame), animate);
    const camBtn = root.querySelector('.cam');
    if (camBtn) camBtn.textContent = follow ? 'Show whole board' : 'Follow the action';
    tell(frame);
    gauges(frame, animate);
    if (hasSteps) {
      root.querySelectorAll('.ticks button').forEach((b, i) => {
        b.classList.toggle('done', i < index);
        if (i === index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      root.querySelector('.back').disabled = index === 0;
      const last = index === frames.length - 1;
      root.querySelector('.next').textContent = last ? 'Start over' : `Next: ${frames[index + 1].step.title || index + 2}`;
      // A plain #step-N hash, so a link can open at a step. Sandboxed viewers may refuse it.
      if (animate) { try { history.replaceState(null, '', `#step-${index + 1}`); } catch { /* the lesson works without it */ } }
    }
  }

  if (canFollow) root.querySelector('.cam').addEventListener('click', () => { follow = !follow; go(index); });
  if (hasSteps) {
    root.querySelector('.back').addEventListener('click', () => go(index - 1));
    root.querySelector('.next').addEventListener('click', () => go(index === frames.length - 1 ? 0 : index + 1));
    root.querySelector('.ticks').addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) go(Number(b.dataset.go)); });
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(frames.length - 1);
      else if (e.key === 'r' || e.key === 'R') go(index, false);
      else if (e.key === ' ' && e.target === document.body) { paused = !paused; e.preventDefault(); }
    });
    let sx = 0, sy = 0;
    stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dy) < 40) go(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
  const fromHash = parseInt((location.hash.match(/(\d+)$/) || [])[1], 10);
  go(Number.isFinite(fromHash) ? fromHash - 1 : 0, false);
  window.addEventListener('hashchange', () => { const n = parseInt((location.hash.match(/(\d+)$/) || [])[1], 10); if (Number.isFinite(n) && n - 1 !== index) go(n - 1); });
}

// Cover and social-card path. The diagrams are SVG; this is the one place an image model is used.
// Pure functions only: bin/iso.mjs does the network call.
//
// Request shape follows Google's Gemini API image-generation docs (Interactions API) as read on
// 2026-11-21. It has not been executed from this repo's tests: there is no key in CI.

export const COVER_MODEL = 'gemini-3-pro-image';
export const COVER_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
export const ASPECTS = ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
export const IMAGE_SIZES = ['1K', '2K', '4K'];

const OBJECT = {
  node: (e) => `a low square tile${e.icon ? ` with a simple ${e.icon} glyph painted flat on its top face` : ''}`,
  store: () => 'a short cylinder with two thin bands',
  client: () => 'a small upright screen standing on a thin tile',
  actors: () => 'a cluster of small rounded pegs',
  queue: () => 'a long shallow tray holding a row of small cubes',
  ring: () => 'a circle drawn on the board with small pucks sitting on it',
};

/** Text prompt for a hero image that matches the diagram's theme. */
export function coverPrompt(scene, theme, opts = {}) {
  const aspect = opts.aspect || '16:9';
  const cast = (scene.cast || []).filter((e) => OBJECT[e.kind]);
  const sorted = cast.slice().sort((a, b) => a.at[0] - a.at[1] - (b.at[0] - b.at[1]));
  const hueOf = (e) => e.hue || (e.kind === 'store' ? 'violet' : e.kind === 'queue' ? 'amber' : 'neutral');
  const objects = sorted.slice(0, 9).map((e) => `- ${OBJECT[e.kind](e)}, coloured ${theme.hues[hueOf(e)].left} (stands for: ${e.label || e.id})`);
  const used = [...new Set(sorted.map(hueOf))];
  const outline = theme.stroke.width > 0 ? `thin ${theme.stroke.color} line-work on every edge` : 'no outlines; edges are defined by the change of tone between faces';
  return [
    `Isometric hero illustration for a technical explainer titled "${scene.title || 'Untitled'}".`,
    '',
    `Frame: ${aspect}. One thin board (a slab) seen in 2:1 isometric projection, centred, with wide empty margin around it. Parallel lines stay parallel: no perspective, no vanishing point.`,
    '',
    'On the board, arranged left to right:',
    ...objects,
    '',
    'Flat traces run along the board between the objects, turning in rounded right-angle elbows that follow the board\'s dot lattice. A few small diamond tokens sit on the traces, as if travelling.',
    '',
    `Palette, use only these colours: background ${theme.bg}; board top ${theme.board.top}, board sides ${theme.board.left} and ${theme.board.right}; traces ${theme.link.color}; tokens ${theme.packets.request} and ${theme.packets.response}; object colours ${used.map((h) => theme.hues[h].left).join(', ')}.`,
    `Shading: flat vector look, exactly three tones per object (top lightest, left face mid, right face darkest), ${outline}, short crisp floor shadows falling to the right. No gradients, no gloss, no texture.`,
    '',
    opts.title === false
      ? 'Text: none. No words, letters, numbers or labels anywhere.'
      : `Text: render only the title "${scene.title || ''}" once, top left, in ${theme.ink}, in a plain ${theme.name === 'print' ? 'serif' : 'sans-serif'} face. No other words, letters, numbers or labels anywhere.`,
    'Leave out: people, logos, brand marks, UI screenshots, photorealism, 3D-render lighting, watermarks.',
  ].join('\n');
}

/** Fetch arguments for the image request. `reference` is an optional { mime, base64 } of the rendered still. */
export function coverRequest(prompt, apiKey, opts = {}) {
  const aspect = opts.aspect || '16:9', size = opts.size || '2K';
  if (!ASPECTS.includes(aspect)) throw new Error(`aspect must be one of ${ASPECTS.join(', ')}`);
  if (!IMAGE_SIZES.includes(size)) throw new Error(`size must be one of ${IMAGE_SIZES.join(', ')}`);
  const input = [{ type: 'text', text: opts.reference ? `${prompt}\n\nThe attached image is the real diagram. Keep its layout and object count; restyle it as the hero illustration described above.` : prompt }];
  if (opts.reference) input.push({ type: 'image', mime_type: opts.reference.mime, data: opts.reference.base64 });
  return {
    url: COVER_ENDPOINT,
    init: {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: opts.model || COVER_MODEL,
        input,
        response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: aspect, image_size: size },
      }),
    },
  };
}

/** Find the last image block in a response, whatever it is nested in. Returns { mime, base64 } or null. */
export function extractImage(json) {
  let found = null;
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v.data === 'string' && v.data.length > 200 && (v.type === 'image' || /^image\//.test(v.mime_type || v.mimeType || ''))) {
      found = { mime: v.mime_type || v.mimeType || 'image/jpeg', base64: v.data };
    }
    Object.values(v).forEach(walk);
  };
  walk(json);
  return found;
}

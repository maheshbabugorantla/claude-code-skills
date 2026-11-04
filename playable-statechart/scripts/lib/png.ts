// PNG export through Playwright (optional dependency). Fails with a clear message when absent.

import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { FRAME } from './render.ts';

/** Load Playwright from scripts/node_modules, else from wherever CommonJS resolution (NODE_PATH, globals) finds it. */
async function loadPlaywright(): Promise<any> {
  try { return await import('playwright'); } catch { /* fall through */ }
  const req = createRequire(import.meta.url);
  const resolved = req.resolve('playwright');
  const mod = await import(pathToFileURL(resolved).href);
  return mod.chromium ? mod : mod.default;
}

export async function exportPng(htmlPath: string, pngPath: string, opts: { scale?: number } = {}): Promise<void> {
  let pw: any;
  try {
    pw = await loadPlaywright();
  } catch {
    throw new Error(
      'PNG export needs Playwright. In the skill\'s scripts/ folder run:\n' +
        '  npm install playwright && npx playwright install chromium\n' +
        'Or open the HTML in a browser and use its print/screenshot instead.',
    );
  }
  const browser = await pw.chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: FRAME.w, height: FRAME.h }, deviceScaleFactor: opts.scale ?? 1 });
    await page.goto(pathToFileURL(htmlPath).href + '?static');
    await page.evaluate(() => (document as any).fonts.ready);
    const plate = page.locator('svg.plate');
    await plate.screenshot({ path: pngPath, type: 'png' });
  } finally {
    await browser.close();
  }
}

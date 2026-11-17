#!/usr/bin/env node
/**
 * Render plugin covers from template/cover.html with Playwright.
 *
 *   node render.mjs --plugins <harness checkout>/plugins --art template/art.json --out <tmp>
 *        [--only id,id] [--root <harness checkout>] [--font <face.woff2>] [--jobs 3]
 *        [--icons | --icons-only]
 *
 * One page per cover, viewport 1600x900, deviceScaleFactor 1; writes the master
 * <out>/<id>/cover.png, <out>/<id>/meta.json (the field colour as "tone", which to-webp.py
 * writes into the market document) and <out>/render-report.json. --icons also rasterises each
 * plugin's icon.svg to <out>/<id>/icon.png (256x256, transparent ground, drawn in the cover's
 * field colour), the picture a plugin that is not bundled supplies for its uninstalled row;
 * --icons-only renders just those.
 *
 * The harness checkout (default: the parent of --plugins) must be installed: it supplies
 * Playwright (packages/landing), the lettering face (packages/ui's @fontsource-variable/mona-sans)
 * and the product logo (packages/web/public/penguin-logo.svg). If Playwright does not resolve
 * from there, the current directory's packages/landing is tried. --plugins may point at any
 * folder of plugin directories (another repository's plugins/, say) while --root names the
 * installed harness checkout.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE = path.join(HERE, "template", "cover.html");
const WIDTH = 1600;
const HEIGHT = 900;

const FONT_CANDIDATES = [
  ["Mona Sans Variable", "packages/ui/node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wght-normal.woff2"],
  ["IBM Plex Sans Variable", "packages/ui/node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2"],
];

const FLAGS = new Set(["icons", "icons-only"]);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new Error(`unexpected argument: ${a}`);
    const key = a.slice(2);
    if (FLAGS.has(key)) {
      out[key] = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`--${key} needs a value`);
    out[key] = value;
    i++;
  }
  return out;
}

function usage(message) {
  if (message) console.error(`render.mjs: ${message}`);
  console.error(
    "usage: node render.mjs --plugins <harness checkout>/plugins --art template/art.json --out <tmp> [--only a,b] [--root <harness checkout>] [--font <file.woff2>] [--jobs 3] [--icons | --icons-only]",
  );
  process.exit(2);
}

function loadPlaywright(roots) {
  const tried = [];
  for (const dir of roots) {
    const pkg = path.join(dir, "packages/landing/package.json");
    tried.push(pkg);
    if (!fs.existsSync(pkg)) continue;
    try {
      return createRequire(pkg)("@playwright/test");
    } catch {
      // try the next root
    }
  }
  throw new Error(`@playwright/test did not resolve from:\n  ${tried.join("\n  ")}`);
}

function pickFont(root, override) {
  if (override) {
    const file = path.resolve(override);
    if (!fs.existsSync(file)) throw new Error(`--font file not found: ${file}`);
    return { name: path.basename(file), url: pathToFileURL(file).href, file };
  }
  for (const [name, rel] of FONT_CANDIDATES) {
    const file = path.join(root, rel);
    if (fs.existsSync(file)) return { name, url: pathToFileURL(file).href, file };
  }
  console.warn("render.mjs: no bundled grotesk found; lettering falls back to system-ui");
  return null;
}

// The icon's children only; the template wraps them in its own <svg> with the motif styling.
function iconInner(file) {
  if (!fs.existsSync(file)) return null;
  const svg = fs.readFileSync(file, "utf8");
  const open = svg.search(/<svg\b[^>]*>/);
  if (open < 0) return null;
  const start = svg.indexOf(">", open) + 1;
  const end = svg.lastIndexOf("</svg>");
  return svg.slice(start, end).trim();
}

function coverData(id, spec, ctx) {
  const d = {
    id,
    series: spec.series,
    hue: spec.hue,
    font: ctx.font ? { name: ctx.font.name, url: ctx.font.url } : null,
    logo: ctx.logo,
    // "motif": false on a cover (or in defaults.seriesMotif for its series) leaves the motif out.
    icon: null,
    motif: { ...ctx.defaults.motif, ...(spec.motif || {}) },
  };
  const motifOn = spec.motif ?? ctx.defaults.seriesMotif?.[spec.series] ?? true;
  if (motifOn !== false) {
    d.icon = iconInner(path.join(ctx.pluginsDir, id, "icon.svg"));
    if (!d.icon) console.warn(`render.mjs: ${id}: no icon.svg, rendering without the backdrop motif`);
  }
  if (spec.scene) {
    const file = path.join(ctx.artDir, "scenes", `${spec.scene}.svg`);
    // A and D scenes fill defaults.sceneFit around the centre; the B diagram sits in its own column.
    const place = spec.series === "B" ? (ctx.defaults.diagram ?? {}) : { fit: ctx.defaults.sceneFit };
    d.scene = {
      svg: fs.readFileSync(file, "utf8"),
      at: spec.at ?? place.at,
      fit: spec.fit ?? place.fit,
      scale: spec.scale,
    };
  }
  if (spec.series === "B") d.lettering = { ...ctx.defaults.lettering, text: spec.lettering };
  if (spec.series === "C") {
    const shot = spec.shot;
    const src = path.resolve(ctx.artDir, shot.src);
    if (!fs.existsSync(src)) throw new Error(`${id}: screenshot not found: ${src}`);
    d.shot = { url: pathToFileURL(src).href, crop: shot.crop, scale: shot.scale, offset: shot.offset, pad: shot.pad };
    d.window = { ...ctx.defaults.window, ...spec.window };
  }
  return d;
}

// icon.png: the whole icon.svg on a transparent ground, in the cover's field colour.
async function renderIcon(context, templateUrl, id, spec, ctx, outDir) {
  const file = path.join(ctx.pluginsDir, id, "icon.svg");
  if (!fs.existsSync(file)) throw new Error(`${id}: no icon.svg at ${file}`);
  const page = await context.newPage();
  await page.addInitScript((art) => {
    window.__ART__ = art;
  }, { id, mode: "icon", hue: spec.hue, iconSvg: fs.readFileSync(file, "utf8") });
  await page.goto(templateUrl);
  await page.waitForFunction(() => window.__COVER_READY__ === true || window.__COVER_ERROR__, null, { timeout: 30_000 });
  const error = await page.evaluate(() => window.__COVER_ERROR__ ?? null);
  if (error) throw new Error(`${id}: ${error}`);
  const dir = path.join(outDir, id);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "icon.png");
  await page.screenshot({ path: out, type: "png", omitBackground: true, clip: { x: 0, y: 0, width: 256, height: 256 } });
  await page.close();
  return { file: out, bytes: fs.statSync(out).size };
}

async function renderOne(context, templateUrl, data, outDir) {
  const t0 = performance.now();
  const page = await context.newPage();
  const problems = [];
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`console.${m.type()}: ${m.text()}`);
  });
  page.on("requestfailed", (r) => problems.push(`requestfailed: ${r.url().slice(0, 120)} ${r.failure()?.errorText ?? ""}`));
  await page.addInitScript((art) => {
    window.__ART__ = art;
  }, data);
  await page.goto(templateUrl);
  await page.waitForFunction(() => window.__COVER_READY__ === true || window.__COVER_ERROR__, null, { timeout: 30_000 });
  const error = await page.evaluate(() => window.__COVER_ERROR__ ?? null);
  if (error) throw new Error(`${data.id}: ${error}`);
  const report = await page.evaluate(() => window.__COVER_REPORT__);
  const dir = path.join(outDir, data.id);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "cover.png");
  await page.screenshot({ path: file, type: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  await page.close();
  // meta.json: the field colour (from the template's palette, as the page painted it) for the
  // market document; to-webp.py adds the WebP byte sizes.
  const meta = { tone: report.tone, width: 1280, height: 720, bytes: null, thumbBytes: null };
  fs.writeFileSync(path.join(dir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  return { ...report, file, bytes: fs.statSync(file).size, ms: Math.round(performance.now() - t0), problems };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.plugins || !args.art || !args.out) usage("--plugins, --art and --out are required");
  const pluginsDir = path.resolve(args.plugins);
  const root = path.resolve(args.root ?? path.dirname(pluginsDir));
  const artPath = path.resolve(args.art);
  const outDir = path.resolve(args.out);
  const jobs = Math.max(1, Number(args.jobs ?? 3));

  const art = JSON.parse(fs.readFileSync(artPath, "utf8"));
  const only = args.only ? new Set(args.only.split(",")) : null;
  const ids = Object.keys(art.covers).filter((id) => !only || only.has(id));
  if (ids.length === 0) usage("no covers selected");

  const logoFile = path.join(root, "packages/web/public/penguin-logo.svg");
  const ctx = {
    pluginsDir,
    artDir: path.dirname(artPath),
    defaults: art.defaults ?? {},
    font: pickFont(root, args.font),
    logo: fs.existsSync(logoFile) ? `data:image/svg+xml;base64,${fs.readFileSync(logoFile).toString("base64")}` : null,
  };
  if (!ctx.logo) console.warn(`render.mjs: logo not found at ${logoFile}; the brand square renders empty`);

  const { chromium } = loadPlaywright([root, process.cwd()]);
  const t0 = performance.now();
  // file:// fonts and screenshots load from a file:// page only with this switch (CORS on fonts).
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  const templateUrl = pathToFileURL(TEMPLATE).href;
  const tBrowser = performance.now();

  const results = [];
  const queue = ids.slice();
  let failed = 0;
  await Promise.all(
    Array.from({ length: Math.min(jobs, queue.length) }, async () => {
      while (queue.length > 0) {
        const id = queue.shift();
        try {
          if (args.icons || args["icons-only"]) {
            const icon = await renderIcon(context, templateUrl, id, art.covers[id], ctx, outDir);
            console.log(`${id.padEnd(22)} icon.png ${icon.bytes} B`);
          }
          if (args["icons-only"]) continue;
          const r = await renderOne(context, templateUrl, coverData(id, art.covers[id], ctx), outDir);
          results.push(r);
          const extra =
            (r.scene ? ` scene ${r.scene.w}x${r.scene.h}@${r.scene.x},${r.scene.y}` : "") +
            (r.lettering ? ` lettering cap ${r.lettering.cap}px x ${r.lettering.x}..${r.lettering.right}` : "") +
            (r.shot ? ` shot x${r.shot.scale}` : "");
          console.log(`${id.padEnd(22)} ${String(r.ms).padStart(5)} ms  ${r.bytes} B  tone ${r.tone}  font: ${r.font}${extra}`);
          for (const p of r.problems) console.log(`  ! ${p}`);
        } catch (e) {
          failed++;
          console.error(`${id}: FAILED ${e.message}`);
        }
      }
    }),
  );

  await browser.close();
  const total = Math.round(performance.now() - t0);
  const summary = {
    rendered: results.length,
    failed,
    font: ctx.font ? { name: ctx.font.name, file: ctx.font.file } : null,
    browserStartMs: Math.round(tBrowser - t0),
    totalMs: total,
    covers: results.sort((a, b) => a.id.localeCompare(b.id)),
  };
  fs.mkdirSync(outDir, { recursive: true });
  if (!args["icons-only"]) fs.writeFileSync(path.join(outDir, "render-report.json"), `${JSON.stringify(summary, null, 2)}\n`);
  const what = args["icons-only"] ? `icons for ${ids.length - failed}/${ids.length}` : `rendered ${results.length}/${ids.length}`;
  console.log(`${what} in ${total} ms (browser start ${summary.browserStartMs} ms, jobs ${jobs})`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(`render.mjs: ${e.stack ?? e}`);
  process.exit(1);
});

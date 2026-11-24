#!/usr/bin/env node
/**
 * Lay every picture under a folder out as a labelled contact sheet, once on white and once on
 * #141414, so covers can be judged on both backgrounds.
 *
 *   node sheet.mjs <dir> <out-prefix> [--cols 3] [--match <regex>] [--root <harness checkout>]
 *
 * Writes <out-prefix>-light.png and <out-prefix>-dark.png, 1600 px wide. PNG, WebP and JPEG
 * files are found recursively and sorted by path; --match keeps the files whose name matches
 * (`--match '^cover\.webp$'` for the published covers of assets/plugins/); files named like the
 * outputs are skipped. Labels are the folder names when every file has the same name
 * (<id>/cover.png -> "<id>"), else the relative path without its extension. Playwright resolves
 * from <root>/packages/landing, then from the current directory's packages/landing (run it from
 * an installed harness checkout, as render.mjs).
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const WIDTH = 1600;
const PAD = 40;
const GAP_X = 28;
const GAP_Y = 30;

function usage(message) {
  if (message) console.error(`sheet.mjs: ${message}`);
  console.error("usage: node sheet.mjs <dir> <out-prefix> [--cols 3] [--match <regex>] [--root <harness checkout>]");
  process.exit(2);
}

function parseArgs(argv) {
  const pos = [];
  const opts = { cols: 3 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--cols") opts.cols = Number(argv[++i]);
    else if (a === "--root") opts.root = argv[++i];
    else if (a === "--match") opts.match = new RegExp(argv[++i]);
    else if (a.startsWith("--")) usage(`unknown option ${a}`);
    else pos.push(a);
  }
  if (pos.length !== 2) usage();
  if (!Number.isInteger(opts.cols) || opts.cols < 1) usage("--cols must be a positive integer");
  return { dir: path.resolve(pos[0]), prefix: path.resolve(pos[1]), ...opts };
}

function loadPlaywright(roots) {
  for (const dir of roots) {
    const pkg = path.join(dir, "packages/landing/package.json");
    if (!fs.existsSync(pkg)) continue;
    try {
      return createRequire(pkg)("@playwright/test");
    } catch {
      // try the next root
    }
  }
  usage(`@playwright/test did not resolve; pass --root <installed worktree> or run from one`);
}

const PICTURE = /\.(png|webp|jpe?g)$/i;

function findPictures(dir, skip, match) {
  const found = [];
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && PICTURE.test(entry.name) && (!match || match.test(entry.name)) && !skip.has(p)) found.push(p);
    }
  };
  walk(dir);
  return found;
}

function labels(dir, files) {
  const sameName = files.every((f) => path.basename(f) === path.basename(files[0]));
  return files.map((f) => {
    const rel = path.relative(dir, f);
    if (sameName && path.dirname(rel) !== ".") return path.dirname(rel).split(path.sep).join("/");
    return rel.replace(PICTURE, "").split(path.sep).join("/");
  });
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function html(files, names, cols, theme) {
  const bg = theme === "dark" ? "#141414" : "#ffffff";
  const fg = theme === "dark" ? "#e8e8e8" : "#1f1f1f";
  const tiles = files
    .map((f, i) => `<figure><img src="${pathToFileURL(f).href}" alt=""><figcaption>${esc(names[i])}</figcaption></figure>`)
    .join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  html, body { margin: 0; background: ${bg}; }
  main { box-sizing: border-box; width: ${WIDTH}px; padding: ${PAD}px; display: grid;
         grid-template-columns: repeat(${cols}, 1fr); column-gap: ${GAP_X}px; row-gap: ${GAP_Y}px; }
  figure { margin: 0; min-width: 0; }
  img { display: block; width: 100%; height: auto; border-radius: 12px; }
  figcaption { margin-top: 10px; font: 500 15px/1.3 system-ui, sans-serif; color: ${fg};
               white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style></head><body><main>${tiles}</main></body></html>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.dir) || !fs.statSync(args.dir).isDirectory()) usage(`not a directory: ${args.dir}`);
  const outLight = `${args.prefix}-light.png`;
  const outDark = `${args.prefix}-dark.png`;
  const files = findPictures(args.dir, new Set([outLight, outDark]), args.match);
  if (files.length === 0) usage(`no pictures under ${args.dir}`);
  const names = labels(args.dir, files);

  const roots = [args.root, process.cwd()].filter(Boolean).map((r) => path.resolve(r));
  const { chromium } = loadPlaywright(roots);
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cover-sheet-"));
  try {
    for (const [theme, out] of [
      ["light", outLight],
      ["dark", outDark],
    ]) {
      const file = path.join(tmp, `sheet-${theme}.html`);
      fs.writeFileSync(file, html(files, names, args.cols, theme));
      const page = await context.newPage();
      await page.goto(pathToFileURL(file).href);
      await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode())));
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.screenshot({ path: out, fullPage: true, type: "png" });
      await page.close();
      console.log(`${out}  (${files.length} images, ${args.cols} columns)`);
    }
  } finally {
    await browser.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(`sheet.mjs: ${e.stack ?? e}`);
  process.exit(1);
});

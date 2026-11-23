#!/usr/bin/env node
/**
 * Write the market document's PLACEHOLDER popularity block.
 *
 *   node popularity.mjs [--market ../../assets/plugins/market.json] [--seed <text>] [--date YYYY-MM-DD]
 *
 * Nothing measures a plugin's installs across deployments yet, so these numbers are generated,
 * not counted. They let the market's 热门 / 飙升 (popular / rising) panel be built and seen
 * now, and are replaced by a real install-count API later: that API publishes the same shape
 * with `source: "live"`, the switch every reader keys on.
 *
 *   "popularity": {
 *     "source": "placeholder",
 *     "generatedAt": "2026-11-17",
 *     "items": { "@penguinharness/a2ui": { "installs": 4180, "weekly": 162 }, ... }
 *   }
 *
 * Every plugin the document names under `plugins` gets an item. Its numbers come from
 * sha256(seed, name) alone, so a rerun with the same seed writes the same numbers and adding a
 * plugin never moves another's: `installs` is log-uniform between 120 and 9,600, and `weekly`
 * (installs in the last seven days) is 1 to 8 % of it, at least 1. `generatedAt` is --date, else
 * today. The block is written after `selected`, the order to-webp.py keeps. Needs only Node.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SEED = "penguin-market-placeholder-1";
const INSTALLS = [120, 9600];
const WEEKLY_SHARE = [0.01, 0.08];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith("--") || value === undefined) {
      console.error("usage: node popularity.mjs [--market <file>] [--seed <text>] [--date YYYY-MM-DD]");
      process.exit(2);
    }
    out[key.slice(2)] = value;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const market = path.resolve(args.market ?? path.join(HERE, "..", "..", "assets", "plugins", "market.json"));
const seed = args.seed ?? DEFAULT_SEED;
const date = args.date ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`popularity.mjs: --date must be YYYY-MM-DD, got ${date}`);
  process.exit(2);
}

/** A number in [0, 1) that depends on the seed, the plugin's name and what it is for, and nothing else. */
function unit(name, salt) {
  const digest = createHash("sha256").update(`${seed}\0${salt}\0${name}`).digest();
  return digest.readUInt32BE(0) / 2 ** 32;
}

const doc = JSON.parse(fs.readFileSync(market, "utf8"));
const items = {};
for (const name of Object.keys(doc.plugins ?? {}).sort()) {
  const [low, high] = INSTALLS.map(Math.log);
  const installs = Math.round(Math.exp(low + unit(name, "installs") * (high - low)));
  const share = WEEKLY_SHARE[0] + unit(name, "weekly") * (WEEKLY_SHARE[1] - WEEKLY_SHARE[0]);
  items[name] = { installs, weekly: Math.max(1, Math.round(installs * share)) };
}
const popularity = { source: "placeholder", generatedAt: date, items };

const out = {};
for (const [key, value] of Object.entries(doc)) {
  if (key === "popularity") continue;
  out[key] = value;
  if (key === "selected") out.popularity = popularity;
}
if (!("popularity" in out)) out.popularity = popularity;
fs.writeFileSync(market, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  `popularity.mjs: placeholder numbers for ${Object.keys(items).length} plugins (seed ${JSON.stringify(seed)}, generatedAt ${date}) -> ${market}`,
);

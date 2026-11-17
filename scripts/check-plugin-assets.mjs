#!/usr/bin/env node
/**
 * Check the plugin market's pictures and their document (assets/plugins/).
 *
 *   node scripts/check-plugin-assets.mjs [assets/plugins]
 *
 * market.json must hold schema 1 as assets/plugins/README.md describes it, and the rules here
 * restate the server's parser (the two repositories share no code): hero and selected are lists
 * of npm package names, hero 1-5 and every one of them selected, selected at most 12; each
 * plugin entry has a cover with a src (thumb and a #rrggbb tone optional), an optional icon,
 * and at most 6 screenshots, each with a src, an optional thumb and captions in both languages
 * or neither, one sentence of at most 80 characters. Paths are relative, lower-case
 * [a-z0-9._/-], no `.` or `..` segment, under the package's own folder (`<name>/` for
 * @penguinharness/*, `<scope>__<name>/` for anyone else), ending in .webp, .png or .jpg.
 * `popularity` is optional: { source: "placeholder" | "live", generatedAt: YYYY-MM-DD, items },
 * items keyed by npm package name, each { installs, weekly } of non-negative integers with weekly
 * at most installs. Today it is placeholder numbers (plugin-covers/popularity.mjs) until a real
 * install-count API publishes `source: "live"`; a server drops a block that breaks these rules
 * and keeps the rest of the document.
 *
 * Then the files: every named file exists, its bytes are the format its extension says (WebP,
 * PNG or JPEG, never animated), it has the size of its role and fits its budget (KB = 1000
 * bytes); and every file in the folder is named by the document. Exits 1 on any problem.
 * Needs only Node (18 or later).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "assets", "plugins"));
const DOC = path.join(ROOT, "market.json");
const OWN_FILES = new Set(["market.json", "README.md", "README.zh.md"]);

// Role -> [width, height, max bytes], as assets/plugins/README.md specifies them.
const ROLES = {
  cover: [1280, 720, 150_000],
  coverThumb: [640, 360, 45_000],
  shot: [1600, 1000, 300_000],
  shotThumb: [640, 400, 45_000],
  icon: [256, 256, 30_000],
};
const DOC_KEYS = new Set(["$comment", "schema", "updated", "hero", "selected", "popularity", "plugins"]);
const POPULARITY_KEYS = new Set(["source", "generatedAt", "items"]);
const POPULARITY_SOURCES = new Set(["placeholder", "live"]);
const ENTRY_KEYS = new Set(["cover", "icon", "screenshots"]);
const COVER_KEYS = new Set(["src", "thumb", "tone"]);
const SHOT_KEYS = new Set(["src", "thumb", "caption", "captionZh"]);
const PACKAGE = /^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const ASSET = /^[a-z0-9._/-]+\.(webp|png|jpg)$/;

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);
const isRecord = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

function unknownKeys(value, allowed, where) {
  for (const key of Object.keys(value)) if (!allowed.has(key)) fail(where, `unknown key "${key}"`);
}

function folderOf(pkg) {
  const m = /^@([^/]+)\/(.+)$/.exec(pkg);
  if (!m) return pkg;
  return m[1] === "penguinharness" ? m[2] : `${m[1]}__${m[2]}`;
}

function names(value, key) {
  if (!Array.isArray(value) || !value.every((n) => typeof n === "string" && PACKAGE.test(n))) {
    fail(key, "must be a list of npm package names");
    return [];
  }
  if (new Set(value).size !== value.length) fail(key, "names a package twice");
  return value;
}

// Every path the document names, with the role that sets its size and budget.
const named = new Map();

function asset(value, where, pkg, role) {
  if (typeof value !== "string" || !ASSET.test(value) || value.startsWith("/")) {
    return fail(where, `must be a lower-case relative path ending in .webp, .png or .jpg, got ${JSON.stringify(value)}`);
  }
  if (value.split("/").some((part) => part === "" || part === "." || part === "..")) {
    return fail(where, `has an empty, "." or ".." segment: ${value}`);
  }
  const folder = folderOf(pkg);
  if (value.split("/")[0] !== folder) fail(where, `must be under ${folder}/, got ${value}`);
  if (named.has(value)) fail(where, `${value} is named twice`);
  named.set(value, { role, where });
}

function caption(value, where) {
  if (typeof value !== "string" || value.trim() === "") return fail(where, "must be a non-empty string");
  if ([...value].length > 80) fail(where, `is ${[...value].length} characters, at most 80`);
}

// The popularity block: placeholder numbers today, a real install-count API's ("live") later.
function popularity(value) {
  if (!isRecord(value)) return fail("popularity", "must be an object { source, generatedAt, items }");
  unknownKeys(value, POPULARITY_KEYS, "popularity");
  if (!POPULARITY_SOURCES.has(value.source)) {
    fail("popularity.source", `must be "placeholder" or "live", got ${JSON.stringify(value.source)}`);
  }
  if (typeof value.generatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.generatedAt) || Number.isNaN(Date.parse(value.generatedAt))) {
    fail("popularity.generatedAt", "must be an ISO date (YYYY-MM-DD)");
  }
  if (!isRecord(value.items)) return fail("popularity.items", "must be an object keyed by npm package name");
  const count = (n) => Number.isSafeInteger(n) && n >= 0;
  for (const [pkg, item] of Object.entries(value.items)) {
    const at = `popularity.items["${pkg}"]`;
    if (!PACKAGE.test(pkg)) fail(at, "key is not an npm package name");
    if (!isRecord(item)) {
      fail(at, "must be an object { installs, weekly }");
      continue;
    }
    unknownKeys(item, new Set(["installs", "weekly"]), at);
    if (!count(item.installs)) fail(`${at}.installs`, "must be a non-negative integer");
    if (!count(item.weekly)) fail(`${at}.weekly`, "must be a non-negative integer");
    else if (count(item.installs) && item.weekly > item.installs) fail(`${at}.weekly`, "is more than installs");
  }
}

function readDocument() {
  let doc;
  try {
    doc = JSON.parse(readFileSync(DOC, "utf8"));
  } catch (e) {
    fail(DOC, `does not parse: ${e.message}`);
    return;
  }
  if (!isRecord(doc)) return fail(DOC, "must be an object");
  unknownKeys(doc, DOC_KEYS, "market.json");
  if (doc.schema !== 1) fail("schema", `must be 1, got ${JSON.stringify(doc.schema)}`);
  if (typeof doc.updated !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(doc.updated) || Number.isNaN(Date.parse(doc.updated))) {
    fail("updated", "must be an ISO date (YYYY-MM-DD); bump it whenever a picture changes");
  }
  const hero = names(doc.hero, "hero");
  const selected = names(doc.selected, "selected");
  if (hero.length < 1 || hero.length > 5) fail("hero", `names ${hero.length} packages, 1 to 5`);
  if (selected.length > 12) fail("selected", `names ${selected.length} packages, at most 12`);
  for (const n of hero) if (!selected.includes(n)) fail("hero", `${n} is not in selected`);
  if (doc.popularity !== undefined) popularity(doc.popularity);

  if (!isRecord(doc.plugins)) return fail("plugins", "must be an object keyed by npm package name");
  for (const [pkg, entry] of Object.entries(doc.plugins)) {
    const at = `plugins["${pkg}"]`;
    if (!PACKAGE.test(pkg)) fail(at, "key is not an npm package name");
    if (!isRecord(entry)) {
      fail(at, "must be an object");
      continue;
    }
    unknownKeys(entry, ENTRY_KEYS, at);
    if (!isRecord(entry.cover)) fail(`${at}.cover`, "must be an object with a src");
    else {
      unknownKeys(entry.cover, COVER_KEYS, `${at}.cover`);
      asset(entry.cover.src, `${at}.cover.src`, pkg, "cover");
      if (entry.cover.thumb !== undefined) asset(entry.cover.thumb, `${at}.cover.thumb`, pkg, "coverThumb");
      if (entry.cover.tone !== undefined && !/^#[0-9a-f]{6}$/i.test(String(entry.cover.tone))) {
        fail(`${at}.cover.tone`, "must be a #rrggbb colour");
      }
    }
    if (entry.icon !== undefined) asset(entry.icon, `${at}.icon`, pkg, "icon");
    if (entry.screenshots !== undefined) {
      if (!Array.isArray(entry.screenshots)) fail(`${at}.screenshots`, "must be a list");
      else {
        if (entry.screenshots.length > 6) fail(`${at}.screenshots`, `has ${entry.screenshots.length}, at most 6`);
        entry.screenshots.forEach((shot, i) => {
          const sat = `${at}.screenshots[${i}]`;
          if (!isRecord(shot)) return fail(sat, "must be an object with a src");
          unknownKeys(shot, SHOT_KEYS, sat);
          asset(shot.src, `${sat}.src`, pkg, "shot");
          if (shot.thumb !== undefined) asset(shot.thumb, `${sat}.thumb`, pkg, "shotThumb");
          if ((shot.caption === undefined) !== (shot.captionZh === undefined)) fail(sat, "needs both caption and captionZh, or neither");
          if (shot.caption !== undefined) caption(shot.caption, `${sat}.caption`);
          if (shot.captionZh !== undefined) caption(shot.captionZh, `${sat}.captionZh`);
        });
      }
    }
  }
  return doc;
}

// The format, size and animation of an image, read from its bytes.
function probe(buf) {
  const ascii = (at, n) => buf.toString("latin1", at, at + n);
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.readUInt32BE(4) === 0x0d0a1a0a) {
    let animated = false;
    for (let at = 8; at + 8 <= buf.length; ) {
      const len = buf.readUInt32BE(at);
      const type = ascii(at + 4, 4);
      if (type === "acTL") animated = true;
      if (type === "IDAT" || type === "IEND") break;
      at += 12 + len;
    }
    return { format: "png", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), animated };
  }
  if (buf.length > 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    const chunk = ascii(12, 4);
    if (chunk === "VP8 ") return { format: "webp", width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff, animated: false };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { format: "webp", width: (b & 0x3fff) + 1, height: ((b >>> 14) & 0x3fff) + 1, animated: false };
    }
    if (chunk === "VP8X") {
      return { format: "webp", width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1, animated: (buf[20] & 0x02) !== 0 };
    }
    return { format: "webp?", width: 0, height: 0, animated: false };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    for (let at = 2; at + 9 < buf.length; ) {
      if (buf[at] !== 0xff) return { format: "jpg?", width: 0, height: 0, animated: false };
      const marker = buf[at + 1];
      const sof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (sof) return { format: "jpg", width: buf.readUInt16BE(at + 7), height: buf.readUInt16BE(at + 5), animated: false };
      at += 2 + buf.readUInt16BE(at + 2);
    }
    return { format: "jpg?", width: 0, height: 0, animated: false };
  }
  return { format: "unknown", width: 0, height: 0, animated: false };
}

function checkFiles() {
  let bytes = 0;
  for (const [rel, { role, where }] of named) {
    const file = path.join(ROOT, rel);
    let buf;
    try {
      buf = readFileSync(file);
    } catch {
      fail(where, `${rel} does not exist`);
      continue;
    }
    bytes += buf.length;
    const [w, h, budget] = ROLES[role];
    const img = probe(buf);
    const ext = path.extname(rel).slice(1);
    if (img.format !== ext) fail(where, `${rel} holds ${img.format} bytes, not ${ext}`);
    if (img.animated) fail(where, `${rel} is animated`);
    if (img.width !== w || img.height !== h) fail(where, `${rel} is ${img.width}x${img.height}, must be ${w}x${h}`);
    if (buf.length > budget) fail(where, `${rel} is ${buf.length} bytes, over the ${budget}-byte budget`);
  }
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      const rel = path.relative(ROOT, abs).split(path.sep).join("/");
      if (entry.isDirectory()) walk(abs);
      else if (!(dir === ROOT && OWN_FILES.has(entry.name)) && !named.has(rel)) fail(rel, "is not named by market.json; remove it or name it");
    }
  };
  walk(ROOT);
  return bytes;
}

if (!statSync(ROOT, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`check-plugin-assets: no folder at ${ROOT}`);
  process.exit(2);
}
const doc = readDocument();
const bytes = doc ? checkFiles() : 0;
if (problems.length > 0) {
  for (const p of problems) console.error(`  ${p}`);
  console.error(`check-plugin-assets: ${problems.length} problem${problems.length === 1 ? "" : "s"} in ${ROOT}`);
  process.exit(1);
}
const entries = Object.values(doc.plugins);
const covers = entries.filter((e) => e.cover).length;
const shots = entries.reduce((n, e) => n + (e.screenshots?.length ?? 0), 0);
console.log(
  `check-plugin-assets: ok, ${entries.length} plugins, ${covers} covers, ${shots} screenshots, ${named.size} files, ${bytes} bytes; ` +
    `${doc.selected.length} selected, ${doc.hero.length} may lead` +
    (doc.popularity ? `; popularity (${doc.popularity.source}) for ${Object.keys(doc.popularity.items).length}` : ""),
);

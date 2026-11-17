# Plugin market pictures

[中文](README.zh.md)

This folder holds the covers and screenshots of the PenguinHarness plugin market (the Plugins page of the app and [penguin.ooo/plugins](https://penguin.ooo/plugins/)), and `market.json`, the document that names them and records the maintainers' selection. A server fetches the document from this repository, checks it, and serves the pictures to its own app; each release also embeds a copy, which stands in while the published one cannot be reached. A plugin the document does not name still lists, with a cover the app draws from its name and icon.

## Layout

```
market.json                   the market document
<folder>/cover.webp           cover, 1280x720
<folder>/cover-640.webp       its thumbnail, 640x360
<folder>/shot-<n>.webp        screenshot n, 1600x1000
<folder>/shot-<n>-640.webp    its thumbnail, 640x400
<folder>/icon.png             optional, 256x256
```

`<folder>` is the package's unscoped name for `@penguinharness/*` (`a2ui/`) and `<scope>__<name>` for any other scope (`@acme/notes` → `acme__notes/`).

## The document

```json
{
  "schema": 1,
  "updated": "2026-11-17",
  "hero": ["@penguinharness/a2ui"],
  "selected": ["@penguinharness/a2ui", "@penguinharness/goal"],
  "plugins": {
    "@penguinharness/a2ui": {
      "cover": { "src": "a2ui/cover.webp", "thumb": "a2ui/cover-640.webp", "tone": "#745fac" },
      "screenshots": [
        {
          "src": "a2ui/shot-1.webp",
          "thumb": "a2ui/shot-1-640.webp",
          "caption": "A live weather card drawn inside the reply, with hourly and daily forecasts.",
          "captionZh": "回复里直接画出天气卡片，附逐小时与未来几天的预报。"
        }
      ]
    }
  }
}
```

- **Keys** are npm package names, never bare plugin names: two scopes may share one.
- **`selected`**: the maintainers' selection, in display order, at most 12. **`hero`**: the selected plugins that may lead the carousel, in turn order, 1 to 5, each also in `selected`. A name that no server lists is skipped.
- **`plugins`**: per package, a `cover` (`src` required; `thumb` and `tone`, the cover's field colour as `#rrggbb`, optional), an optional `icon`, and up to 6 `screenshots` (`src` required; `thumb` and the two captions optional). `icon` is drawn only for a plugin that is listed by the index and not yet installed, which has no icon of its own on the server.
- **Paths** are relative to this folder, lower-case `[a-z0-9._/-]`, inside the package's own folder, and end in `.webp`, `.png` or `.jpg`.
- **`updated`** is the date of the last edit. Servers fold it into each picture's cache key, so change it whenever a picture changes; `to-webp.py` does.
- Nothing in the document is a count, a rank or a rating, and there is no field for one.

A reader ignores keys it does not know. A document whose `schema` is not 1, or that fails these rules, is not used at all, and the copy embedded in the release stands.

## Pictures

| Kind | Ratio | Published file | Thumbnail | Budget |
| --- | --- | --- | --- | --- |
| Cover | 16:9 | 1280×720, WebP q≈82 | 640×360, WebP q≈80 | ≤ 150 KB / ≤ 45 KB |
| Screenshot | 16:10 | 1600×1000, WebP q≈82 | 640×400, WebP q≈80 | ≤ 300 KB / ≤ 45 KB |
| Icon (optional) | 1:1 | 256×256 PNG, transparent ground, drawn in the cover's field colour | — | ≤ 30 KB |

- WebP (preferred), PNG or JPEG, sRGB, not animated. No SVG and no GIF: servers serve these files as their own images and read the type from the bytes. KB is 1,000 bytes.
- **Covers carry no words**, so one picture serves every language; the app writes the title under the cover. Lettering is language-neutral only: an acronym, a prompt sign, digits that are not results. Keep the key art inside the centre 80 %. No score, download count or "No. 1" on a cover.
- **Screenshots are real**: the plugin's own UI as it runs, at 1600×1000 (an 800×500 viewport at device scale 2 is the easy way), in the Frost light theme unless the plugin is about a theme. A workbench plugin's first screenshot is its workbench.
- **Captions**: one sentence each, at most 80 characters, in both languages or neither.

## Selected plugins

"Selected" (精选) is an editorial choice by the maintainers, never a popularity ranking: the UI word is never "hot", "top" or "trending". A plugin is selected when:

- it works out of the box on a fresh install;
- it has a quick start that shows its point in one prompt;
- it has real screenshots;
- it is maintained: its dated versions move;
- and the selection as a whole covers the categories.

There is no popularity board because nothing measures a plugin's popularity honestly today: the bundled plugins are dependencies of the server and the CLI, so npm counts every install of the product equally for all of them; they share one GitHub repository, so stars say nothing about one of them; and servers send no telemetry. The market shows what is real instead: how many of the Project's own agents use a plugin, and how recent its versions are.

## Asking to be listed

Open a pull request against this repository that adds your package's folder with its cover (and screenshots, if any), its entry under `plugins` in `market.json`, and, if your package is not bundled with PenguinHarness, an `icon.png`. The check below must pass. Say in the pull request if you would like the plugin to be selected; the maintainers decide by the criteria above.

## Making covers

Covers form one family in four series, on a flat field of one hue (`oklch(54% 0.12 H)` for the hues the app tints with) with white line work, the plugin's own icon blown up as the only background motif, and the product mark bottom left:

| Series | For | Picture |
| --- | --- | --- |
| A, drawn scene | most plugins | a simple vector scene of what the plugin does |
| B, lettering | RSI toolkits | the method's name as giant lettering behind a loop of versions |
| C, real UI | workbench plugins and plugins whose output is UI | a real screenshot in a window, bleeding off the edge |
| D, emblem | sandbox backends | a slate field, one emblem |

The pipeline in [`scripts/plugin-covers/`](../../scripts/plugin-covers) renders them. It runs by hand, not in CI, and needs an installed PenguinHarness checkout (for Playwright, the lettering face and the product mark), Node and Python 3 with Pillow:

```sh
cd scripts/plugin-covers
# 1600x900 masters from template/art.json and template/scenes/; also writes each field colour
node render.mjs --plugins <harness checkout>/plugins --art template/art.json --out <tmp>
# 1600x1000 screenshot masters cut from assets/blog-assets/ by template/shots.json
python3 cut-shots.py template/shots.json --out <tmp>
# the published sizes within budget, written into market.json with their tone
python3 to-webp.py <tmp> --into ../../assets/plugins/
# a contact sheet on white and on near-black, to look at every cover before committing
node sheet.mjs ../../assets/plugins <out-prefix> --match '^cover\.webp$' --root <harness checkout>
```

`render.mjs --icons` also rasterises each plugin's `icon.svg` into `icon.png`; `--plugins` may point at another repository's plugin folders. A plugin that brings its own masters (a `cover.png` of 1600×900, `shot-<n>.png` of 1600×1000) puts them in `<tmp>/<folder>/` and runs `to-webp.py` alone. Masters are never committed.

## Checks

`node scripts/check-plugin-assets.mjs` checks the document against the rules above and every file against its size, format and budget, and fails on any file in this folder the document does not name. It runs on every pull request that touches this folder.

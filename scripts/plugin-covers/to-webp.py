#!/usr/bin/env python3
"""Publish rendered masters into assets/plugins/ and write them into the market document.

    python3 to-webp.py <masters> --into assets/plugins/ [--market <file>] [--only id,id]

<masters> holds one folder per plugin, named like its folder under assets/plugins/
(`<unscoped name>` for @penguinharness/*, `<scope>__<name>` for anyone else). Each may hold:

    cover.png     1600x900 master (render.mjs)  -> cover.webp      1280x720  q82  <= 150 KB
                                                   cover-640.webp   640x360  q80  <=  45 KB
    shot-<n>.png  1600x1000 master (cut-shots.py) -> shot-<n>.webp  1600x1000 q82  <= 300 KB
                                                   shot-<n>-640.webp 640x400 q80  <=  45 KB
    icon.png      256x256, transparent (render.mjs --icons) -> icon.png       <=  30 KB
    meta.json     { "tone": "#rrggbb" } from render.mjs: the cover's field colour

KB here is 1000 bytes. A WebP over budget is re-encoded with the quality lowered in steps of 4
until it fits (never below 40); every step is printed. Exits 1 if anything is still over budget
or a master has the wrong size.

The market document (default <into>/market.json; created when missing) gets, per plugin
written: `cover` = { src, thumb, tone }, where tone is meta.json's field colour, else the
master's top-left pixel (always bare field); `screenshots[i].src/thumb` for each shot master,
keeping the captions already there by position (a plugin with shot masters gets exactly that
many entries); `icon` when an icon master exists. `updated` becomes today's date, which the
server folds into each picture's cache key, so a changed picture is fetched again. `hero`,
`selected` and the captions are edited by hand.

Needs Pillow (11.x tested).
"""

import argparse
import datetime
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

STEP = 4
FLOOR = 40
FIELD_PIXEL = (8, 8)
COVER = {"master": (1600, 900), "full": ((1280, 720), 82, 150_000), "thumb": ((640, 360), 80, 45_000)}
SHOT = {"master": (1600, 1000), "full": ((1600, 1000), 82, 300_000), "thumb": ((640, 400), 80, 45_000)}
ICON = {"master": (256, 256), "budget": 30_000}
SHOT_NAME = re.compile(r"^shot-([1-9][0-9]*)\.png$")
DIR_NAME = re.compile(r"^[a-z0-9][a-z0-9._-]*$")
MAX_SHOTS = 6


def package_of(folder: str) -> str:
    """The npm package a folder under assets/plugins/ belongs to (the convention in README.md)."""
    if "__" in folder:
        scope, name = folder.split("__", 1)
        return f"@{scope}/{name}"
    return f"@penguinharness/{folder}"


def hex_of(rgb) -> str:
    return "#" + "".join(f"{v:02x}" for v in rgb[:3])


def encode_webp(master: Image.Image, dest: Path, size, quality: int, budget: int, label: str) -> tuple[int, bool]:
    img = master if master.size == size else master.resize(size, Image.Resampling.LANCZOS)
    q = quality
    while True:
        img.save(dest, "WEBP", quality=q, method=6)
        n = dest.stat().st_size
        if n <= budget or q - STEP < FLOOR:
            break
        print(f"{label:26} {dest.name:18} {q:>3} {n:>8} {budget:>8}  over budget, lowering quality")
        q -= STEP
    ok = n <= budget
    note = "" if q == quality else f"lowered from q{quality}"
    print(f"{label:26} {dest.name:18} {q:>3} {n:>8} {budget:>8}  {note if ok else 'STILL OVER BUDGET'}")
    return n, ok


def load_market(path: Path) -> dict:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"schema": 1, "updated": "", "hero": [], "selected": [], "plugins": {}}


def main() -> int:
    ap = argparse.ArgumentParser(description="Publish plugin cover, screenshot and icon masters.")
    ap.add_argument("masters", type=Path)
    ap.add_argument("--into", type=Path, required=True, help="assets/plugins/")
    ap.add_argument("--market", type=Path, help="the market document (default: <into>/market.json)")
    ap.add_argument("--only", help="comma-separated folder names")
    args = ap.parse_args()

    only = set(args.only.split(",")) if args.only else None
    folders = sorted(
        d for d in args.masters.iterdir() if d.is_dir() and (only is None or d.name in only)
    )
    if not folders:
        print(f"to-webp.py: no plugin folders under {args.masters}", file=sys.stderr)
        return 2
    market_path = args.market or args.into / "market.json"
    market = load_market(market_path)
    plugins = market.setdefault("plugins", {})

    failures = 0
    written = 0
    print(f"{'plugin':26} {'file':18} {'q':>3} {'bytes':>8} {'budget':>8}  note")
    for src in folders:
        name = src.name
        if not DIR_NAME.match(name):
            print(f"  ! {name}: not a valid folder name (lower-case [a-z0-9._-], `scope__name` for a scope)")
            failures += 1
            continue
        dest = args.into / name
        cover_png = src / "cover.png"
        shots = sorted(
            ((int(m.group(1)), p) for p in src.iterdir() if (m := SHOT_NAME.match(p.name))),
            key=lambda t: t[0],
        )
        icon_png = src / "icon.png"
        if not cover_png.exists() and not shots and not icon_png.exists():
            continue
        if shots and [n for n, _ in shots] != list(range(1, len(shots) + 1)):
            print(f"  ! {name}: shot masters must be numbered 1..n without gaps")
            failures += 1
            continue
        if len(shots) > MAX_SHOTS:
            print(f"  ! {name}: {len(shots)} screenshots, at most {MAX_SHOTS}")
            failures += 1
            continue
        dest.mkdir(parents=True, exist_ok=True)
        entry = plugins.setdefault(package_of(name), {})

        if cover_png.exists():
            master = Image.open(cover_png).convert("RGB")
            if master.size != COVER["master"]:
                print(f"  ! {cover_png} is {master.size[0]}x{master.size[1]}, expected 1600x900")
                failures += 1
            else:
                meta_path = src / "meta.json"
                meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
                pixel = hex_of(master.getpixel(FIELD_PIXEL))
                tone = (meta.get("tone") or pixel).lower()
                if tone != pixel:
                    print(f"  ! {name}: meta.json tone {tone} but the master's field pixel is {pixel}")
                full, f_ok = encode_webp(master, dest / "cover.webp", *COVER["full"], name)
                thumb, t_ok = encode_webp(master, dest / "cover-640.webp", *COVER["thumb"], name)
                failures += (not f_ok) + (not t_ok)
                entry["cover"] = {"src": f"{name}/cover.webp", "thumb": f"{name}/cover-640.webp", "tone": tone}
                meta.update({"tone": tone, "bytes": full, "thumbBytes": thumb})
                meta_path.write_text(json.dumps(meta, indent=2) + "\n")
                written += 1

        if icon_png.exists():
            icon = Image.open(icon_png).convert("RGBA")
            if icon.size != ICON["master"]:
                print(f"  ! {icon_png} is {icon.size[0]}x{icon.size[1]}, expected 256x256")
                failures += 1
            else:
                out = dest / "icon.png"
                icon.save(out, "PNG", optimize=True)
                if icon_png.stat().st_size < out.stat().st_size:
                    shutil.copyfile(icon_png, out)  # the renderer's own PNG was smaller
                n = out.stat().st_size
                ok = n <= ICON["budget"]
                failures += not ok
                print(f"{name:26} {'icon.png':18} {'-':>3} {n:>8} {ICON['budget']:>8}  {'' if ok else 'OVER BUDGET'}")
                entry["icon"] = f"{name}/icon.png"
                written += 1

        if shots:
            old = entry.get("screenshots") or []
            new = []
            for i, (n, png) in enumerate(shots):
                master = Image.open(png).convert("RGB")
                if master.size != SHOT["master"]:
                    print(f"  ! {png} is {master.size[0]}x{master.size[1]}, expected 1600x1000")
                    failures += 1
                    continue
                _, f_ok = encode_webp(master, dest / f"shot-{n}.webp", *SHOT["full"], name)
                _, t_ok = encode_webp(master, dest / f"shot-{n}-640.webp", *SHOT["thumb"], name)
                failures += (not f_ok) + (not t_ok)
                kept = {k: v for k, v in (old[i] if i < len(old) else {}).items() if k not in ("src", "thumb")}
                new.append({"src": f"{name}/shot-{n}.webp", "thumb": f"{name}/shot-{n}-640.webp", **kept})
                written += 1
            entry["screenshots"] = new

        # Keep each entry's keys in one order: cover, icon, screenshots, then anything else.
        order = ["cover", "icon", "screenshots"]
        plugins[package_of(name)] = {k: entry[k] for k in order if k in entry} | {
            k: v for k, v in entry.items() if k not in order
        }

    if written:
        market["updated"] = datetime.date.today().isoformat()
        head = {k: market[k] for k in ("schema", "updated", "hero", "selected") if k in market}
        doc = head | {k: v for k, v in market.items() if k not in head}
        market_path.parent.mkdir(parents=True, exist_ok=True)
        market_path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {written} picture sets into {args.into} and {market_path}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

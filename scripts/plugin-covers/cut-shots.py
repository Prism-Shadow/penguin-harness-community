#!/usr/bin/env python3
"""Cut 1600x1000 screenshot masters out of real product screenshots.

    python3 cut-shots.py template/shots.json --out <tmp> [--only id,id]

template/shots.json names, per plugin folder, its screenshots in display order:

    { "source": "../../../assets/blog-assets",
      "shots": { "a2ui": [ { "from": "penguinharness-0-2-14-a2ui-widgets-zh.png",
                             "crop": [x, y, w, h] }, ... ] } }

`source` is relative to the JSON file; `from` is relative to `source`. `crop` is a rectangle in
source pixels. Without `pad`, the crop must be 16:10 (within 1 %) and is scaled to 1600x1000.
With `pad` (a #rrggbb colour, or "auto" for the crop's top-left pixel), the crop is scaled by
`scale` (default 1, so a small source is never blown up) and centred on a 1600x1000 canvas of
that colour: the way to show a dialog or a narrow panel without upscaling it.

Writes <out>/<id>/shot-<n>.png, then `python3 to-webp.py <out> --into assets/plugins/`
publishes them. Captions are written by hand in market.json; to-webp.py keeps them by position.

Needs Pillow (11.x tested).
"""

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

W, H = 1600, 1000


def flatten(img: Image.Image) -> Image.Image:
    """RGB, with any transparency laid over white (a bare convert would turn it black)."""
    rgba = img.convert("RGBA")
    ground = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
    return Image.alpha_composite(ground, rgba).convert("RGB")


def cut(src: Image.Image, spec: dict) -> Image.Image:
    x, y, w, h = spec["crop"]
    if x < 0 or y < 0 or x + w > src.width or y + h > src.height:
        raise ValueError(f"crop {spec['crop']} leaves the {src.width}x{src.height} source")
    region = src.crop((x, y, x + w, y + h))
    pad = spec.get("pad")
    if pad is None:
        if abs((w / h) / (W / H) - 1) > 0.01:
            raise ValueError(f"crop {w}x{h} is not 16:10; give a 16:10 crop or a pad colour")
        return region.resize((W, H), Image.Resampling.LANCZOS)
    k = float(spec.get("scale", 1))
    size = (round(w * k), round(h * k))
    if size[0] > W or size[1] > H:
        raise ValueError(f"crop {w}x{h} at scale {k} is {size[0]}x{size[1]}, larger than {W}x{H}")
    if size != (w, h):
        region = region.resize(size, Image.Resampling.LANCZOS)
    if pad == "auto":
        pad = region.getpixel((0, 0))
    canvas = Image.new("RGB", (W, H), pad)
    canvas.paste(region, ((W - size[0]) // 2, (H - size[1]) // 2))
    return canvas


def main() -> int:
    ap = argparse.ArgumentParser(description="Cut 1600x1000 screenshot masters.")
    ap.add_argument("spec", type=Path)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--only", help="comma-separated plugin folders")
    args = ap.parse_args()

    doc = json.loads(args.spec.read_text(encoding="utf-8"))
    source = (args.spec.parent / doc["source"]).resolve()
    only = set(args.only.split(",")) if args.only else None
    failures = 0
    for folder, shots in doc["shots"].items():
        if only is not None and folder not in only:
            continue
        out = args.out / folder
        out.mkdir(parents=True, exist_ok=True)
        for old in out.glob("shot-*.png"):
            old.unlink()
        for n, spec in enumerate(shots, start=1):
            file = source / spec["from"]
            try:
                img = cut(flatten(Image.open(file)), spec)
            except (OSError, ValueError) as e:
                print(f"  ! {folder} shot-{n} ({spec['from']}): {e}")
                failures += 1
                continue
            dest = out / f"shot-{n}.png"
            img.save(dest, "PNG")
            print(f"{folder:24} shot-{n}.png  from {spec['from']}  crop {spec['crop']}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

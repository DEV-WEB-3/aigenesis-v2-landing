"""Extract individual Genesis Token Core layers from the sprite sheet."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

SRC = Path(
    r"C:\Users\Richard\.cursor\projects\c-Users-Richard-Documents-aigenesis-iov2\assets"
    r"\c__Users_Richard_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_ChatGPT_Image_13_jun_2026__13_01_11-fa0794e8-9fc5-4121-a0b0-485574ddf561.png"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "genesis-token-core"

# [left, top, right, bottom] in source pixels (1024x682 sheet)
REGIONS: dict[str, tuple[int, int, int, int]] = {
    "genesis-core-logo": (8, 72, 248, 268),
    "genesis-inner-ring": (264, 72, 504, 268),
    "genesis-mid-ring": (520, 72, 760, 268),
    "genesis-outer-ring": (776, 72, 1016, 268),
    "genesis-radial-bars": (8, 284, 248, 480),
    "genesis-sparks": (264, 284, 504, 480),
    "genesis-particles": (520, 284, 760, 480),
    "genesis-ambient-glow": (776, 284, 1016, 480),
    "genesis-center-c": (8, 496, 248, 676),
}


def is_background(r: int, g: int, b: int) -> bool:
    spread = max(r, g, b) - min(r, g, b)
    avg = (r + g + b) / 3
    if spread > 18:
        return avg < 12
    return 18 <= avg <= 96


def remove_background(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (r, g, b, 0)
    return rgba


def trim(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    return im.crop(bbox)


def save_asset(name: str, box: tuple[int, int, int, int]) -> dict:
    im = Image.open(SRC).crop(box)
    im = remove_background(im)
    im = trim(im)

    # Normalize to square canvas for consistent layering
    size = max(im.size)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ox = (size - im.width) // 2
    oy = (size - im.height) // 2
    canvas.paste(im, (ox, oy), im)

    png_path = OUT / f"{name}.png"
    webp_path = OUT / f"{name}.webp"
    png2x_path = OUT / f"{name}@2x.png"
    webp2x_path = OUT / f"{name}@2x.webp"

    # @1x — max 512 for rings, 640 for glow
    max_1x = 640 if "ambient" in name else 512
    scale_1x = min(1, max_1x / size)
    one_x = canvas.resize(
        (max(1, int(canvas.width * scale_1x)), max(1, int(canvas.height * scale_1x))),
        Image.Resampling.LANCZOS,
    )
    one_x.save(png_path, optimize=True, compress_level=9)
    one_x.save(webp_path, format="WEBP", quality=88, method=6)

    # @2x — full extracted resolution capped at 1024
    max_2x = min(size, 1024)
    if size > max_2x:
        two_x = canvas.resize((max_2x, max_2x), Image.Resampling.LANCZOS)
    else:
        two_x = canvas
    two_x.save(png2x_path, optimize=True, compress_level=9)
    two_x.save(webp2x_path, format="WEBP", quality=90, method=6)

    return {
        "name": name,
        "sourceBox": box,
        "size1x": one_x.size,
        "size2x": two_x.size,
        "pngBytes": png_path.stat().st_size,
        "webpBytes": webp_path.stat().st_size,
        "png2xBytes": png2x_path.stat().st_size,
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = [save_asset(name, box) for name, box in REGIONS.items()]
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    for m in manifest:
        print(
            f"{m['name']}: png={m['pngBytes']//1024}KB webp={m['webpBytes']//1024}KB "
            f"2x={m['png2xBytes']//1024}KB"
        )


if __name__ == "__main__":
    main()

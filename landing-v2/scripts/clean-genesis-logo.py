"""
Limpia el isotipo GENESIS oficial: elimina fondo negro y artefactos.
No altera geometría ni degradado — solo transparencia.
"""
from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "brand" / "genesis-mark.png"
OUT_PNG = ROOT / "public" / "brand" / "logo-genesis-clean.png"
OUT_SVG = ROOT / "public" / "brand" / "logo-genesis-clean.svg"

# Resolución export (ancho objetivo, mantiene aspecto)
TARGET_WIDTH = 1024


def rgb_to_hsv(r: np.ndarray, g: np.ndarray, b: np.ndarray):
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin
    sat = np.where(cmax > 1e-6, delta / cmax, 0.0)
    val = cmax / 255.0
    return sat, val, cmax


def flood_background(mask: np.ndarray) -> np.ndarray:
    """Marca negro conectado a bordes como fondo."""
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    bg = mask.copy()

    def neighbors(y: int, x: int):
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w:
                yield ny, nx

    stack: list[tuple[int, int]] = []
    for x in range(w):
        stack.append((0, x))
        stack.append((h - 1, x))
    for y in range(h):
        stack.append((y, 0))
        stack.append((y, w - 1))

    while stack:
        y, x = stack.pop()
        if visited[y, x] or not bg[y, x]:
            continue
        visited[y, x] = True
        for ny, nx in neighbors(y, x):
            if not visited[ny, nx] and bg[ny, nx]:
                stack.append((ny, nx))

    return visited


def remove_isolated_noise(alpha: np.ndarray, cx: float, cy: float, min_dist: float) -> np.ndarray:
    """Elimina píxeles sueltos en esquinas (artefactos de compresión)."""
    h, w = alpha.shape
    out = alpha.copy()
    ys, xs = np.where(alpha > 0)
    for y, x in zip(ys, xs):
        dist = math.hypot(x - cx, y - cy)
        if dist < min_dist:
            continue
        # contar vecinos opacos en ventana 5x5
        y0, y1 = max(0, y - 2), min(h, y + 3)
        x0, x1 = max(0, x - 2), min(w, x + 3)
        patch = alpha[y0:y1, x0:x1]
        if np.count_nonzero(patch > 128) <= 2:
            out[y, x] = 0
    return out


def clean_rgba(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    data = np.array(im, dtype=np.float32)
    r, g, b, a = data[..., 0], data[..., 1], data[..., 2], data[..., 3]

    sat, val, cmax = rgb_to_hsv(r, g, b)

    # Fondo: oscuro y poco saturado
    dark = cmax < 22
    muted = (cmax < 42) & (sat < 0.14)
    bg_seed = dark | muted

    bg_connected = flood_background(bg_seed.astype(bool))

    # Alpha: conservar color del logo, desvanecer halos oscuros
    alpha = np.where(bg_connected, 0.0, 255.0)

    # Transición suave en bordes (sin halo negro)
    fringe = (~bg_connected) & (cmax < 58)
    alpha[fringe] = np.clip((cmax[fringe] - 20.0) / 38.0 * 255.0, 0.0, 255.0)

    # Reforzar píxeles claramente coloreados
    vivid = (sat > 0.18) & (cmax > 40)
    alpha[vivid] = 255.0

    alpha = remove_isolated_noise(alpha.astype(np.uint8), w / 2, h / 2, min(w, h) * 0.42)

    out = np.zeros_like(data, dtype=np.uint8)
    out[..., 0] = r.astype(np.uint8)
    out[..., 1] = g.astype(np.uint8)
    out[..., 2] = b.astype(np.uint8)
    out[..., 3] = alpha.astype(np.uint8)

    result = Image.fromarray(out, "RGBA")
    # Ligero sharpen post-upscale (se aplica después del resize)
    return result


def upscale(im: Image.Image, target_width: int) -> Image.Image:
    w, h = im.size
    scale = target_width / w
    new_h = max(1, int(round(h * scale)))
    return im.resize((target_width, new_h), Image.Resampling.LANCZOS)


def write_svg_from_png(png_path: Path, svg_path: Path, width: int, height: int) -> None:
    """SVG contenedor con imagen embebida (misma geometría, fondo transparente)."""
    import base64

    raw = png_path.read_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none">
  <image width="{width}" height="{height}" href="data:image/png;base64,{b64}" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    svg_path.write_text(svg, encoding="utf-8")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source not found: {SRC}")

    cleaned = clean_rgba(Image.open(SRC))
    hi = upscale(cleaned, TARGET_WIDTH)
    hi = hi.filter(ImageFilter.UnsharpMask(radius=1.2, percent=90, threshold=2))

    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    hi.save(OUT_PNG, format="PNG", optimize=True)

    w, h = hi.size
    write_svg_from_png(OUT_PNG, OUT_SVG, w, h)

    # Validación rápida
    arr = np.array(hi)
    corners = [
        arr[0:8, 0:8, 3],
        arr[0:8, -8:, 3],
        arr[-8:, 0:8, 3],
        arr[-8:, -8:, 3],
    ]
    corner_alpha_max = max(c.max() for c in corners)
    opaque = arr[..., 3] > 128
    print(f"Saved: {OUT_PNG} ({w}x{h})")
    print(f"Saved: {OUT_SVG}")
    print(f"Corner max alpha: {corner_alpha_max} (expect 0)")
    print(f"Opaque pixels: {opaque.sum()} / {opaque.size}")


if __name__ == "__main__":
    main()

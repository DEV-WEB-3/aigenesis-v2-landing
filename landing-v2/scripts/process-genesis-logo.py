"""Procesa el logo oficial GENESIS (WhatsApp) — fondo gris → transparente."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\Richard\.cursor\projects\c-Users-Richard-Documents-aigenesis-iov2\assets"
    r"\c__Users_Richard_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_"
    r"WhatsApp_Image_2026-06-10_at_4.52.53_AM-94233fd4-8179-4534-9133-f83f78a2a263.png"
)
BRAND = ROOT / "public" / "brand"


def flood_light_bg(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    bg = mask.copy()
    stack: list[tuple[int, int]] = []
    for x in range(w):
        stack.extend([(0, x), (h - 1, x)])
    for y in range(h):
        stack.extend([(y, 0), (y, w - 1)])

    while stack:
        y, x = stack.pop()
        if visited[y, x] or not bg[y, x]:
            continue
        visited[y, x] = True
        if y > 0 and not visited[y - 1, x]:
            stack.append((y - 1, x))
        if y < h - 1 and not visited[y + 1, x]:
            stack.append((y + 1, x))
        if x > 0 and not visited[y, x - 1]:
            stack.append((y, x - 1))
        if x < w - 1 and not visited[y, x + 1]:
            stack.append((y, x + 1))
    return visited


def remove_background(im: Image.Image) -> Image.Image:
    rgb = np.array(im.convert("RGB"), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    sat = np.where(cmax > 0, (cmax - cmin) / cmax, 0)

    # Fondo gris claro (#F7F7F7 aprox.) conectado a bordes
    light = (cmax > 195) & (sat < 0.12)
    bg = flood_light_bg(light.astype(bool))

    alpha = np.where(bg, 0.0, 255.0)
    fringe = (~bg) & (cmax > 180) & (sat < 0.18)
    alpha[fringe] = np.clip((1.0 - (cmax[fringe] - 180.0) / 40.0) * 255.0, 0.0, 255.0)

    out = np.zeros((*rgb.shape[:2], 4), dtype=np.uint8)
    out[..., :3] = rgb.astype(np.uint8)
    out[..., 3] = alpha.astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def crop_content(im: Image.Image, pad: int = 8) -> Image.Image:
    arr = np.array(im)
    alpha = arr[..., 3]
    ys, xs = np.where(alpha > 16)
    if len(xs) == 0:
        return im
    x0, x1 = max(0, xs.min() - pad), min(im.width, xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(im.height, ys.max() + pad + 1)
    return im.crop((x0, y0, x1, y1))


def split_mark(im: Image.Image) -> Image.Image:
    """Recorta solo el isotipo G burst (por encima del wordmark)."""
    arr = np.array(im)
    alpha = arr[..., 3]
    rows = (alpha > 32).sum(axis=1)
    h = len(rows)
    # Hueco entre icono y texto
    gap_start = gap_end = None
    for y in range(h // 4, h * 3 // 4):
        if rows[y] < 8:
            if gap_start is None:
                gap_start = y
            gap_end = y
    split_y = gap_start if gap_start and gap_start > h * 0.35 else int(h * 0.62)

    ys, xs = np.where(alpha[:split_y] > 16)
    if len(xs) == 0:
        return im
    pad = 6
    x0, x1 = max(0, xs.min() - pad), min(im.width, xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(split_y, ys.max() + pad + 1)
    return im.crop((x0, y0, x1, y1))


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC)
    clean = remove_background(src)
    lockup = crop_content(clean, pad=12)
    mark = crop_content(split_mark(clean), pad=8)

    lockup_path = BRAND / "logo-genesis-clean.png"
    mark_path = BRAND / "logo-genesis-mark.png"
    lockup.save(lockup_path, "PNG", optimize=True)
    mark.save(mark_path, "PNG", optimize=True)

    # SVG contenedor (referencia externa, sin base64 pesado)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{lockup.width}" height="{lockup.height}" viewBox="0 0 {lockup.width} {lockup.height}" fill="none">
  <image href="/brand/logo-genesis-clean.png" width="{lockup.width}" height="{lockup.height}" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    (BRAND / "logo-genesis-clean.svg").write_text(svg, encoding="utf-8")

    # Validación esquinas
    a = np.array(lockup)[..., 3]
    print(f"Lockup: {lockup_path} ({lockup.width}x{lockup.height})")
    print(f"Mark:   {mark_path} ({mark.width}x{mark.height})")
    print(f"Corner alpha max: {max(a[0:4,0:4].max(), a[0:4,-4:].max())}")


if __name__ == "__main__":
    main()

"""
Phase 3.8 — Sample exact alpha + RGB from public/brand/logo-genesis-mark.png
Generates lib/trust/genesisLogoMaskPool.generated.ts
"""
from __future__ import annotations

import base64
import struct
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PNG = ROOT / "public" / "brand" / "logo-genesis-mark.png"
OUT = ROOT / "lib" / "trust" / "genesisLogoMaskPool.generated.ts"
ALPHA_THRESHOLD = 32


def main() -> None:
    im = Image.open(PNG).convert("RGBA")
    arr = np.array(im, dtype=np.uint8)
    h, w = arr.shape[:2]
    alpha = arr[..., 3]
    rgb = arr[..., :3].astype(np.float32) / 255.0

    vis = alpha > ALPHA_THRESHOLD
    ys, xs = np.where(vis)
    if len(xs) == 0:
        raise SystemExit("No visible pixels in logo PNG")

    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    cx = (x0 + x1) * 0.5
    cy = (y0 + y1) * 0.5
    half = max(x1 - x0, y1 - y0) * 0.5

    nx = (xs.astype(np.float32) - cx) / half
    ny = -(ys.astype(np.float32) - cy) / half

    r = rgb[ys, xs, 0]
    g = rgb[ys, xs, 1]
    b = rgb[ys, xs, 2]

    # Radial bands + angle — spatially coherent structured sampling
    radii = np.hypot(nx, ny)
    bands = np.floor(radii * 28).astype(np.int32)
    angles = np.arctan2(ny, nx)
    order = np.lexsort((angles, bands))
    nx, ny, r, g, b = nx[order], ny[order], r[order], g[order], b[order]

    pool_count = len(xs)
    interleaved = np.empty(pool_count * 5, dtype=np.float32)
    interleaved[0::5] = nx
    interleaved[1::5] = ny
    interleaved[2::5] = r
    interleaved[3::5] = g
    interleaved[4::5] = b

    blob = base64.b64encode(interleaved.tobytes()).decode("ascii")

    hole_x0 = (x0 + x1) * 0.5 - (x1 - x0) * 0.12
    hole_x1 = (x0 + x1) * 0.5 + (x1 - x0) * 0.12
    hole_y0 = (y0 + y1) * 0.5 - (y1 - y0) * 0.12
    hole_y1 = (y0 + y1) * 0.5 + (y1 - y0) * 0.12
    hole_mask = (
        (xs >= hole_x0)
        & (xs <= hole_x1)
        & (ys >= hole_y0)
        & (ys <= hole_y1)
        & (alpha[ys, xs] <= ALPHA_THRESHOLD + 8)
    )
    center_hole_pixels = int(hole_mask.sum())

    ts = f"""/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: public/brand/logo-genesis-mark.png ({w}x{h})
 * Visible pixels: {pool_count}
 * Run: python scripts/sample-genesis-logo-mask.py
 */
export const GENESIS_LOGO_MASK_SOURCE = 'public/brand/logo-genesis-mark.png' as const

export const GENESIS_LOGO_MASK_IMAGE_SIZE = {{ width: {w}, height: {h} }} as const

export const GENESIS_LOGO_MASK_POOL_COUNT = {pool_count} as const

/** Normalized bounds (nx, ny) before world scale — content-fit, y-up. */
export const GENESIS_LOGO_MASK_BOUNDS = {{
  minX: {float(nx.min()):.8f},
  maxX: {float(nx.max()):.8f},
  minY: {float(ny.min()):.8f},
  maxY: {float(ny.max()):.8f},
  halfExtent: {float(max(abs(nx.min()), abs(nx.max()), abs(ny.min()), abs(ny.max()))):.8f},
}} as const

export const GENESIS_LOGO_MASK_STATS = {{
  visiblePixels: {pool_count},
  alphaThreshold: {ALPHA_THRESHOLD},
  contentWidthPx: {x1 - x0 + 1},
  contentHeightPx: {y1 - y0 + 1},
  centerHoleEstimatePx: {center_hole_pixels},
  aspectRatio: {w / h:.6f},
}} as const

/** Packed float32 pool: nx, ny, r, g, b interleaved ({pool_count} samples). */
export const GENESIS_LOGO_MASK_POOL_B64 =
  '{blob}'
"""

    OUT.write_text(ts, encoding="utf-8")
    print(f"Wrote {OUT} ({pool_count} pixels, {len(blob)} b64 chars)")


if __name__ == "__main__":
    main()

"""
Phase 3.8 — Validate PNG mask sampling accuracy (silhouette overlap).
Run: python scripts/validate-genesis-logo-mask.py
"""
from __future__ import annotations

import base64
import re
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PNG = ROOT / "public" / "brand" / "logo-genesis-mark.png"
POOL_TS = ROOT / "lib" / "trust" / "genesisLogoMaskPool.generated.ts"
OUT = ROOT / "public" / "brand" / "logo-mask-validation.png"

ALPHA_THRESHOLD = 32
MASK_COUNT = 900
WORLD_RADIUS = 0.46 * 2.5
SHIELD_SCALE = 2.2


def load_pool() -> np.ndarray:
    text = POOL_TS.read_text(encoding="utf-8")
    m = re.search(r"GENESIS_LOGO_MASK_POOL_B64\s*=\s*'([^']+)'", text)
    if not m:
        raise SystemExit("Pool b64 not found")
    raw = base64.b64decode(m.group(1))
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 5)


def stratified_index(i: int, count: int, pool_count: int) -> int:
    bin_ = min(pool_count - 1, int(((i + 0.5) / max(1, count)) * pool_count))
    spread = max(1, pool_count // max(1, count))
    jitter = (i * 7919 + count * 13) % spread
    return min(pool_count - 1, bin_ + jitter)


def main() -> None:
    im = Image.open(PNG).convert("RGBA")
    w, h = im.size
    src = np.array(im)
    alpha = src[..., 3]
    ref_mask = alpha > ALPHA_THRESHOLD

    pool = load_pool()
    pool_count = len(pool)

    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    draw = ImageDraw.Draw(canvas)
    s = WORLD_RADIUS * SHIELD_SCALE

    for i in range(MASK_COUNT):
        pi = stratified_index(i, MASK_COUNT, pool_count)
        nx, ny = pool[pi, 0], pool[pi, 1]
        px = int((nx * s / s) * (w * 0.48) + w * 0.5)
        py = int((-ny * s / s) * (h * 0.48) + h * 0.5)
        draw.rectangle((px - 1, py - 1, px + 1, py + 1), fill=(233, 30, 139, 255))

    # Map normalized pool directly to pixel space for overlap metric
    particle_mask = np.zeros((h, w), dtype=bool)
    ys, xs = np.where(ref_mask)
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    cx = (x0 + x1) * 0.5
    cy = (y0 + y1) * 0.5
    half = max(x1 - x0, y1 - y0) * 0.5

    for i in range(MASK_COUNT):
        pi = stratified_index(i, MASK_COUNT, pool_count)
        nx, ny = pool[pi, 0], pool[pi, 1]
        px = int(nx * half + cx)
        py = int(-ny * half + cy)
        if 0 <= px < w and 0 <= py < h:
            particle_mask[py, px] = True
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                qx, qy = px + dx, py + dy
                if 0 <= qx < w and 0 <= qy < h:
                    particle_mask[qy, qx] = True

    intersection = (ref_mask & particle_mask).sum()
    union = (ref_mask | particle_mask).sum()
    iou = intersection / union if union else 0
    recall = intersection / ref_mask.sum()
    precision = intersection / max(1, particle_mask.sum())

    canvas.save(OUT)
    print(f"Validation image: {OUT}")
    print(f"Pool pixels: {pool_count}")
    print(f"Mask particles: {MASK_COUNT}")
    print(f"IoU (900 stratified): {iou:.3f}")
    print(f"Recall: {recall:.3f}  Precision: {precision:.3f}")
    print("PASS" if iou >= 0.35 and recall >= 0.55 else "NEEDS MORE PARTICLES / DENSER SAMPLING")


if __name__ == "__main__":
    main()

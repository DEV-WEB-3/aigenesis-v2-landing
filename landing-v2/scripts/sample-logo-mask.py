"""
Muestrea un logotipo a nube de partículas. Sirve para CUALQUIERA de las marcas.

QUE HACE
--------
Lee un PNG con transparencia, toma sus píxeles visibles y los normaliza a un
espacio de [-1, 1] con la Y hacia arriba, guardando además el color de cada uno.
El resultado es el «pool»: el conjunto de posiciones desde el que el sistema de
partículas elige para dibujar la silueta.

POR QUE EXISTE ESTE Y NO EL DE ANTES
------------------------------------
`sample-genesis-logo-mask.py` hacía lo mismo pero con la ruta a fuego y sin tope
de tamaño. Dos problemas:

 1. Sólo servía para Genesis. Para la esfera de marca hacen falta los tres
    logotipos, y copiar el script tres veces es garantizar que se separen.

 2. EL TAMAÑO. Guardaba TODOS los píxeles visibles: 60.828 puntos, que son
    1,6 MB de base64 en el bundle. Y el sistema dibuja **600 partículas**
    —`PARTICLE_COUNT`—, o sea que se enviaban 101 veces más datos de los que se
    usan. Con el logotipo nuevo, que cubre un 62 % del área frente al 36 % del
    viejo, habrían sido ~2,8 MB por marca: más de 8 MB entre las tres.

EL TOPE ES MUESTREO, NO RECORTE
-------------------------------
No se cortan los últimos puntos: se toma uno de cada N recorriendo el orden
radial —bandas concéntricas y ángulo— que el propio script ya calcula. Así el
subconjunto conserva la forma completa y la densidad relativa de cada zona, en
vez de quedarse con media silueta.

Uso:
  python scripts/sample-logo-mask.py <png> <salida.ts> <PREFIJO> [maximo]

Ejemplo:
  python scripts/sample-logo-mask.py public/brand/gpulse-512.png \\
      lib/brand/gpulseMaskPool.generated.ts GPULSE 6000
"""
from __future__ import annotations

import base64
import sys
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
UMBRAL_ALFA = 32

# 600 partículas dibujadas · ~10x de sobremuestreo para que haya variedad al
# elegir y la silueta no se repita. Más que esto no se nota y sí pesa.
MAXIMO_POR_DEFECTO = 6000


def main() -> None:
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)

    png = RAIZ / sys.argv[1]
    salida = RAIZ / sys.argv[2]
    prefijo = sys.argv[3]
    maximo = int(sys.argv[4]) if len(sys.argv) > 4 else MAXIMO_POR_DEFECTO

    im = Image.open(png).convert("RGBA")
    arr = np.array(im, dtype=np.uint8)
    h, w = arr.shape[:2]
    alfa = arr[..., 3]
    rgb = arr[..., :3].astype(np.float32) / 255.0

    vis = alfa > UMBRAL_ALFA
    ys, xs = np.where(vis)
    if len(xs) == 0:
        raise SystemExit(f"{png.name}: sin pixeles visibles")

    total = len(xs)

    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    cx = (x0 + x1) * 0.5
    cy = (y0 + y1) * 0.5
    mitad = max(x1 - x0, y1 - y0) * 0.5

    nx = (xs.astype(np.float32) - cx) / mitad
    ny = -(ys.astype(np.float32) - cy) / mitad

    r = rgb[ys, xs, 0]
    g = rgb[ys, xs, 1]
    b = rgb[ys, xs, 2]

    # Orden espacialmente coherente: bandas radiales y, dentro de cada una,
    # ángulo. Es lo que permite que un submuestreo regular conserve la forma.
    radios = np.hypot(nx, ny)
    bandas = np.floor(radios * 28).astype(np.int32)
    angulos = np.arctan2(ny, nx)
    orden = np.lexsort((angulos, bandas))
    nx, ny, r, g, b = nx[orden], ny[orden], r[orden], g[orden], b[orden]

    if total > maximo:
        # uno de cada N sobre el orden radial: conserva forma y densidad
        idx = np.linspace(0, total - 1, maximo).astype(np.int64)
        nx, ny, r, g, b = nx[idx], ny[idx], r[idx], g[idx], b[idx]

    cuenta = len(nx)

    entrelazado = np.empty(cuenta * 5, dtype=np.float32)
    entrelazado[0::5] = nx
    entrelazado[1::5] = ny
    entrelazado[2::5] = r
    entrelazado[3::5] = g
    entrelazado[4::5] = b

    blob = base64.b64encode(entrelazado.tobytes()).decode("ascii")
    ruta_rel = str(png.relative_to(RAIZ)).replace("\\", "/")

    ts = f"""/**
 * GENERADO — no editar a mano.
 * Origen: {ruta_rel} ({w}x{h})
 * Pixeles visibles: {total}   ->   muestreados: {cuenta}
 * Regenerar: python scripts/sample-logo-mask.py {sys.argv[1]} {sys.argv[2]} {prefijo} {maximo}
 */
export const {prefijo}_MASK_SOURCE = '{ruta_rel}' as const

export const {prefijo}_MASK_IMAGE_SIZE = {{ width: {w}, height: {h} }} as const

export const {prefijo}_MASK_POOL_COUNT = {cuenta} as const

/** Limites normalizados (nx, ny) antes de la escala de mundo — Y hacia arriba. */
export const {prefijo}_MASK_BOUNDS = {{
  minX: {float(nx.min()):.8f},
  maxX: {float(nx.max()):.8f},
  minY: {float(ny.min()):.8f},
  maxY: {float(ny.max()):.8f},
  halfExtent: {float(max(abs(nx.min()), abs(nx.max()), abs(ny.min()), abs(ny.max()))):.8f},
}} as const

export const {prefijo}_MASK_STATS = {{
  visiblePixels: {total},
  sampledPixels: {cuenta},
  alphaThreshold: {UMBRAL_ALFA},
  contentWidthPx: {x1 - x0 + 1},
  contentHeightPx: {y1 - y0 + 1},
  aspectRatio: {w / h:.6f},
}} as const

/** float32 empaquetado: nx, ny, r, g, b entrelazados ({cuenta} muestras). */
export const {prefijo}_MASK_POOL_B64 =
  '{blob}'
"""

    salida.parent.mkdir(parents=True, exist_ok=True)
    salida.write_text(ts, encoding="utf-8")
    kb = len(blob) / 1024
    print(f"{png.name:26s} {total:>7d} visibles -> {cuenta:>6d} muestras   "
          f"{kb:7.1f} KB b64   -> {sys.argv[2]}")


if __name__ == "__main__":
    main()

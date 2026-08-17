"""
Deriva el ISOTIPO (sólo el símbolo) a partir del lockup oficial nuevo.

POR QUE EXISTE
--------------
`public/brand/genesis-mark-512.png` es el logotipo NUEVO y es un lockup: el
símbolo arriba y la palabra «GENESIS» debajo. Medido sobre el alfa, el símbolo
ocupa las filas 3..454 y la palabra 460..511 — un 10% del alto.

El nav y el pie usan el isotipo a 36-48 px. A ese tamaño la palabra mediría
menos de 4 px: ilegible, y ensucia una marca que a esa escala tiene que leerse
como un símbolo. Antes se usaba `logo-genesis-mark.png`, que es el isotipo de la
versión VIEJA — plana, sin volumen — y por eso convivían dos estilos.

Este script recorta el símbolo del logo nuevo y lo exporta cuadrado en la misma
convención que gevy y gpulse (64/128/256/512, PNG + WebP).

Uso:  python scripts/derive-genesis-symbol.py
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
ORIGEN = RAIZ / "public" / "brand" / "genesis-mark-512.png"
DESTINO = RAIZ / "public" / "brand"
TAMANOS = (512, 256, 128, 64)
UMBRAL_ALFA = 32

# Margen alrededor del símbolo, como fracción de su lado. Un isotipo pegado al
# borde se ve apretado cuando el contenedor le pone su propio recorte.
MARGEN = 0.04


def main() -> None:
    im = Image.open(ORIGEN).convert("RGBA")
    a = np.array(im)[..., 3]
    visible = a > UMBRAL_ALFA

    filas = visible.sum(axis=1)
    vacias = np.flatnonzero(filas == 0)
    # el hueco interno separa símbolo de palabra; el símbolo es lo de arriba
    internos = [i for i in vacias if 10 < i < im.height - 10]
    corte = int(internos[0]) if internos else im.height

    simbolo = visible[:corte, :]
    ys, xs = np.nonzero(simbolo)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())

    lado = max(x1 - x0, y1 - y0) + 1
    pad = int(round(lado * MARGEN))
    lienzo = lado + pad * 2

    recorte = im.crop((x0, y0, x1 + 1, y1 + 1))
    cuadrado = Image.new("RGBA", (lienzo, lienzo), (0, 0, 0, 0))
    cuadrado.paste(
        recorte,
        ((lienzo - recorte.width) // 2, (lienzo - recorte.height) // 2),
        recorte,
    )

    print(f"origen        {ORIGEN.name}  {im.width}x{im.height}")
    print(f"corte simbolo fila {corte}  (palabra descartada)")
    print(f"caja simbolo  x {x0}..{x1}  y {y0}..{y1}  -> lienzo {lienzo}x{lienzo}")

    for t in TAMANOS:
        salida = cuadrado.resize((t, t), Image.LANCZOS)
        png = DESTINO / f"genesis-symbol-{t}.png"
        webp = DESTINO / f"genesis-symbol-{t}.webp"
        salida.save(png, optimize=True)
        salida.save(webp, quality=92, method=6)
        print(f"  {png.name:26s} {png.stat().st_size/1024:7.1f} KB"
              f"   {webp.name:27s} {webp.stat().st_size/1024:7.1f} KB")


if __name__ == "__main__":
    main()

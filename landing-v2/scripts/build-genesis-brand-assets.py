"""
Genera los activos de marca de Genesis desde el máster de mayor resolución.

POR QUE
-------
Los `genesis-mark-*` del repositorio topaban en 512 px. Medido: el hero pinta el
logotipo a 391 px CSS, así que en una pantalla 2x pide 750 y en 3x más — con una
fuente de 512, Next no puede servir más de 512 y el logotipo llega SUBRESUELTO
justo en la pieza más visible del sitio.

El máster tiene 1254x1254. Este script produce la escalera completa desde él, y
`derive-genesis-symbol.py` deriva después el isotipo del resultado.

Uso:  python scripts/build-genesis-brand-assets.py <ruta-al-master.png>
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
DESTINO = RAIZ / "public" / "brand"
TAMANOS = (1024, 512, 256, 128, 64)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Falta la ruta del master. Uso: build-genesis-brand-assets.py <master.png>")

    master = Path(sys.argv[1])
    im = Image.open(master).convert("RGBA")
    print(f"master  {master.name}  {im.width}x{im.height}")

    if im.width != im.height:
        raise SystemExit(f"El master debe ser cuadrado; es {im.width}x{im.height}")

    for t in TAMANOS:
        if t > im.width:
            print(f"  saltado {t}: el master no da para tanto ({im.width})")
            continue
        salida = im.resize((t, t), Image.LANCZOS)
        png = DESTINO / f"genesis-mark-{t}.png"
        webp = DESTINO / f"genesis-mark-{t}.webp"
        salida.save(png, optimize=True)
        salida.save(webp, quality=92, method=6)
        print(f"  genesis-mark-{t:<5d} {png.stat().st_size/1024:8.1f} KB png"
              f"   {webp.stat().st_size/1024:8.1f} KB webp")


if __name__ == "__main__":
    main()

"""
Iguala el MATERIAL de las marcas hijas al de Genesis. Un solo cuerpo.

EL PROBLEMA, MEDIDO
-------------------
Los tres logotipos ya están dentro de la paleta Genesis — fuera de banda: 0,0 %
en Genesis, 0,0 % en G-Pulse y 2,8 % en Gevy. O sea que NO hay que rebrandear
ningún tono. Lo que rompe la familia es otra cosa:

                magenta  violeta   azul   cian    sat    lum
    Genesis      14,1 %   23,9 %  57,0 %  5,0 %   0,89   0,79
    G-Pulse       2,4 %   51,5 %  42,4 %  3,7 %   0,58   0,55   <- apagado
    Gevy         33,7 %   17,3 %  31,3 % 14,9 %   0,92   0,86

G-Pulse va un 35 % menos saturado y un 30 % más oscuro que sus hermanos. Al lado
de ellos no se lee como otra marca de la misma casa: se lee como un archivo de
peor calidad.

LA DECISION DE DISEÑO
---------------------
Se igualan SATURACION y LUMINANCIA, no el tono.

Cada marca hija debe conservar su carácter cromático — G-Pulse tira a violeta
porque es la capa de inteligencia, Gevy a magenta porque es comercio —. Forzar
el tono las volvería tres versiones del mismo logo y mataría la identidad de
cada una.

Lo que comparte una familia de marcas no es el color: es el MATERIAL. El mismo
brillo, la misma densidad, la misma luz. Eso es lo que hace que se lean como un
cuerpo aunque cada una tenga su acento.

COMO
----
Un ajuste en HSV sobre los píxeles con color, respetando el alfa y sin tocar los
grises ni los brillos especulares (que son los que dan el volumen). El objetivo
sale del propio Genesis: es la marca madre y por tanto la referencia.

Reversible: los archivos de origen no se tocan, y volviendo a correr el script
con otro objetivo se regenera todo.

Uso:  python scripts/harmonize-brand-logos.py
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
MARCA = RAIZ / "public" / "brand"
TAMANOS = (512, 256, 128)

# Sólo se miden y ajustan píxeles con color de verdad. Un blanco especular no
# tiene tono que corregir, y tocarlo apagaría el volumen del logotipo.
SAT_MIN = 0.25
VAL_MIN = 0.15
ALFA_MIN = 40


def perfil(rgb: np.ndarray, alfa: np.ndarray) -> tuple[float, float, np.ndarray]:
    """Saturación y valor medios de los píxeles con color. Devuelve la máscara."""
    vis = alfa > ALFA_MIN
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = np.divide(mx - mn, np.maximum(mx, 1e-6))
    m = vis & (sat > SAT_MIN) & (mx > VAL_MIN)
    if not m.any():
        return 0.0, 0.0, m
    return float(sat[m].mean()), float(mx[m].mean()), m


def igualar(origen: Path, destino_base: str, sat_obj: float, val_obj: float) -> None:
    im = Image.open(origen).convert("RGBA")
    a = np.array(im).astype(np.float32) / 255.0
    rgb, alfa = a[..., :3], a[..., 3] * 255

    sat0, val0, m = perfil(rgb, alfa)
    if sat0 == 0:
        raise SystemExit(f"{origen.name}: sin píxeles con color")

    k_sat = sat_obj / sat0
    k_val = val_obj / val0

    mx = rgb.max(axis=2, keepdims=True)
    mn = rgb.min(axis=2, keepdims=True)

    # Saturación: se aleja o acerca cada canal del máximo, que conserva el tono.
    nuevo = np.where(mx > 1e-6, mx - (mx - rgb) * k_sat, rgb)
    # Valor: escalado plano, recortado para no quemar los especulares.
    nuevo = nuevo * k_val
    nuevo = np.clip(nuevo, 0.0, 1.0)

    salida = a.copy()
    salida[..., :3] = np.where(m[..., None], nuevo, rgb)

    sat1, val1, _ = perfil(salida[..., :3], alfa)
    print(f"{origen.name:22s} sat {sat0:.2f} -> {sat1:.2f}   lum {val0:.2f} -> {val1:.2f}"
          f"   (objetivo {sat_obj:.2f} / {val_obj:.2f})")

    base = Image.fromarray((salida * 255).astype(np.uint8), "RGBA")
    for t in TAMANOS:
        red = base.resize((t, t), Image.LANCZOS)
        png = MARCA / f"{destino_base}-{t}.png"
        webp = MARCA / f"{destino_base}-{t}.webp"
        red.save(png, optimize=True)
        red.save(webp, quality=92, method=6)
    print(f"{'':22s} escrito {destino_base}-{{512,256,128}} .png/.webp")


def main() -> None:
    # La marca MADRE es la referencia: su material define el de la familia.
    ref = Image.open(MARCA / "genesis-mark-512.png").convert("RGBA")
    ra = np.array(ref).astype(np.float32) / 255.0
    sat_obj, val_obj, _ = perfil(ra[..., :3], ra[..., 3] * 255)
    print(f"referencia (Genesis)   sat {sat_obj:.2f}   lum {val_obj:.2f}\n")

    igualar(MARCA / "gpulse-512.png", "gpulse", sat_obj, val_obj)
    igualar(MARCA / "gevy-alt-512.png", "gevy-alt", sat_obj, val_obj)
    igualar(MARCA / "gevy-512.png", "gevy", sat_obj, val_obj)


if __name__ == "__main__":
    main()

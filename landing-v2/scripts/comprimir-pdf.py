# -*- coding: utf-8 -*-
"""
COMPRIME UN PDF DE PRESENTACION SIN QUE SE NOTE EN PANTALLA.

POR QUE EXISTE. Los mazos de la alianza (AITECHONE) pesan de 12 a 45 MB. La
presentacion de AiGenesis pesa 2,5 MB, y la tanda vieja de G11 —de 5 a 227 MB—
se reemplazo justamente por el peso. Quien abre el asistente en el movil para
ensenarle esto a otra persona no descarga 45 MB: cierra.

QUE SE MIDIO ANTES DE APRETAR NADA. Los tres mazos que revise tienen CERO
caracteres de texto y entre el 97 % y el 100 % del peso en imagenes, guardadas
como PNG a ~1500x1000. Un PNG guardando una fotografia es lo peor de los dos
mundos: sin perdida, y por eso enorme, para un contenido al que la perdida no se
le ve. Convertirlas a JPEG es donde esta todo el ahorro.

DOS CONSECUENCIAS DE QUE NO HAYA TEXTO:
  · No hay nada que preservar salvo el aspecto. Ningun riesgo de romper la
    seleccion de texto o los enlaces: no los hay.
  · Estos PDF NO son accesibles ni buscables, y eso ya era asi antes de tocarlos.
    Se dice aqui porque es una limitacion del material, no del comprimido.

LO QUE NO HACE: no reescala. Las paginas son 1152x768 pt y las imagenes ya estan
a ~96 ppp; bajarlas mas se veria. Se cambia el FORMATO, no el tamano.

Uso:  python scripts/comprimir-pdf.py entrada.pdf salida.pdf [calidad]
"""
import os
import sys
import io

import pymupdf
from PIL import Image

CALIDAD_POR_DEFECTO = 82


def comprimir(entrada, salida, calidad=CALIDAD_POR_DEFECTO):
    """
    SE USA `rewrite_images`, Y NO REESCRIBIENDO LOS FLUJOS A MANO.

    La primera version de esto extraia cada imagen, la pasaba a JPEG con Pillow y
    escribia el resultado con `update_stream`, poniendo a mano las claves del
    objeto (`Filter /DCTDecode`, `ColorSpace`, `BitsPerComponent`...). Bajaba el
    ES de 12,7 a 10,0 MB y producia un PDF ROTO: `update_stream` vuelve a
    comprimir el flujo con Flate, asi que los bytes quedaban en zlib mientras el
    objeto declaraba que eran JPEG. MuPDF lo dijo siete veces —«Not a JPEG file:
    starts with 0x78 0xda»— y la pagina 12 salia en blanco.

    Lo atrapo la verificacion de abajo, no yo. Si hubiera mirado solo el numero
    de megas, habria publicado un mazo con paginas vacias en cinco idiomas.

    `rewrite_images` hace la misma conversion desde dentro de la libreria, que es
    quien sabe que claves tocar. `dpi_target=0` deja el tamano intacto: las
    paginas son 1152x768 pt y las imagenes ya estan a ~96 ppp, asi que aqui se
    cambia el FORMATO, no la resolucion.
    """
    doc = pymupdf.open(entrada)
    antes = os.path.getsize(entrada)

    doc.rewrite_images(
        dpi_target=0,      # el tamano no se toca: solo el formato
        quality=calidad,
        lossless=True,     # los PNG
        # LOS JPEG TAMBIEN. Aqui puse `lossy=False` razonando que un JPEG ya
        # comprimido no se recomprime sin perder por nada. El desglose por
        # formato dijo lo contrario: de los 12,7 MB del ES, 9,7 MB son 20 JPEG
        # —el 76 % del archivo— a ~485 KB cada uno, o sea calidad 95+, mucho mas
        # de lo que una pantalla necesita. Con `False` la compresion tocaba solo
        # los 2,7 MB de PNG y bajaba un 20 %; subir o bajar la calidad no movia
        # el peso, que era la senal de que estaba apretando lo que no pesaba.
        #
        # Me equivoque por mirar la imagen MAS GRANDE (un PNG de 2,1 MB) en vez
        # del agregado por formato. Un maximo no dice donde esta el peso.
        lossy=True,
        color=True,
        gray=True,
        bitonal=False,     # el blanco y negro puro se estropea en JPEG
    )
    doc.subset_fonts()
    doc.save(salida, garbage=4, deflate=True, clean=True)
    doc.close()

    despues = os.path.getsize(salida)
    print(
        f"{os.path.basename(entrada):24s} {antes/1048576:6.1f} MB -> "
        f"{despues/1048576:5.1f} MB  ({100*despues/antes:4.1f}%)"
    )
    return despues


def verificar(original, comprimido):
    """
    QUE EL COMPRIMIDO SIGA SIENDO EL MISMO DOCUMENTO.

    Un comprimido que pesa poco porque perdio paginas es peor que no comprimir:
    parece un exito y entrega otra cosa. Se comprueba lo unico que no puede
    cambiar —cuantas paginas y de que tamano— y que cada pagina siga pintando
    algo, para atrapar la que se quedo en blanco.
    """
    a = pymupdf.open(original)
    b = pymupdf.open(comprimido)
    problemas = []
    if a.page_count != b.page_count:
        problemas.append(f"paginas: {a.page_count} -> {b.page_count}")
    for i in range(min(a.page_count, b.page_count)):
        ra, rb = a[i].rect, b[i].rect
        if abs(ra.width - rb.width) > 1 or abs(ra.height - rb.height) > 1:
            problemas.append(f"pagina {i+1} cambio de tamano")
        # Una pagina que quedo vacia pesa casi nada al rasterizarla.
        px = b[i].get_pixmap(dpi=36)
        if len(set(px.samples)) <= 2:
            problemas.append(f"pagina {i+1} quedo en blanco")
    a.close()
    b.close()
    return problemas


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    entrada, salida = sys.argv[1], sys.argv[2]
    calidad = int(sys.argv[3]) if len(sys.argv) > 3 else CALIDAD_POR_DEFECTO
    comprimir(entrada, salida, calidad)
    fallos = verificar(entrada, salida)
    if fallos:
        print("  NO SIRVE: " + "; ".join(fallos))
        sys.exit(1)
    print("  verificado: mismas paginas, mismo tamano, ninguna en blanco")

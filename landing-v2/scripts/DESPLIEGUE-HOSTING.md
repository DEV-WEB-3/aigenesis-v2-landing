# Subir la landing a Hostinger

Guía para dejar una copia estática del sitio en un hosting clásico. Escrita
para que la ejecute cualquiera, no sólo quien la montó.

---

## Antes de nada: esto NO sustituye a Vercel

**Vercel sigue siendo el origen.** El sitio se construye desde GitHub y se
publica en Vercel; lo que sube a Hostinger es una **copia estática** de ese
mismo código.

Eso significa que **hay dos sitios que pueden decir cosas distintas**. La copia
de Hostinger no se actualiza sola: si se despliega en Vercel y no se vuelve a
exportar, la copia envejece en silencio. Quien la deje desactualizada crea una
segunda verdad, que es justo lo que la regla del proyecto prohíbe.

Regla práctica: **cada vez que se despliega a producción, o se re-exporta o se
apaga la copia.** No hay término medio.

## Y hay algo en ese hosting que se puede romper

En la cuenta de Hostinger vive el WordPress de `aigenesis.io`, y dentro de él:

- `/{wp-content}/uploads/2026/06/AiGenesis_press_v5.0_*.pdf` — **las ocho
  presentaciones v5.0** que la landing enlaza desde el botón de descarga por
  idioma y desde `/g11`.
- `/downloads/…` — las tres presentaciones v1 (alemán, serbio, urdu).
- `/g11/g11_es/` — el portal antiguo.

**Comprobado el 19-ago-2026: los tres responden 200.** Si una subida los pisa,
el botón «Descargar la presentación» de la web nueva deja de funcionar en los
once idiomas. Por eso el destino por defecto es un **subdominio propio**, no la
raíz, y por eso `desplegar-hosting.mjs` **sube y sobrescribe pero nunca borra**.

---

## 1. Crear el subdominio

En hPanel → *Dominios* → *Subdominios*. Crea, por ejemplo, `app.aigenesis.io`.
Hostinger le asigna una carpeta propia, normalmente
`/domains/aigenesis.io/public_html/app` o `/public_html/app`.

**Apunta esa ruta exacta**: es lo que va en `carpeta` más abajo.

## 2. Crear una cuenta FTP acotada

hPanel → *Archivos* → *Cuentas FTP* → crear cuenta nueva **limitada a la carpeta
del subdominio**.

No uses la cuenta FTP principal ni la contraseña de tu cuenta de Hostinger. Si
esta credencial se filtra, con el acotado sólo alcanza a esa carpeta: no puede
tocar el WordPress, ni el correo, ni las bases de datos, ni la facturación.

## 3. Guardar la credencial en la máquina

Crear a mano `C:\Users\<usuario>\.hostinger\credenciales.json`:

```json
{
  "host": "ftp.aigenesis.io",
  "usuario": "u123456789.despliegue",
  "clave": "…",
  "carpeta": "/public_html/app"
}
```

**Fuera del repositorio, siempre.** `.gitignore` bloquea además
`credenciales.json` dentro del proyecto por si alguien lo copia «un momento»:
ese momento es como acaban las claves en un repositorio público.

Comprobar el acceso sin subir nada:

```
npm run desplegar:probar
```

Dice si entra, cuántas entradas hay en la carpeta y avisa si no está vacía.

## 4. Exportar y subir

```
npm run exportar            # construye en out/ y genera out/.htaccess
npm run desplegar:hosting   # sube out/ por FTPS
```

`npm run exportar` hace **dos** cosas y las dos hacen falta:

1. `next build` con `EXPORTAR_ESTATICO=1` → deja el sitio en `out/`.
2. `scripts/generar-htaccess.mjs` → escribe `out/.htaccess`.

**El segundo paso no es opcional.** En exportación estática Next **no aplica**
`headers()` —lo avisa por consola y sigue—, así que sin `.htaccess` la copia se
queda sin X-Frame-Options, sin `nosniff`, sin HSTS y sin CSP. Nada en el build
lo delata: hay que saberlo.

El `.htaccess` se **genera** leyendo las cabeceras reales de `next.config.js`.
No se edita a mano: si se cambia una cabecera se cambia allí y se vuelve a
exportar. Escribirla en los dos sitios garantiza que un día digan cosas
distintas — y la CSP está previsto endurecerla, así que ese día llegará.

## 5. Comprobar en el navegador

No basta con que suba sin error:

- Abrir el subdominio y **cambiar de idioma**: el selector es lo último que se
  montó y lo que más veces se ha roto.
- Comprobar una descarga de presentación: debe apuntar a `aigenesis.io`, que es
  donde viven los PDF — si da 404, la subida pisó algo.
- Ver las cabeceras: `curl -I https://app.aigenesis.io/` debe devolver
  `X-Frame-Options`, `X-Content-Type-Options` y la CSP.

---

## Lo que esta copia NO tiene

- **Optimización de imágenes.** El optimizador de Next es un proceso de
  servidor; en exportación se sirven tal cual (`images.unoptimized`).
- **Analítica de Vercel.** Los scripts de `/_vercel/…` no existen fuera de
  Vercel; no rompen nada, simplemente no miden.
- **Cabeceras automáticas.** Van en `.htaccess`, ver arriba.

## Qué NO puede hacer la API de Hostinger

Comprobado antes de montar esto: la API pública cubre VPS, dominios, DNS y
facturación. **No sube archivos a hosting compartido.** Un token de API sirve
para crear el subdominio o tocar DNS, no para desplegar. De ahí que el
despliegue vaya por FTPS.

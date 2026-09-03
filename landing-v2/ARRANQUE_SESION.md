# Prompt de arranque · landing de AiGenesis

Copiar tal cual al abrir una sesión nueva de Claude Code sobre este repo. Corto a propósito:
el detalle vive en las memorias, que se cargan solas.

```
Sigo con la landing de AiGenesis en C:\Users\user\aigenesis-v2-landing\landing-v2.

Leé primero estas memorias, que traen el detalle y evitan que repreguntes:
  tres-sitios-sirven-la-misma-landing
  el-aula-que-material-va-en-cada-portal
  lo-que-anima-le-quita-turno-al-video
  el-cdn-le-quita-las-cabeceras-a-las-imagenes
  corpus-del-asistente-traducido-al-100
  credencial-fsc-gb21026474-refutada
  desplegar-solo-con-go-del-owner

ESTADO (27-ago-2026, commit e6e141c en origin/main y en los tres sitios):
El asistente está terminado y desplegado. Corpus 99/99 en 11 idiomas.
El Aula muestra material según el portal: en g1 el plan de la alianza
(video es/en/pt + PDF en 5 idiomas), en aigenesis.io la presentación de
AiGenesis (PDF en 8). Videos a 720p. La licencia FSC GB21026474 fue
retirada (era de otra empresa) y no aparece en ningún sitio vivo.
Todo verificado en producción.

CÓMO TRABAJAMOS:
- Verificá lo que se sirve, no lo que construiste: npm run verify:vivo:g1
- Suite antes de cualquier push: verify:aula, verify:i18n, verify:lenguaje,
  verify:i18n:g1, verify:idioma:g1, npm run build
- aigenesis.io NO se despliega solo: va a mano por SSH (está en la memoria)
- Se trabaja en la rama g1/f2b-morph-cristal y se publica desde main
- Avisame antes de publicar y esperá mi GO

PENDIENTES:
1. Revisión legal por idioma de las líneas de riesgo y descargos del corpus
   (traducidos por Claude, sin revisar por nadie con criterio legal).
2. Crear cuenta FTP para la raíz + secretos HOSTINGER_FTP_USER_RAIZ /
   _PASS_RAIZ / _DIR_RAIZ, para que aigenesis.io deje de ser manual.
3. Revisar el deck de la alianza antes de darlo por definitivo: la página 9
   anuncia licencias FSC/FCA y respaldo de Lloyd's — material atribuido,
   nadie lo verificó (la FSC ya resultó falsa).
4. El Soporte VIP del portal (otro repo) no comparte corpus con esto;
   sin medir si responde en español a quien escribe en otro idioma.
```

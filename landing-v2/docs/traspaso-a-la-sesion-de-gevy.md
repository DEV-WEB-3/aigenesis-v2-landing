# Traspaso a la sesión que trabaja en Gevy

**Fecha:** 19-ago-2026 · **Origen:** sesión de material de soporte (repo `landing-v2`)

Esto no es una lista de tareas: son dos cosas que **encontré por el camino**
auditando el marketplace para escribir soporte, y que no me tocaba arreglar a
mí. Van con su evidencia para que no haya que redescubrirlas.

Ambas salen de leer el código que sirve la tienda en producción
(`useLiberarBotonDePago-CRaGAXHk.js` y la lógica de caja dentro de
`index-DscnE5mF.js`), el 19-ago-2026.

---

## 1 · El hueco entre firmar y registrar el pago

**Qué encontré.** La caja va en este orden:

```
crear pedido  →  firmar el pago en la wallet  →  validar  →  registrar  →  pagado
```

El pedido se crea **antes** de cobrar —eso está bien— y el cobro se registra
**después** de firmar. Entre esos dos últimos pasos hay una ventana: si la
persona firma y se cierra la pestaña, se le cae la red o expira la sesión
antes del registro, **el dinero salió y el pedido puede quedarse sin marcar
como pagado**.

**Por qué no lo arreglo yo.** Lo que ocurre en esa ventana lo decide el
servidor, y desde el navegador no se ve. Puede que ya exista una
reconciliación por hash y entonces no haya nada que hacer.

**Lo que hay que comprobar, en este orden:**

1. ¿Existe una reconciliación que case transferencias on-chain con pedidos
   sin registrar? Si existe, esto no es un defecto y basta con documentarlo.
2. Si no existe: ¿cuántos pedidos hay hoy en estado creado-no-pagado con una
   transferencia real asociada? Eso convierte una hipótesis en un número.
3. Sólo entonces decidir el arreglo.

**Lo que NO hay que hacer:** añadir un reintento en el cliente. Si el problema
es que el registro no llegó, reintentar desde una pestaña que ya se cerró no
ayuda; y si se implementa mal, puede firmar dos veces.

**Contexto útil:** el resto del flujo está bien resuelto. Un pedido creado sin
pagar se puede retomar desde «Mis pedidos», y el propio producto promete por
escrito que **no genera un segundo cargo**. Es la respuesta al miedo más caro
del comercio, y conviene no romperla al tocar esta parte.

---

## 2 · La tienda habla en voseo y el resto del ecosistema tutea

**Qué encontré.** Los textos de la caja y del catálogo usan voseo rioplatense,
mientras el resto del portal usa tuteo:

| En la tienda | En el resto del portal |
|---|---|
| «Elegí cómo pagar» | «Elige» |
| «Volvé al checkout seguro» | «Vuelve» |
| «Pagá menos con AIG» | «Paga» |
| «Iniciá sesión» | «Inicia sesión» |
| «Probá con otra palabra» | «Prueba» |
| «Descubrí, compará y comprá» | «Descubre, compara y compra» |

**Por qué importa más de lo que parece.** No es un error de ortografía: son
dos voces distintas dentro del mismo recorrido. La persona pasa del panel a
la tienda y le habla otra persona. En una tienda el tono es parte de la
confianza, y Gevy se está definiendo ahora — es el momento barato de fijarlo.

**Lo que hay que decidir antes de tocar nada:** cuál de las dos voces es la de
Gevy. No es obvio que gane el tuteo: el mercado principal del proyecto puede
justificar el voseo, y en ese caso lo que hay que cambiar es el resto. Lo que
no puede quedarse es la mezcla.

**Dónde está:** los literales viven en el código de la tienda, no en el
diccionario de traducción de la landing — así que no se arreglan desde
`lib/i18n/`.

---

## Lo que sí está resuelto y no hay que volver a mirar

Para que no se gaste tiempo dos veces:

- **Las formas de pago vivas son dos**: DUAL (AIG + USDT) y USDT solo.
  Confirmado por el owner y por la configuración de producción —
  `GET /api/marketplace/payment-config` devuelve `stripeEnabled: false`, lo
  que esconde las tres opciones con tarjeta, y `perLineAig: true`, que funde
  los tramos del 20% y el 40% en uno solo. El catálogo del código tiene seis
  opciones; **la configuración viva deja dos**.
- **El envío va incluido** en el total que se ve en la caja.
- **La caja son dos pasos**: dirección y forma de pago.
- **Gevy sucede a AIGMarket** como marketplace único (decisión del owner,
  19-ago-2026). AIGMarket pasa a ser una herramienta dentro de Gevy.

## Dónde está el material de soporte

En este mismo repo, `lib/soporte/`. Lo relevante para Gevy:

- `preguntas-gevy.ts` — 16 preguntas frecuentes, con su fuente declarada.
- `cronograma.ts` — el recorrido `comprar-en-la-tienda`, paso a paso.
- `gevy-identidad.ts` — misión, visión, tono y los pares «esto mal / esto bien».

Si se cambia el comportamiento de la caja, esos tres archivos hay que
actualizarlos: describen lo que hoy hace el producto, con fecha.

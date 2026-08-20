# Auditoría: qué hay construido en Soporte VIP y qué falta para cablearlo

**Fecha:** 20-ago-2026 · **Fuente:** código fuente real, en
`g-pulse-oracle/apps/gpulse/src/ui-genesis/`

---

## Corrección de la versión anterior de este documento

La primera versión la escribí leyendo el **paquete compilado**, y decía que la
pantalla era «una maqueta con datos de relleno». **Eso era injusto y en parte
falso.**

Lo que ocurrió: en el paquete vi tickets inventados (`vip-1001`), un estado del
sistema marcado como simulado y un mensaje que dice que la integración con
backoffice no existe. De ahí concluí que todo era de mentira.

Al abrir el código real —que sí está en esta máquina, en el monorepo de
`g-pulse-oracle`— resulta que **los guiones de soporte son reales, están bien
escritos y son mejores que lo que yo iba a proponer**. Lo que es de ejemplo es
la lista de tickets de demostración; el motor no.

La lección, otra vez la misma: un paquete compilado dice qué hace el programa,
no cuánto de eso es serio. Y no comprobar si el código fuente estaba en la
máquina antes de afirmar que no estaba fue un fallo mío de método.

---

## Lo que está construido, y está bien

`support/supportPlaybooks.js` — 323 líneas. Un guion por tipo de incidencia,
con:

| Campo | Qué contiene |
|---|---|
| `ticketTitle`, `category`, `priority` | el ticket ya nace clasificado |
| `agentSequence` | mensajes del agente, con retardo, e interpolación de variables |
| `followUpsOnUserMessage` | qué contestar según cuántas veces haya escrito ya la persona |
| `checklist` | lo que la persona debe verificar |
| `rubric` | criterios con que se evalúa la atención |

**La calidad del contenido es alta.** Ejemplos literales:

- *«No reenvíes fondos ni repitas la compra hasta que soporte confirme.»*
- *«Evita aprobar de nuevo el mismo nocional en el contrato salvo indicación
  explícita de soporte, para no duplicar movimientos on-chain.»*
- Rúbrica: *«No prometer activación instantánea sin verificación»*, *«Advertir
  contra duplicar compra on-chain»*.

Eso es exactamente la disciplina que este material persigue, escrita antes y
por otra mano. **No hay que sustituirla: hay que extenderla.**

Además hay piezas resueltas que no esperaba:

- `explorerTxUrl()` construye el enlace a BscScan y **distingue testnet de
  producción** por el chain id.
- `extractTxHashFromText()` saca el hash de un mensaje de error envuelto, así
  que la persona no tiene que encontrarlo ella.
- La incidencia se guarda en `sessionStorage` con **TTL de 30 minutos** y emite
  un evento propio, para sobrevivir a que el usuario recargue antes de llegar a
  soporte.
- `SUPPORT_RECONCILE_NOTE.md` deja escrito que la reparación en base de datos
  **no se hace desde el frontend**, y qué debe validar cualquier endpoint que
  algún día lo haga: contrato, método, `from`, montos y estado de la tx.

---

## El hueco real: el motor está conectado a 2 de 5 puntos

Aquí está el hallazgo que importa, y es concreto y comprobable.

Hay **cinco tipos de incidencia declarados**:

```
booster_post_failed · mining_post_failed · staking_failed
claim_failed · p2p_order_failed
```

Pero:

| Tipo | ¿Tiene guion? | ¿Alguien lo dispara? |
|---|---|---|
| `booster_post_failed` | sí | **sí** — modal de compra de booster |
| `claim_failed` | sí | **sí** — pantalla de wallet |
| `mining_post_failed` | sí | **no** |
| `staking_failed` | sí | **no** |
| `p2p_order_failed` | **no** | **no** |

Dos guiones escritos que nadie invoca, y un tipo declarado que no tiene ni
guion ni emisor. Si hoy falla una orden de P2P, el flujo cae al mensaje
genérico — que es correcto, pero desaprovecha todo el mecanismo.

**Coste de arreglarlo: bajo.** Los guiones de minería y staking ya existen;
falta llamarlos desde sus puntos de fallo, igual que hace el modal de booster.
El de P2P hay que escribirlo, y para eso ya está `flujos-de-dinero.ts` con el
hueco entre firmar y confirmar documentado.

---

## Lo que sigue sin existir

1. **Persistencia.** Los tickets viven en estado de React: al recargar
   desaparecen. Contrato especificado en `contrato-tickets-soporte.md`.
2. **Vínculo con la cuenta.** Un ticket no pertenece a nadie.
3. **Base de conocimiento general.** Los guiones cubren *fallos de registro
   tras una operación on-chain*, que es una franja estrecha. No cubren «no
   entiendo mi saldo», «por qué estoy congelado», «desde cuánto puedo
   reclamar» — que son la mayoría medida de las consultas reales.

**Ahí encaja `lib/soporte/`**, y encaja sin pisarse: los guiones atienden
incidencias técnicas puntuales; las 51 preguntas atienden el desconocimiento
general. Son capas distintas del mismo centro de ayuda.

---

## Plan, corregido

1. **Conectar los dos guiones huérfanos** (minería, staking) a sus puntos de
   fallo. Es copiar el patrón del booster. Barato y con efecto inmediato.
2. **Escribir el guion de `p2p_order_failed`**, con el hueco entre firmar y
   confirmar que ya está documentado.
3. **Enchufar la base de conocimiento general** al modo IA mediante
   `adaptador-centro-de-ayuda.ts`, respetando que el asistente pueda decir «no
   lo sé» y pasar a humano.
4. **Persistir** — sin esto nada de lo anterior sobrevive a un F5.

---

## Dos cosas que no hay que tocar

**El mensaje que admite que la integración no existe.** Es honesto mientras sea
cierto.

**La regla de la nota de reconciliación**: la reparación en base de datos no se
hace desde el frontend, y todo endpoint que active algo con un hash debe
validar contrato, método, remitente, montos y estado antes de escribir. Está
bien pensado y es la clase de regla que se pierde en una refactorización si no
está escrita.

# Contrato de persistencia de tickets de soporte

**Fecha:** 20-ago-2026 · **Estado:** especificación, sin implementar

## Por qué esto es una especificación y no código

La pantalla `/dashboard/support` vive en la aplicación del portal, y de esa
aplicación aquí sólo hay el **paquete compilado** — el código fuente no está en
esta máquina. Se puede leer con precisión qué hace; no se puede modificar.

Así que lo que sí aporta valor es dejar el contrato **derivado de la forma que
la pantalla ya usa**, para que implementarlo sea mecánico y no una negociación.
Cada campo de aquí sale de leer el estado que el componente maneja hoy.

---

## El modelo, tal como ya existe

No se propone uno nuevo. Éste es el que la pantalla maneja en memoria:

```
Ticket {
  id          string        hoy: `vip-${base36}` generado en el cliente
  title       string
  category    'retiro' | 'deposito' | 'red' | 'seguridad'
  priority    'low' | 'medium' | 'high'
  status      'open' | 'waiting_user' | 'closed'
  unread      boolean
  createdAt   number         epoch ms
  messages    Mensaje[]
  kind?       'incident'
  incident?   Incidencia
}

Mensaje {
  id      string
  body    string
  sender  'user' | 'agent'
  ts      number
  seen    boolean
  agent?  { name: string, level: string }
}

Incidencia {
  reason         string    tipo de fallo
  txHash?        string
  postPath?      string    la llamada que falló
  detailSnippet? string    extracto del error
  ts             number
  locale         string
}
```

**Respetarlo importa**: si el backend devuelve otra forma, hay que tocar la
interfaz, y entonces esto deja de ser «conectar un cable» y pasa a ser una
reescritura.

---

## Endpoints mínimos

| Método | Ruta | Para qué |
|---|---|---|
| `GET` | `/api/support/tickets` | los tickets de la cuenta autenticada |
| `POST` | `/api/support/tickets` | crear uno |
| `GET` | `/api/support/tickets/{id}` | uno con todos sus mensajes |
| `POST` | `/api/support/tickets/{id}/messages` | añadir mensaje |
| `POST` | `/api/support/tickets/{id}/close` | cerrarlo |

Autenticación: la misma sesión que el resto del portal. **Un ticket pertenece a
una cuenta** y sólo esa cuenta lo lee — hoy no hay vínculo con nadie, y ése es
el hueco principal.

---

## Reglas que no son opcionales

### 1 · El identificador lo asigna el servidor

Hoy el cliente genera `vip-${Date.now()}`. Con varias pestañas o dos personas
a la vez eso colisiona. El servidor devuelve el id definitivo y el cliente lo
adopta.

### 2 · Crear un ticket tiene que ser idempotente

Quien tiene un problema con su dinero pulsa el botón más de una vez. Sin
protección, un problema se convierte en tres tickets y el equipo atiende el
mismo caso por triplicado.

Se manda una clave de idempotencia generada al abrir el formulario; el
servidor, ante la misma clave, devuelve el ticket ya creado en vez de otro.

### 3 · Nunca se guarda un secreto

El material de soporte ya establece que jamás se pide contraseña ni frase de
recuperación. El backend tiene que asumir que **alguien las pegará igualmente**
en el cuerpo de un mensaje, por miedo o por confusión.

Antes de persistir, el cuerpo se revisa: si contiene algo con forma de frase de
recuperación o de clave privada, **no se guarda** — se sustituye por un aviso y
se le dice a la persona que no las comparta, que además la protege.

Esto no es una precaución teórica: en los canales de soporte reales hay
contraseñas pegadas en texto plano.

### 4 · La incidencia precargada es lo que más ahorra

La pantalla ya acepta una incidencia por el estado de navegación. Cuando un
fallo ocurra en el P2P, en la caja o al reclamar, el ticket debe nacer con el
hash y el error dentro.

Elimina el primer mensaje de casi todos los casos de dinero — el «pásame el
hash» — y elimina también el error de transcripción de quien copia un hash a
mano.

### 5 · El plazo se dice al abrir, no cuando ya hay enfado

En los tickets de categoría `retiro`, la respuesta automática de bienvenida
debe recordar que un reclamo puede tardar **de 1 minuto a 72 horas**. Es la
causa medida de los tickets duplicados: la persona no ve el dinero, da por
perdido el reclamo y abre otro.

---

## Qué NO hay que hacer

**No borrar el aviso de que la integración no existe** hasta que exista de
verdad. Hoy el producto dice al usuario que use los canales oficiales. Es
honesto mientras sea cierto.

**No bajar el umbral del asistente para que conteste siempre.** El `derivar` de
`buscar.ts` está diseñado: sobre un producto donde la gente pone dinero, una
respuesta plausible y equivocada es peor que un «no lo sé». Quien lo ajuste
para subir el porcentaje de respuestas automáticas habrá empeorado el sistema
justo donde más duele.

**No guardar el historial completo del chat como texto libre y ya está.** Los
mensajes llevan `sender` y `seen`; la pantalla los usa. Aplanarlos rompe la
interfaz.

---

## Orden sugerido

1. `GET` y `POST` de tickets con vínculo a la cuenta — sin esto no hay nada.
2. Mensajes.
3. Idempotencia y filtro de secretos — antes de abrirlo a todo el mundo, no
   después.
4. Incidencia precargada desde los puntos de fallo.
5. Cola humana real.

Los pasos 1 a 3 ya hacen que la pantalla deje de ser una maqueta.

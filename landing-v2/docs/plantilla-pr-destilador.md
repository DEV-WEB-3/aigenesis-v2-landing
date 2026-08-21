# Plantilla del PR del destilador (E5) — preparada, sin API

Cada corrida del destilador abre UN PR con esta forma. Nada se auto-fusiona:
firman owner/auditor. Etiqueta obligatoria: `destilador`.

---

## Título

`soporte(destilador): candidatas del <fecha> — <N> sinónimos, <M> fichas`

## Cuerpo

### Ventana medida

- Desde/hasta: …
- Consultas limpias: … · misses únicos: … · el digest completo va como artifact del workflow.

### Candidatas (≤10, por frecuencia del miss)

| # | Tipo | Destino | Evidencia (miss verbatim) | Fuente |
|---|---|---|---|---|
| 1 | sinónimos | `gen-…` | «…» (3×) | — |
| 2 | ficha | `gen-nueva` | «…» (2×) | porDefinir |

### Descartados (con motivo)

- «…» — staff/canario/ambiguo/continuidad

### Verificación automática (CI de este repo)

- [ ] `verify-lenguaje` — 12 reglas sobre las candidatas
- [ ] `probar-buscador` — la suite completa + cada evidencia añadida como caso
- [ ] `tsc --noEmit`

### Para la firma (humano)

- [ ] Ninguna candidata inventa cifra/plazo/procedimiento sin fuente
- [ ] Los sinónimos van a fichas existentes cuando el tema ya existe
- [ ] Tasa de aprobación de esta corrida: __ / __ (si <50%, se corrige el PROMPT, no se insiste)

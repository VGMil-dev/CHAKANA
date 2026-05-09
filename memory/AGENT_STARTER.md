# CHAKANA — Protocolo Universal de Carga de Contexto

> Este archivo es el punto de entrada para cualquier agente IA (Gemini, Codex, Copilot, GPT, Claude, etc.)
> al inicio de una sesión de trabajo en este repositorio.
> **Léelo completo antes de escribir una sola línea de código.**

---

## ¿Qué es Chakana?

Aplicación móvil (React Native / Expo) de economía circular andina. Conecta a consumidores ("embajadores") con vendedores locales ("Tambús"). Los usuarios reseñan compras y ganan "Aurios" (tokens SPL en Solana) que usan como descuento. Hay un narrador de voz IA (ElevenLabs) que genera reportes semanales para el Tambu.

**Contexto:** Proyecto hackathon de 48h. Priorizar que funcione sobre que sea elegante.

---

## Paso 1 — Lee el Índice de Memoria

Abre y lee: `memory/MEMORY.md`

Este archivo lista todos los documentos de contexto disponibles con una línea de descripción cada uno.

---

## Paso 2 — Lee las Memorias del App (hazlo en paralelo si puedes)

| Archivo | Qué encontrarás |
|---------|-----------------|
| `memory/chakana_built_vs_pending.md` | ✅ Qué UI existe y funciona. ⚠️ Qué servicios NO están integrados aún. Prioridades. |
| `memory/chakana_screens_routes.md` | Todas las rutas Expo Router, el Golden Path de la demo, navegación global. |
| `memory/chakana_components_map.md` | Todos los componentes React Native por carpeta. Consultar antes de crear uno nuevo. |
| `memory/chakana_state_services.md` | Zustand stores implementados, data mocks, variables de entorno, estado de cada servicio externo. |
| `memory/tech_architecture.md` | Stack completo, dependencias críticas, mecánica económica de Aurios, contratos entre devs. |
| `memory/supabase-contracts.md` | Firmas de funciones Auth/Reviews/Businesses, Edge Function de reportes. |

---

## Paso 3 — Lee el Estado y las Decisiones

- `memory/project_state.md` → fase actual, completado, en progreso, pendiente, bloqueado
- `memory/decisions.md` → decisiones arquitectónicas (ADRs) y definición de "Done"

---

## Paso 4 — Identifica tu Rol y Lee tu Guía

Pregunta al usuario qué Dev eres, o infiere de la tarea:

| Rol | Guía | Foco |
|-----|------|------|
| Dev 1 | `agents/dev1-ui.md` | Layout, animaciones, NativeWind, Expo Router |
| Dev 2 | `agents/dev2-logic.md` | Zustand, cliente Supabase, validaciones |
| Dev 3 | `agents/dev3-web3.md` | Solana MWA, SPL Token, LI.FI |
| Dev 4 | `agents/dev4-backend.md` | Supabase Edge Functions, ElevenLabs TTS, Oráculo |

---

## Paso 5 — Declara tu Plan Antes de Codear

Antes de escribir código, emite este bloque:

```
PLAN DE SESIÓN
==============
Rol: Dev X — [nombre]
Tarea: [qué voy a hacer]
Archivos a tocar: [lista]
Posibles conflictos: [con qué devs o módulos]
Asumo: [cualquier ambigüedad que estoy resolviendo]
```

Si hay ambigüedad, **DETENTE** y pregunta antes de asumir.

---

## Reglas de Oro (siempre activas)

1. **Think Before Coding** — Planear primero, siempre.
2. **Simplicity First** — 10 líneas > 50 líneas. Sin abstracciones prematuras.
3. **Surgical Changes** — Diffs pequeños. No tocar lo que no es tu tarea.
4. **No Ghost Code** — Solo código que aparece en el Golden Path de la demo.
5. **Security** — Keys en `.env`. ElevenLabs y Keypair Mint Authority solo en backend.

---

## Golden Path de la Demo (Valentina)

```
Onboarding → Login → Home (marketplace) → Inventario (Tambu) →
Carrito → Checkout (slider Aurios) → Pago (mock) → Reseña (+120 Aurios) → Home
```

Todo lo que construyas debe ser visible o testeable en este flujo.

---

## Notas por Herramienta

### GitHub Copilot (VS Code / JetBrains)
- Abre este archivo y los de `memory/` como contexto antes de pedir completions.
- Usa el chat de Copilot: "Lee memory/MEMORY.md y actúa como Dev [X] de Chakana".
- Configura workspace rules en `.github/copilot-instructions.md` (ver abajo).

### Google Gemini (AI Studio / Vertex)
- Pega el contenido de este archivo + `memory/chakana_built_vs_pending.md` como system prompt.
- Sube los archivos de `memory/` al contexto de la conversación.

### OpenAI Codex / GPT-4o
- Incluye este archivo en el system prompt junto con `memory/tech_architecture.md`.
- Usa function calls / tools para leer archivos adicionales según necesidad.

### Cursor / Windsurf
- Este archivo + `CLAUDE.md` / `AGENTS.md` son leídos automáticamente.
- Usa `@memory/chakana_built_vs_pending.md` en el chat para contexto adicional.

### Claude Code
- Usa el skill `/chakana-memory` para cargar todo automáticamente.
- El skill está en `.claude/skills/chakana-memory/SKILL.md`.

---

## Definición de "Done" (Hackathon)

1. El código compila y corre en el emulador/dispositivo.
2. La funcionalidad es visible en el Golden Path de la demo.
3. `memory/project_state.md` ha sido actualizado.
4. Sin errores de tipos que rompan el build de producción.

# Architectural Decisions -- Chakana

> Registro de decisiones criticas, cambios de arquitectura y contratos entre servicios.

---

## Log de Decisiones

### [2026-05-08] - Sistema de Memoria e Instrucciones (Karpathy)
- **Contexto:** Necesitamos maxima velocidad y minima friccion entre 4 IAs.
- **Decision:** Implementar protocolos de "Think Before Coding", "Simplicity First" y "Surgical Changes" inspirados en el repo `andrej-karpathy-skills`.
- **Impacto:** Los agentes ahora deben validar su plan antes de ejecutar y priorizar la simplicidad sobre la elegancia.

---

## Contratos y Protocolos

### Definicion de "Done" para Hackathon
1. El codigo compila y corre en el emulador/dispositivo.
2. La funcionalidad es visible/testeable en el "Golden Path" de la demo.
3. El estado de la memoria (`project_state.md`) ha sido actualizado.
4. No hay errores de linting o tipos que rompan el build de produccion.

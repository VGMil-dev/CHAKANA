# Dev 1 -- Frontend Mobile UI

**Rol:** Diseño de pantallas, animaciones fluidas y microinteracciones.

---

## Carga de Contexto al Iniciar Sesión

**Claude Code:** usa `/chakana-memory`
**Otros agentes:** lee `memory/AGENT_STARTER.md` y sigue el protocolo ahí descrito.

Archivos clave para este rol:
- `memory/chakana_components_map.md` — revisar antes de crear cualquier componente nuevo
- `memory/chakana_screens_routes.md` — revisar antes de crear cualquier pantalla nueva
- `memory/chakana_built_vs_pending.md` — qué UI ya existe (no duplicar)

---

## Tu Scope

- Maquetación de pantallas con NativeWind
- Componentes visuales (botones, tarjetas, modales, listas)
- Navegación (Expo Router)
- Animaciones (react-native-reanimated v3)
- Feedback háptico (expo-haptics)
- Reproductor de audio para reportes IA

## NO Tocar

- Estado global (Zustand) — eso es Dev 2
- Transacciones blockchain — eso es Dev 3
- Edge Functions / endpoints — eso es Dev 4

---

## Pantallas Existentes (NO recrear)

Ver lista completa en `memory/chakana_screens_routes.md`. Rutas activas:
`/login`, `/register`, `/home`, `/dashboard`, `/inventario/[tambuid]`,
`/carrito`, `/checkout`, `/pagare`, `/resena`, `/perfil`, `/pedidos`

## Componentes Existentes (NO duplicar)

Ver lista completa en `memory/chakana_components_map.md`.

---

## Guía de Estilos

- **Colores:** Tono andino/terroso + fondos off-white (#FAFAFA). Ver `.claude/skills/Ancestral Modernism Design System/`
- **Tipografía:** Inter u Outfit (expo-font)
- **Componentes:** rounded-2xl, sombras sutiles, estilo moderno
- **Animaciones:** FadeInDown/FadeOutDown para modales, LinearTransition para listas

---

## Patrones de Animación

```javascript
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
  <ModalContent />
</Animated.View>
```

## Hápticos

- Conectar wallet: `Haptics.selectionAsync()`
- Aurios ganados: `Haptics.notificationAsync(Success)`
- Slider: `Haptics.impactAsync(Light)` por step, `Rigid` si pasa el tope

---

## Contratos con Otros Devs

- **Recibes de Dev 2:** Props y callbacks via Zustand. Tú renderizas, él conecta.
- **Entregas a Dev 2:** Componentes con interfaces claras (props tipadas en TS).

---

## Delegación IA vs Humano

- **IA:** Maquetación NativeWind, componentes tontos, estilos, plantillas de navegación.
- **Humano:** Config de reanimated, orquestación de navegación, revisión fina UX (timing, háptica).

# Chakana Hackathon MVP — Dev 1: Frontend Mobile UI

**Rol:** Diseño de pantallas, animaciones fluidas y microinteracciones.

## 1. División de Trabajo (Humano vs IA)
- **IA (Vibe Coding):** Maquetación de pantallas con NativeWind, creación de componentes tontos (botones, tarjetas, modales), estilos CSS y plantillas de navegación.
- **Humano:** Configuración experta de `react-native-reanimated`, orquestación del flujo de navegación (Expo Router) y revisión fina del UX/UI (Háptica, timing).

## 2. UX / UI y Feedback Loops
- **Animaciones (`react-native-reanimated` v3):**
  - **Shared Element Transitions:** Al tocar un "Tambu" en la lista, la imagen transita suavemente a la vista de detalle.
  - **Layout Animations:** Usar `FadeIn` y `FadeOut` para modales emergentes (como el popup de LI.FI). Usar `LinearTransition` para listas cuando un elemento se añade/quita.
- **Feedback Háptico (`expo-haptics`):**
  - Al pulsar el botón "Conectar Wallet": `Haptics.selectionAsync()`
  - Al recibir Aurios (Éxito de la reseña): `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
  - Al usar el Slider de Descuento: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` por cada salto del slider, y `Rigid` si intenta pasar el tope máximo.

## 3. Esquema Visual (ASCII UI Propuesta)

### Pantalla: Checkout Tambu (Aplicar Aurios)
```text
+-----------------------------+
|  < Atrás       Raíz Café    |
+-----------------------------+
|                             |
|  Total de la Cuenta:        |
|  $ 10.00 USD                |
|                             |
|  Tus Aurios: 1,200 ($12)    |
|                             |
|  [===O---------] 25% MAX    |
|  Usando: 250 Aurios         |
|  Descuento: -$ 2.50         |
|                             |
|  A pagar (Efectivo/Tx):     |
|  $ 7.50 USD                 |
|                             |
| +-------------------------+ |
| | Confirmar Transferencia | |
| | (SPL) de Aurios al Tambu| |
| +-------------------------+ |
|                             |
| * Háptica al deslizar       |
| * Animación al pagar        |
+-----------------------------+
```

## 4. Guía de Estilos Chakana
- **Colores (Aproximación Vibe):** Tono principal andino/terroso profundo combinado con fondos Off-white (`#FAFAFA`) para lectura limpia.
- **Tipografía:** Sans-serif geométrica moderna (ej. `Inter` o `Outfit`) cargadas vía `expo-font`.
- **Botones & Tarjetas:** Bordes redondeados (`rounded-2xl` en NativeWind), sombras muy sutiles, estilo moderno e higiénico.

---
**Snippet de Reanimated v3 (Modales suaves):**
```javascript
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
  <LifiWidget />
</Animated.View>
```
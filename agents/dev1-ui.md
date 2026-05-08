# Dev 1 -- Frontend Mobile UI

**Rol:** Diseno de pantallas, animaciones fluidas y microinteracciones.

---

## Tu Scope

- Maquetacion de pantallas con NativeWind
- Componentes visuales (botones, tarjetas, modales, listas)
- Navegacion (Expo Router)
- Animaciones (react-native-reanimated v3)
- Feedback haptico (expo-haptics)
- Reproductor de audio para reportes IA

## NO Tocar

- Estado global (Zustand) -- eso es Dev 2
- Transacciones blockchain -- eso es Dev 3
- Edge Functions / endpoints -- eso es Dev 4

---

## Pantallas a Construir

1. **Login/Wallet Connect** -- Boton conectar, muestra PublicKey
2. **Home** -- Lista de Tambus disponibles
3. **Detalle Tambu** -- Info del negocio, boton "Ordenar"
4. **Checkout** -- Monto total, slider de descuento Aurios, boton confirmar
5. **Review Form** -- Textarea para resena, boton enviar
6. **Propina (LI.FI)** -- Modal/popup post-resena para propina cross-chain
7. **Dashboard Tambu** -- Vista del dueno, reproductor de audio, resumen de resenas

---

## Guia de Estilos

- **Colores:** Tono andino/terroso + fondos off-white (#FAFAFA)
- **Tipografia:** Inter u Outfit (expo-font)
- **Componentes:** rounded-2xl, sombras sutiles, estilo moderno
- **Animaciones:** FadeInDown/FadeOutDown para modales, Shared Element Transitions entre lista y detalle, LinearTransition para listas

---

## Patrones de Animacion

```javascript
// Modales suaves
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
  <ModalContent />
</Animated.View>
```

## Hapticos

- Conectar wallet: `Haptics.selectionAsync()`
- Aurios ganados: `Haptics.notificationAsync(Success)`
- Slider: `Haptics.impactAsync(Light)` por step, `Rigid` si pasa el tope

---

## Contratos con Otros Devs

- **Recibes de Dev 2:** Props y callbacks via Zustand. Tu renderizas, el conecta.
- **Entregas a Dev 2:** Componentes con interfaces claras (props tipadas en TS).

---

## Delegacion IA vs Humano

- **IA:** Maquetacion NativeWind, componentes tontos, estilos, plantillas de navegacion.
- **Humano:** Config de reanimated, orquestacion de navegacion, revision fina UX (timing, haptica).

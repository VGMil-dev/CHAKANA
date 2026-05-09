# Chakana — GitHub Copilot Instructions

## Contexto del Proyecto

Eres un asistente de desarrollo para **Chakana**, una app móvil React Native (Expo) de economía circular andina. El usuario trabaja en un hackathon de 48h. Prioriza rapidez y funcionalidad sobre elegancia.

## Al Iniciar Trabajo

Lee estos archivos en orden para cargar contexto completo:

1. `memory/AGENT_STARTER.md` — protocolo completo de carga de contexto
2. `memory/chakana_built_vs_pending.md` — qué existe, qué falta
3. `memory/chakana_screens_routes.md` — rutas y Golden Path
4. `memory/chakana_components_map.md` — mapa de componentes (no duplicar)
5. `memory/chakana_state_services.md` — Zustand stores y servicios
6. El archivo de rol relevante en `agents/dev[1-4]-*.md`

## Stack (lo que está instalado)

- React Native 0.83.6 + Expo 55 + Expo Router
- Zustand 5 (stores: auth, cart)
- NativeWind (Tailwind para RN)
- react-native-reanimated v3 + expo-haptics
- **NO instalado aún:** @supabase/supabase-js, @solana/web3.js, elevenlabs

## Golden Path (la demo)

```
Onboarding → Login → Home → Inventario → Carrito → Checkout → Pago → Reseña → Home
```

Todo sugerencia de código debe ser visible en este flujo o es descartable.

## Reglas

- Diffs pequeños. No refactorizar "de paso".
- Sin comentarios obvios. Solo si el WHY no es evidente.
- Tipos TypeScript siempre. Sin `any`.
- Keys sensibles solo en `.env`. ElevenLabs/Keypair Mint solo en backend.
- Antes de sugerir un componente nuevo, verificar `memory/chakana_components_map.md`.
- Antes de sugerir una pantalla nueva, verificar `memory/chakana_screens_routes.md`.

## Directorio del App

Todo el código está en `chakana-app/`:
```
chakana-app/
  app/          # Expo Router screens
  components/   # UI components (por carpeta por feature)
  store/        # Zustand slices (auth.ts, cart.ts)
  data/         # Mock data (checkout.ts, inventory.ts, tambuses.ts...)
  hooks/        # Custom hooks (useAuth.ts)
```

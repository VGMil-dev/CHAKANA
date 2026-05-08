# Technical Architecture -- Chakana

---

## Stack

- **Frontend:** React Native (Expo Prebuild), NativeWind (Tailwind), Expo Router
- **State:** Zustand (slices: User, Business, UI)
- **Animaciones:** react-native-reanimated v3, expo-haptics
- **Blockchain:** Solana Devnet (@solana/web3.js, @solana/spl-token, @solana/spl-memo)
- **Wallet:** @solana-mobile/mobile-wallet-adapter-protocol (requiere Expo Prebuild, no Expo Go)
- **Backend:** Supabase (Auth, Postgres, Edge Functions, Storage)
- **Cross-chain:** LI.FI SDK (swap Polygon USDC -> Solana USDC para propinas)
- **IA/Voz:** ElevenLabs API (TTS para reportes de resenas)
- **Fonts:** Inter u Outfit via expo-font

---

## Dependencias Criticas

| Paquete | Proposito | Nota |
|---------|-----------|------|
| `@solana-mobile/mobile-wallet-adapter-protocol` | Conexion wallet nativa | Solo Android fisico/emulador |
| `@solana/spl-token` | Aurios (crear, transferir, mintear) | SPL Token estandar, NO Token-2022 |
| `@solana/spl-memo` | Hash de resena inmutable en cadena | |
| `lifi-sdk` | Propinas cross-chain | Widget web-viewizado si falta tiempo |
| `elevenlabs` | Text-to-Speech para reportes | API key solo en backend |
| `zustand` | Estado global | Con polyfill URL + expo-sqlite para Supabase en RN |

---

## Estructura del Proyecto (planeada)

```
src/
  app/              # Expo Router (pantallas)
  components/       # Componentes UI reutilizables
  store/            # Zustand slices
  services/         # Clientes (Supabase, Solana, LI.FI)
  utils/            # Helpers (hashing, formateo)
  constants/        # Colores, config, ABI
```

---

## Contratos entre Devs

- **Dev1 <-> Dev2:** Dev1 crea componentes visuales, Dev2 los conecta con estado (Zustand) y endpoints.
- **Dev2 <-> Dev3:** Dev2 prepara datos limpios (monto, aurios, pubkeys), Dev3 construye y firma transacciones.
- **Dev2 <-> Dev4:** Dev2 llama endpoints de Supabase, Dev4 los crea y protege.
- **Dev3 <-> Dev4:** Dev4 (Oraculo) mintea tokens tras validar resena; Dev3 maneja el signing del lado cliente.

---

## Mecanica Economica (Aurios)

- 1 Aurio = $0.01 USD de descuento
- Mint: Oraculo backend mintea al usuario por resenar (>50 chars)
- Transfer: Usuario transfiere Aurios al Tambu para descuento (max 25% de la cuenta)
- Burn: (futuro B2B) Tambu quema Aurios para descuento en suscripcion Gavanti

---

**Ultima actualizacion:** 2026-05-08

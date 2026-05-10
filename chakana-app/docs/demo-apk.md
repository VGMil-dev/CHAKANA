# APK demo simulada

Esta rama prepara una demo segura para hackathon. El modo demo permite entrar a la app sin Supabase Auth real, Phantom ni Stripe real.

## Que queda simulado

- Login: boton `Entrar en modo demo`.
- Wallet: usa `EXPO_PUBLIC_QA_PAYOUT_WALLET` si existe; si no, una public key Solana publica de demo.
- Aurio: si el SDK falla en APK, se muestra balance fallback `250 AUR` y `0 SOL`.
- Pago a Tambu: se prepara/simula visualmente; no firma ni envia transacciones.
- Checkout Stripe: en modo demo devuelve `Pago simulado aprobado` sin llamar a Stripe real.

## Que sigue real

- Login real por correo se mantiene intacto.
- Conexion real de wallet se mantiene intacta cuando no esta activo el modo demo.
- LI.FI REST quote-only sigue intentando ruta real y cae a mock si falla.
- Stripe Connect real sigue disponible fuera de modo demo.
- Aurio SDK real sigue disponible fuera de fallback demo.

## Build APK recomendado

Desde `chakana-app/`:

```bash
npm run lint
npx tsc --noEmit
npx expo start -c
```

Para generar APK con EAS:

```bash
npx eas build -p android --profile preview
```

El perfil `preview` ya esta configurado en `eas.json` con `android.buildType = "apk"` y distribucion interna.

## Build local opcional

Si tienes Android SDK local configurado:

```bash
npx expo run:android
```

Para un APK local de release, usar el proyecto Android generado por Expo prebuild/EAS segun el entorno local. No requiere claves privadas de wallet ni secretos nuevos en `.env`.


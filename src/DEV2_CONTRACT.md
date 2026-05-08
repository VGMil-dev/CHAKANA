# Dev 2 - Contrato de Interfaz

## Como importar

Todo viene de dos lugares:

- Tipos: `import { Business, DiscountResult } from '../types'`
- Hooks: `import { useAuth, useBusinesses, useReviewSubmit, useCheckout } from '../hooks'`
- Selectores: `import { useTambuActivo, useAurioBalance } from '../store/selectors'`

## Regla de oro

Dev 1 NUNCA importa desde:

- `../store` directamente. Usar selectores.
- `../services/supabase`. Eso es interno de Dev 2.
- `aurio-sdk`. Eso es contrato de Dev 3.

## Hooks disponibles y que exponen

| Hook | Valores principales | Callbacks principales |
| --- | --- | --- |
| `useAuth` | `authUserId`, `authEmail`, `isConnected`, `isAuthLoading`, `authError` | `login`, `register`, `logout`, `initAuth` |
| `useWallet` | `walletPubKey`, `aurioBalance`, `isConnected`, `isConnectingWallet`, `walletError` | `connectWallet`, `disconnectWallet`, `refreshAurioBalance` |
| `useBusinesses` | `listaTambus`, `tambuActivo`, `isLoadingBusinesses`, `businessError` | `fetchBusinesses`, `selectTambu`, `clearSelection` |
| `useReviewSubmit` | `currentReviewText`, `isTextValid`, `charsRemaining`, `isSubmittingReview`, `reviewError`, `reviewSuccess` | `onTextChange`, `submitReview`, `resetForm` |
| `useCheckout` | `checkoutTotal`, `discountResult`, `sliderMax`, `isProcessing`, `checkoutError` | `setTotal`, `onSliderChange`, `confirmCheckout` |
| `useDiscount` | `result`, `sliderMax` | `onSliderChange`, `resetDiscount` |

## Integracion con Aurio SDK

- `useReviewSubmit` refresca el balance con `getAurioBalance(walletPubKey)` despues de enviar una reseña y esperar al oraculo.
- `useCheckout` construye la transaccion real de Aurios con `payToTambu({ sender, tambuMint, amount })`.
- `useCheckout` usa `getAurioConnection()` para enviar y confirmar la transaccion firmada.
- `useCheckout` refresca el balance real con `getAurioBalance(walletPubKey)` despues de confirmar.
- `useCheckout` NO firma transacciones; recibe `signTransaction(tx)` desde Dev 3.
- Dev 3 solo entrega `tambuMint` y `signTransaction`.
- Dev 1 solo llama `useCheckout.confirmCheckout(...)`, consume hooks y estados. Dev 1 no importa `aurio-sdk`.
- `confirmCheckout` retorna `{ signature }` si el pago sale bien y `null` si falla.
- `useWallet` conecta Phantom/Solflare en web con `window.solana` y Mobile Wallet Adapter en Android.
- `useWallet` refresca el balance real con `getAurioBalance(walletPubKey)`.

## Integracion con Supabase Auth

- `useAuth.login(email, password)` llama `signIn` de Supabase y guarda `authUserId` y `authEmail` en Zustand.
- `useAuth.register(email, password, displayName)` llama `signUp` de Supabase y deja la sesion lista si Supabase devuelve usuario.
- `useAuth.initAuth()` se llama una sola vez al arrancar la app para hidratar la sesion activa.
- `useAuth.logout()` cierra la sesion en Supabase y limpia solo el estado de autenticacion.
- `isConnected` de `useAuth` significa sesion Supabase activa; la conexion de wallet sigue viviendo en `useWallet`.
- Dev 1 consume `useAuth`; no importa `../services/supabase` directamente.

## Flujo de reseñas y recompensa Aurio

- El usuario escribe una reseña válida de mínimo 50 caracteres.
- Dev 2 llama `insertReview`.
- Dev 4/oráculo valida la reseña y mintea 1 Aurio a la wallet conectada.
- Dev 2 espera aproximadamente 3 segundos.
- Dev 2 refresca el balance real usando `getAurioBalance(walletPubKey)`.
- Dev 2 nunca suma Aurios manualmente.
- Dev 2 nunca mintea tokens.

## Selectores disponibles

- `useWalletPubKey`
- `useAuthUserId`
- `useAuthEmail`
- `useAurioBalance`
- `useIsConnected`
- `useIsAuthLoading`
- `useAuthError`
- `useTambuActivo`
- `useListaTambus`
- `useIsLoadingBusinesses`
- `useCurrentReviewText`
- `useIsSubmittingReview`
- `useReviewSuccess`
- `useReviewError`
- `useActiveModal`
- `useCheckoutTotal`
- `useAuriosToSpend`
- `useAudioReportUrl`
- `useIsLoadingReport`
- `useErrorMessage`

## Flujo del Golden Path (Valentina / Raiz Cafe)

1. `initAuth()` al arrancar la app.
2. `useBusinesses.fetchBusinesses()` en Home.
3. `useBusinesses.selectTambu(business)` al entrar al detalle.
4. `useCheckout.setTotal(amount)` al entrar a Checkout.
5. `useCheckout.onSliderChange(value)` al mover el slider.
6. `useCheckout.confirmCheckout({ tambuMint, signTransaction })` al confirmar.
7. `useReviewSubmit.onTextChange(text)` y `submitReview()` en Review Form.
8. `setActiveModal('propina')` se dispara automaticamente post-checkout.

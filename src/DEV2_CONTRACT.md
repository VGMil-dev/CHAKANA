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
| `useAuth` | `isConnected`, `isAuthLoading`, `authError` | `login`, `register`, `logout`, `initAuth` |
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

## Selectores disponibles

- `useWalletPubKey`
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

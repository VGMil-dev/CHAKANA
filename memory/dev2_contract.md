# Dev 2 Contract

## Checkout Aurio

- Dev 2 orquesta checkout con `useCheckout`.
- Dev 2 usa `payToTambu` de `aurio-sdk` para construir la transaccion.
- Dev 2 recibe `signTransaction(tx)` desde Dev 3 o wallet web temporal.
- Dev 2 envia y confirma la transaccion con `getAurioConnection`.
- Dev 2 refresca balance real con `getAurioBalance(walletPubKey)`.
- Dev 2 nunca resta balance manualmente.
- Dev 2 nunca firma con keypair.
- Dev 2 nunca usa mint authority.
- Dev 2 nunca envia Aurios al mint address.

## Estado requerido

- `walletPubKey`
- `aurioBalance`
- `checkoutTotal`
- `auriosToSpend`
- `isProcessingCheckout`
- `checkoutError`
- `checkoutSignature`
- `activeModal`

## Pendiente entre Devs

- Dev 3 debe entregar firma mobile via Mobile Wallet Adapter.
- Dev 3/negocio debe entregar un `tambuMint` real para probar transferencia completa.
- La UI temporal debe mantener el checkout bloqueado si falta el `tambuMint` real del negocio.
- `EXPO_PUBLIC_AURIO_MINT` identifica el token AURIO; no debe usarse como destino del pago.

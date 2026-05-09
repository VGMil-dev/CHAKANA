# Dev 2 Contract

## Descuento Aurio

- Dev 2 orquesta redencion de descuento con `useCheckout`.
- Dev 2 usa `payToTambu` de `aurio-sdk` para construir la transaccion de redencion cuando existe NFT mint real del Tambu.
- Dev 2 usa `buildAurioTransferTx` para el workaround MVP con wallet destino directa QA.
- Dev 2 recibe `signTransaction(tx)` desde Dev 3 o wallet web temporal.
- Dev 2 envia y confirma la transaccion con `getAurioConnection`.
- Dev 2 refresca balance real con `getAurioBalance(walletPubKey)`.
- Dev 2 nunca resta balance manualmente.
- Dev 2 nunca firma con keypair.
- Dev 2 nunca usa mint authority.
- Dev 2 nunca envia Aurios al mint address.
- Aurio no es el pago principal; solo reduce el total que luego cobra Stripe.

## Redencion MVP

- El flujo ideal usa `payToTambu({ sender, tambuMint, amount })`.
- Para MVP, mientras no exista NFT Tambu con metadata, se usa `buildAurioTransferTx({ sender, recipient: payoutWallet, amount })`.
- Motivo: el valor recibido por Dev 4 era wallet destino, no NFT mint.
- `payToTambu` requiere NFT mint con metadata Metaplex.
- Si se le pasa wallet directa, falla con `Tambu NFT metadata account not found.`
- `EXPO_PUBLIC_QA_TAMBU_MINT` queda reservado para NFT mint real.
- `EXPO_PUBLIC_QA_PAYOUT_WALLET` se usa para wallet directa QA.
- No usar `AURIO_MINT` como destino.
- No restar balance manualmente.
- Despues de la redencion, balance se refresca con `getAurioBalance`.

## Checkout hibrido Aurio + Stripe

- Aurio es descuento opcional.
- Stripe es pago final.
- Usuario puede pagar sin usar Aurios.
- Si usa Aurios, primero se redimen y se obtiene `aurioSignature`.
- La redencion guarda `redeemedAurios` para mantener estable el descuento aunque el balance real baje.
- Despues Stripe cobra el total final.
- Stripe requiere sesion Supabase activa antes de crear la sesion de checkout.
- Para MVP, la redencion Aurio usa `buildAurioTransferTx` hacia payout wallet QA.
- En futuro, la redencion puede usar `payToTambu` con NFT Tambu metadata.
- Backend debe verificar `aurioSignature` antes de aplicar descuento en produccion.
- `useHybridCheckout` orquesta la secuencia sin mezclar `aurio-sdk` con el servicio Stripe.

## Comentario post-compra

- Despues de una compra Stripe completada, el usuario puede publicar un comentario.
- La UI existente `ReviewForm` usa `useReviewSubmit`.
- El comentario debe tener minimo 50 palabras.
- 1 comentario valido recompensa 1 Aurio.
- 1 Aurio = $0.01 USD de descuento futuro.

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
- Dev 3/negocio debe entregar un `tambuMint` real para probar `payToTambu` completo.
- La UI temporal debe mantener el checkout bloqueado si falta destino (`tambuMint` real o payout wallet QA).
- `EXPO_PUBLIC_AURIO_MINT` identifica el token AURIO; no debe usarse como destino del pago.

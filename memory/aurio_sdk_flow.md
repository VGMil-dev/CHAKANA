# Aurio SDK Flow

## Reward por resena

- Dev 2 llama la Edge Function `mint-aurio-on-review`.
- Dev 4 mintea AURIO server-side.
- Dev 2 espera la confirmacion del endpoint y refresca balance real con `getAurioBalance(walletPubKey)`.
- Dev 2 no suma Aurios manualmente y no usa mint authority.

## Descuento Aurio

- El usuario elige cuantos Aurios usar como descuento.
- La regla economica es `1 Aurio = $0.01 USD`.
- El descuento maximo es 25% del total.
- El maximo a gastar es `min(25% del total en Aurios, aurioBalance)`.
- Flujo ideal: `useCheckout` construye la transaccion de redencion con `payToTambu({ sender, tambuMint, amount })`.
- Dev 2 recibe `signTransaction` desde wallet/Dev 3.
- Dev 2 envia la transaccion con `getAurioConnection().sendRawTransaction(...)`.
- Dev 2 confirma con `confirmTransaction(signature, 'confirmed')`.
- Dev 2 refresca balance real con `getAurioBalance(walletPubKey)`.
- Aurio no cobra el pedido completo; solo reduce el total que luego cobra Stripe.

## Redencion MVP

- El flujo ideal usa `payToTambu({ sender, tambuMint, amount })`.
- Para MVP, mientras no exista NFT Tambu con metadata, se usa `buildAurioTransferTx({ sender, recipient: payoutWallet, amount })`.
- Motivo: el valor recibido por Dev 4 era wallet destino, no NFT mint.
- `payToTambu` requiere NFT mint con metadata Metaplex.
- Si se le pasa una wallet directa, falla con `Tambu NFT metadata account not found.`
- `EXPO_PUBLIC_QA_TAMBU_MINT` queda reservado para NFT mint real.
- `EXPO_PUBLIC_QA_PAYOUT_WALLET` se usa para wallet directa QA.
- No usar `AURIO_MINT` como destino.
- No restar balance manualmente.
- Despues de la redencion, balance se refresca con `getAurioBalance`.

## Checkout hibrido Aurio + Stripe

- Aurio es descuento opcional.
- Stripe es el pago final con tarjeta/fiat.
- El usuario puede pagar sin usar Aurios; en ese caso no hay transaccion Aurio.
- Si usa Aurios, primero se redimen y se obtiene `aurioSignature`.
- Despues Stripe cobra el total final: `subtotal - descuentoAurio`.
- Para MVP, la redencion Aurio usa `buildAurioTransferTx` hacia payout wallet QA.
- En futuro, la redencion puede usar `payToTambu` con NFT Tambu metadata.
- Backend debe verificar `aurioSignature` antes de aplicar descuento en produccion.

## Pendiente

- Falta definir un `tambuMint` real del negocio para probar `payToTambu` end-to-end en la pantalla temporal.
- No usar el mint address de AURIO como destino del negocio.
- `tambuMint` identifica el NFT/negocio para resolver la wallet destino.
- Mientras no exista `EXPO_PUBLIC_QA_TAMBU_MINT` ni `EXPO_PUBLIC_QA_PAYOUT_WALLET`, el boton de checkout real queda deshabilitado.
- Para `raiz-cafe`, Dev 2 necesita que Dev 3/negocio entregue el `tambuMint` real antes de probar transferencia.

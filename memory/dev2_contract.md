# Dev 2 Contract

## Checkout Aurio

- Dev 2 orquesta checkout con `useCheckout`.
- Dev 2 usa `payToTambu` de `aurio-sdk` para construir la transaccion cuando existe NFT mint real del Tambu.
- Dev 2 usa `buildAurioTransferTx` para el workaround MVP con wallet destino directa QA.
- Dev 2 recibe `signTransaction(tx)` desde Dev 3 o wallet web temporal.
- Dev 2 envia y confirma la transaccion con `getAurioConnection`.
- Dev 2 refresca balance real con `getAurioBalance(walletPubKey)`.
- Dev 2 nunca resta balance manualmente.
- Dev 2 nunca firma con keypair.
- Dev 2 nunca usa mint authority.
- Dev 2 nunca envia Aurios al mint address.

## Checkout MVP

- El flujo ideal usa `payToTambu({ sender, tambuMint, amount })`.
- Para MVP, mientras no exista NFT Tambu con metadata, se usa `buildAurioTransferTx({ sender, recipient: payoutWallet, amount })`.
- Motivo: el valor recibido por Dev 4 era wallet destino, no NFT mint.
- `payToTambu` requiere NFT mint con metadata Metaplex.
- Si se le pasa wallet directa, falla con `Tambu NFT metadata account not found.`
- `EXPO_PUBLIC_QA_TAMBU_MINT` queda reservado para NFT mint real.
- `EXPO_PUBLIC_QA_PAYOUT_WALLET` se usa para wallet directa QA.
- No usar `AURIO_MINT` como destino.
- No restar balance manualmente.
- Despues del pago, balance se refresca con `getAurioBalance`.

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

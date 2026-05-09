# Aurio SDK Flow

## Reward por resena

- Dev 2 llama la Edge Function `mint-aurio-on-review`.
- Dev 4 mintea AURIO server-side.
- Dev 2 espera la confirmacion del endpoint y refresca balance real con `getAurioBalance(walletPubKey)`.
- Dev 2 no suma Aurios manualmente y no usa mint authority.

## Checkout con Aurios

- El usuario elige cuantos Aurios usar como descuento.
- La regla economica es `1 Aurio = $0.01 USD`.
- El descuento maximo es 25% del total.
- El maximo a gastar es `min(25% del total en Aurios, aurioBalance)`.
- `useCheckout` construye la transaccion con `payToTambu({ sender, tambuMint, amount })`.
- Dev 2 recibe `signTransaction` desde wallet/Dev 3.
- Dev 2 envia la transaccion con `getAurioConnection().sendRawTransaction(...)`.
- Dev 2 confirma con `confirmTransaction(signature, 'confirmed')`.
- Dev 2 refresca balance real con `getAurioBalance(walletPubKey)`.
- Dev 2 abre el estado/modal `propina` despues de confirmar.

## Pendiente

- Falta definir un `tambuMint` real del negocio para probar transferencia end-to-end en la pantalla temporal.
- No usar el mint address de AURIO como destino del negocio.
- `tambuMint` identifica el NFT/negocio para resolver la wallet destino.
- Mientras `DEMO_TAMBU_MINT` este vacio, el boton de checkout real queda deshabilitado.
- Para `raiz-cafe`, Dev 2 necesita que Dev 3/negocio entregue el `tambuMint` real antes de probar transferencia.

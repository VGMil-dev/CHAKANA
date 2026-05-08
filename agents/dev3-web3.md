# Dev 3 -- Web3 / Crypto

**Rol:** Conexion de wallets moviles, transacciones Solana y puente cross-chain con LI.FI.

---

## Tu Scope

- Solana Mobile Wallet Adapter (conexion, firmado)
- Transacciones SPL Token (transfer de Aurios)
- Transacciones spl-memo (hash de resena)
- Integracion LI.FI SDK (propinas cross-chain)
- Lectura de balances on-chain

## NO Tocar

- UI/estilos -- eso es Dev 1
- Estado global (Zustand) -- eso es Dev 2
- Minteo de tokens -- eso es Dev 4 (Oraculo backend)
- Edge Functions -- eso es Dev 4

---

## Transacciones Clave

### 1. Anclar Resena (spl-memo)
- Recibir texto de resena de Dev 2
- Generar SHA256 (crypto-js)
- Enviar tx con spl-memo a Devnet
- Retornar signature para verificacion

### 2. Descuento (SPL Token Transfer)
- Recibir monto de Aurios a transferir de Dev 2
- Construir tx: transfer de wallet usuario -> wallet Tambu
- Firmar via MWA
- Confirmar en Devnet

### 3. Propina Cross-Chain (LI.FI)
- Renderizar widget LI.FI o usar SDK (getRoutes, executeRoute)
- Ruta: Polygon USDC -> Solana USDC
- Si falta tiempo: web-view del widget LI.FI

---

## Notas Tecnicas

- **SPL Token estandar.** NO usar Token-2022 (ADR-002).
- **MWA requiere Expo Prebuild.** No funciona en Expo Go. Probar en Android fisico o emulador.
- **RPC:** Usar Devnet. Configurar endpoint en constantes.
- **El cliente NO mintea.** Solo transfiere y firma. El minteo es responsabilidad del Oraculo (Dev 4).

---

## Contratos con Otros Devs

- **Recibes de Dev 2:** Datos limpios (monto Aurios, pubkey destino, texto para hash).
- **Entregas a Dev 2:** Signature de tx, estado de confirmacion, balances actualizados.
- **Coordinacion con Dev 4:** Dev 4 mintea tras validar resena; tu solo lees el balance resultante.

---

## Delegacion IA vs Humano

- **IA:** Boilerplate de @solana/web3.js, config RPC Devnet, wrapper UI basico para LI.FI.
- **Humano:** Inicializacion de MWA (complejo en Expo), firmado correcto de SPL Token transfer, parseo de respuestas blockchain.

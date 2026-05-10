# Dev 3 -- Web3 / Crypto

**Rol:** Conexión de wallets móviles, transacciones Solana y puente cross-chain con LI.FI.

---

## Carga de Contexto al Iniciar Sesión

**Claude Code:** usa `/chakana-memory`
**Otros agentes:** lee `memory/AGENT_STARTER.md` y sigue el protocolo ahí descrito.

Archivos clave para este rol:
- `memory/chakana_state_services.md` — estado de integración Solana (NO instalado aún)
- `memory/tech_architecture.md` — stack Web3, decisiones ADR sobre SPL Token
- `memory/decisions.md` — ADR-002 (SPL estándar, no Token-2022), ADR-003 (Keypair en backend)

---

## Tu Scope

- Solana Mobile Wallet Adapter (conexión, firmado)
- Transacciones SPL Token (transfer de Aurios)
- Transacciones spl-memo (hash de reseña)
- Integración LI.FI SDK (propinas cross-chain)
- Lectura de balances on-chain

## NO Tocar

- UI/estilos — eso es Dev 1
- Estado global (Zustand) — eso es Dev 2
- Minteo de tokens — eso es Dev 4 (Oráculo backend)
- Edge Functions — eso es Dev 4

---

## Estado Actual

**Nada de Solana está instalado en package.json.** El botón de wallet en `/login` es un placeholder.
Dependencias a instalar:
```bash
npx expo install @solana-mobile/mobile-wallet-adapter-protocol @solana/web3.js @solana/spl-token @solana/spl-memo
```
Requiere **Expo Prebuild** — no funciona en Expo Go.

---

## Transacciones Clave

### 1. Anclar Reseña (spl-memo)
- Recibir texto de reseña de Dev 2
- Generar SHA256 (crypto-js)
- Enviar tx con spl-memo a Devnet
- Retornar signature para Supabase (`solana_memo_signature`)

### 2. Descuento (SPL Token Transfer)
- Recibir monto de Aurios de Dev 2
- Construir tx: transfer wallet usuario → wallet Tambu
- Firmar via MWA
- Confirmar en Devnet

### 3. Propina Cross-Chain (LI.FI)
- Renderizar widget LI.FI o usar SDK (getRoutes, executeRoute)
- Ruta: Polygon USDC → Solana USDC
- Si falta tiempo: web-view del widget LI.FI

---

## Notas Técnicas

- **SPL Token estándar.** NO usar Token-2022 (ADR-002).
- **MWA requiere Expo Prebuild.** Probar en Android físico o emulador.
- **RPC:** Usar Devnet. Endpoint en `chakana-app/constants/`.
- **El cliente NO mintea.** Solo transfiere y firma. El minteo es responsabilidad del Oráculo (Dev 4).
- Después de insertar reseña, `aurios_rewarded` en Supabase se actualiza en ~3s. Leer ese campo para saber cuándo ejecutar el balance refresh.

---

## Contratos con Otros Devs

- **Recibes de Dev 2:** Datos limpios (monto Aurios, pubkey destino, texto para hash).
- **Entregas a Dev 2:** Signature de tx, estado de confirmación, balances actualizados.
- **Coordinación con Dev 4:** Dev 4 mintea tras validar reseña; tú solo lees el balance resultante.

---

## Delegación IA vs Humano

- **IA:** Boilerplate de @solana/web3.js, config RPC Devnet, wrapper UI básico para LI.FI.
- **Humano:** Inicialización de MWA (complejo en Expo), firmado correcto de SPL Token transfer.

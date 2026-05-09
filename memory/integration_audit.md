# Chakana — Integration Audit

## Resumen

El proyecto quedó dividido en dos apps Expo después del merge:

- `mobile/`: app lógica temporal de Dev 2. Tiene `package.json`, `node_modules`, `.env.local`, `mobile/app/index.tsx` y consume los módulos reales de `src/`.
- `chakana-app/`: UI final de Dev 1. Tiene rutas, componentes visuales, stores mock/locales y datos mock, pero no está conectada a la lógica real de `src/`.
- La raíz `CHAKANA/` no tiene `package.json`; por eso `npx expo start` falla desde la raíz.

La integración recomendada es usar `mobile/` como runtime base porque ya contiene dependencias de lógica (`aurio-sdk`, Supabase, Solana/MWA) y mover/conectar ahí la UI de `chakana-app/`, o copiar explícitamente esas dependencias y `src/` si se decide arrancar desde `chakana-app/`. Para MVP 48h, la ruta más segura es mantener `mobile/` como app ejecutable y reemplazar su pantalla temporal por la UI real.

## Lo que ya funciona

- Wallet:
  - `src/hooks/useWallet.ts` conecta wallet web vía `window.solana` y mobile vía Mobile Wallet Adapter authorize.
  - Guarda `walletPubKey`, `isConnected` y balance en Zustand.
- Balance Aurio:
  - `useWallet` refresca con `getAurioBalance(walletPubKey)`.
  - No hay escrituras manuales de balance detectadas; el balance se lee on-chain.
- Reseña reward:
  - `src/hooks/useReviewSubmit.ts` valida mínimo 50 palabras.
  - Llama `submitReviewReward` y luego refresca balance real con `getAurioBalance`.
  - Abre `activeModal = "reviewSuccess"` cuando termina.
- Edge Function Dev 4:
  - `src/services/supabase/reviews.service.ts` llama `POST /functions/v1/mint-aurio-on-review`.
  - Body actual: `userWallet`, `reviewText`, `businessId`.
  - Maneja 400/401/500 con mensajes claros.
- Checkout lógico:
  - `src/hooks/useCheckout.ts` usa `payToTambu`, recibe `signTransaction`, envía con `getAurioConnection().sendRawTransaction`, confirma y refresca balance.
  - Abre `activeModal = "propina"` después de confirmar.
- Descuento:
  - `src/utils/discountCalculator.ts` define `1 Aurio = $0.01` y máximo 25%.
  - Clampea por balance y por máximo permitido.
- Pantalla temporal Dev 2:
  - `mobile/app/index.tsx` prueba wallet, balance, reseña reward y checkout lógico.
  - Checkout real usa payout wallet QA mientras no exista NFT Tambu con metadata.

## Lo que falta unir

- Login/register visual de Dev 1 debe usar `src/hooks/useAuth` y/o `src/hooks/useWallet`, no `chakana-app/hooks/useAuth` mock.
- Home visual debe usar `useBusinesses`, no `chakana-app/data/tambuses.ts`.
- Tambu detail/inventario debe recibir o seleccionar `tambuActivo`, y resolver `businessId`/`tambuMint` real.
- Carrito/checkout visual debe conectarse a `useCheckout`, `useDiscount`, `useWalletSigner`/Dev 3 y `useCartTotal` o equivalente.
- Review form visual no existe como flujo real en `chakana-app/`; debe agregarse/conectarse a `useReviewSubmit`.
- Propina modal/LI.FI no está implementado; actualmente solo existe el estado `activeModal = "propina"`.
- Dashboard Tambu usa mocks (`DASHBOARD_MOCK`) y audio player local; no hay integración real con reviews/audio report.
- Dev 3 todavía debe entregar firma mobile real; `useWalletSigner` solo firma en web y en mobile devuelve TODO.

## Mapa UI Dev 1 → Hooks Dev 2

| Pantalla/Componente Dev 1 | Props que espera | Hook Dev 2 que debería usar | Estado actual | Acción necesaria |
| --- | --- | --- | --- | --- |
| `chakana-app/app/(auth)/login.tsx` | email, password, loading, error, wallet button | `useAuth`, `useWallet` o hook Dev 3 | Usa `chakana-app/hooks/useAuth` con cuentas fake; wallet Phantom es placeholder | Reemplazar mock auth por `src/hooks/useAuth`; conectar botón Phantom a `useWallet.connectWallet` o adaptador Dev 3 |
| `chakana-app/app/(auth)/register.tsx` | name, email, password, loading, error, wallet button | `useAuth`, `useWallet` | Usa `chakana-app/hooks/useAuth` fake; wallet placeholder | Conectar a `register(email,password,displayName)` real y wallet real |
| `chakana-app/app/(app)/home.tsx` + `TambuFeed` | `tambus`, categoría activa, header balance | `useBusinesses`, `useWallet`/`useAurioBalance` | Usa `TAMBUSES` mock y amount hardcodeado `2840` | Cargar `listaTambus`, mapear campos DB a props visuales, mostrar balance real |
| `chakana-app/components/home/TambuCard.tsx` | `id`, `name`, `barrio`, `cat`, `tone`, `rating`, `n`, `aurios` | `useBusinesses.selectTambu` desde contenedor | Link directo a `/inventario/${id}` con tipo mock | Adaptar card visual a `Business` real o crear mapper UI; seleccionar tambu antes de navegar |
| `chakana-app/app/(app)/inventario/[tambuid].tsx` | `tambuid`, products, cart actions | `useBusinesses`, store/cart temporal | Usa `getTambu` y `getProducts` mocks | Resolver `businessId`, `wallet_pubkey`/`tambuMint` y datos reales/mínimos para Golden Path |
| `chakana-app/app/(app)/carrito.tsx` | cart items, count, total, aurios balance | `useCheckout`, `useWallet`, `useDiscount` | Usa `store/cart` local y balance mock | Mantener cart UI pero alimentar balance real y preparar total para checkout |
| `chakana-app/app/(app)/checkout.tsx` | subtotal, slider pct, aurios, discount, total, pay action | `useCheckout`, `useDiscount`, `useWalletSigner`/Dev 3 | Calcula descuento local por porcentaje; navegaba a ruta inexistente | Usar `setTotal`, `onSliderChange`, `discountResult`, `sliderMax`, `confirmCheckout({ destination, signTransaction })`; eliminar ruta fake |
| `chakana-app/components/checkout/AuriosSlider.tsx` | `initialPct`, `subtotal`, `onPctChange` | `useCheckout.onSliderChange` o wrapper | Usa porcentaje y balance mock importado | Adaptar a cantidad de Aurios o convertir pct→aurios con `sliderMax`; quitar mock |
| `chakana-app/components/checkout/OrderCard.tsx` | `subtotal`, `aurios`, `discount` | `useCheckout.discountResult` | Lee items de `store/cart` local | Puede quedarse visual; props deben venir de hook real |
| Review Form Dev 1 | texto, validación, loading, error, success | `useReviewSubmit` | No se encontró pantalla/form final dedicado en UI Dev 1 | Crear/conectar sección visual existente al hook; enviar `businessId` real |
| Propina Modal | visible, wallet, close | `useActiveModal`, `closeModal` | No hay modal LI.FI conectado; solo estado Dev 2 | Mostrar placeholder cuando `activeModal === 'propina'`; LI.FI puede quedar TODO controlado |
| `chakana-app/app/(app)/dashboard.tsx` | métricas, narrator, insights | futuro hook report/reviews; selectores UI | Usa `DASHBOARD_MOCK`, `AiNarratorPlayer` local | Para MVP dejar mock si no está en Golden Path; documentar como no bloqueante |
| `chakana-app/app/(app)/perfil.tsx` + `EmbajadorView` | user, wallet, balance, role | `useAuth`, `useWallet`, selectores | Usa `chakana-app/store/auth` y números hardcodeados | Conectar user/balance real; rol puede quedar mock si no bloquea demo |

## Integración Dev 3

### Qué existe

- `src/hooks/useWallet.ts`:
  - Web: conecta Phantom/Solflare con `window.solana.connect()`.
  - Mobile: usa MWA `transact(...wallet.authorize(...))` para obtener cuenta.
  - No firma transacciones.
- `src/hooks/useWalletSigner.ts`:
  - Web: expone `signTransaction(tx)` desde `window.solana.signTransaction`.
  - Mobile: devuelve `signTransaction: null`, `canSignTransactions: false`, `signerError: 'TODO Dev 3...'`.
- `src/hooks/useCheckout.ts` ya recibe `signTransaction(tx)` como parámetro; Dev 2 no firma directamente.

### Qué falta

- Dev 3 debe entregar un hook/adaptador único tipo `useWalletSigner` o `useSolanaWallet` que exponga:
  - `publicKey` o compatibilidad con `walletPubKey`.
  - `connectWallet`/`disconnectWallet` si reemplaza `useWallet`.
  - `signTransaction(tx)` para web y mobile, o una ruta explícita `signAndSendTransaction` si MWA obliga a enviar desde wallet.
- Mobile Wallet Adapter puede firmar o firmar+y+enviar según método soportado por wallet. Si Chakana quiere enviar con `getAurioConnection()`, Dev 3 debe usar flujo de firma (`sign_transactions`) y devolver la transacción firmada. Si usa `sign_and_send_transactions`, entonces `useCheckout` tendría que cambiar contrato para recibir signature directamente.
- Phantom web `signTransaction` trabaja con objeto `Transaction`/`VersionedTransaction`; el contrato actual de `useCheckout` con `Transaction` es compatible para web inyectado.

### Recomendación

- Mantener `src/hooks/useWalletSigner.ts` como adaptador temporal.
- Dev 3 debe completar ese hook en mobile en vez de crear otra API paralela.
- `useCheckout.confirmCheckout` debe seguir recibiendo `signTransaction` hasta que Dev 3 confirme si mobile soporta firma separada.
- Dev 2/UI no debe importar MWA directamente; solo consumir `useWallet`/`useWalletSigner`.

## Integración Dev 4

### Qué existe

- `submitReviewReward` en `src/services/supabase/reviews.service.ts` llama:
  - URL: `${EXPO_PUBLIC_SUPABASE_URL}/functions/v1/mint-aurio-on-review`
  - Method: `POST`
  - Body: `userWallet`, `reviewText`, `businessId`
  - Response esperada: `success`, `signature`, `mintedTo`, `amount`
- `useReviewSubmit`:
  - No mintea en frontend.
  - No suma balance manualmente.
  - Refresca balance con `getAurioBalance(walletPubKey)` después del reward.

### Riesgo/caveat externo

- La implementación actual manda `Authorization: Bearer EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- La validación externa encontró que la documentación moderna de Supabase Edge Functions prefiere separar `Authorization: Bearer <user-jwt>` de `apikey: <publishable/anon key>`. Si Dev 4 tiene `verify_jwt` activo, usar anon key como bearer puede fallar en configuraciones modernas.
- Para MVP, si la Edge Function actual ya acepta anon bearer, se puede dejar; si falla 401, cambiar a `supabase.functions.invoke(...)` o enviar `apikey` y user JWT según configuración Dev 4.

## Riesgos detectados

- Dos apps Expo conviviendo:
  - `mobile/` corre lógica real.
  - `chakana-app/` contiene UI final pero dependencias incompletas para lógica real (`aurio-sdk`, Supabase, Solana/MWA no están en su `package.json`).
- Store duplicado:
  - `src/store` es store real Dev 2.
  - `chakana-app/store/auth.ts` y `chakana-app/store/cart.ts` son stores locales/mock de Dev 1.
- Auth duplicado:
  - `src/hooks/useAuth.ts` real Supabase.
  - `chakana-app/hooks/useAuth.ts` fake con test accounts.
- Tipos duplicados/incompatibles:
  - `src/types/models.ts` define `Business` camelCase con `rating`, `category`, etc.
  - `src/store/slices/businessSlice.ts` usa `Tables<'businesses'>` con columnas reales: `id`, `name`, `description`, `owner_id`, `wallet_pubkey`.
  - `chakana-app/data/tambuses.ts` define `Tambu` visual con `barrio`, `cat`, `tone`, `n`, `aurios`.
- UI usa mocks donde ya existe lógica real:
  - Datos locales de tambus, dashboard, balance, cuentas de prueba y productos.
- Checkout UI calcula descuento local por porcentaje y no usa `useCheckout`.
- Ruta fake/rota:
  - El checkout navegaba a una ruta inexistente.
- Pantalla temporal Dev 2 convive con UI final:
  - `mobile/app/index.tsx` es prueba de lógica Aurio, no UI final.
- Falta `tambuMint` real:
  - Checkout real usa payout wallet QA mientras no exista NFT Tambu con metadata.
  - No usar el mint address del token como destino ni como NFT Tambu.
- Dev 3 mobile signing pendiente:
  - Sin `signTransaction` mobile no hay checkout E2E real en dispositivo.
- Review form no está integrado en UI final:
  - Existe lógica real, falta superficie visual conectada.
- Supabase Edge Function auth puede requerir ajuste de headers según configuración `verify_jwt`.

## Plan de unión recomendado

### Fase 1: Conectar UI de Dev 1 al store/hooks de Dev 2 sin cambiar lógica

- Elegir runtime base: recomendado `mobile/`.
- Copiar/mover pantallas y componentes visuales de `chakana-app/app` y `chakana-app/components` hacia `mobile/` o configurar imports para usar `src/` desde `chakana-app` con dependencias completas.
- Sustituir `chakana-app/hooks/useAuth` y `chakana-app/store/auth` por `src/hooks/useAuth` + `src/store`/selectores.
- Mantener `store/cart` local solo si se limita al carrito visual; no usarlo para balance/auth/wallet.

### Fase 2: Reemplazar pantalla temporal por pantallas reales

- Reemplazar `mobile/app/index.tsx` por el onboarding/home visual.
- Preservar un acceso temporal a la pantalla de prueba solo si ayuda QA, pero fuera del Golden Path.
- Usar `useBusinesses.fetchBusinesses()` en Home.

### Fase 3: Conectar wallet/signTransaction de Dev 3 al checkout

- Completar `useWalletSigner` mobile o reemplazarlo por hook Dev 3 equivalente.
- Pasar `signTransaction` a `useCheckout.confirmCheckout`.
- Mantener botón de pago bloqueado si `!tambuMint`, `!signTransaction`, `!walletPubKey`, `auriosToSpend <= 0` o `isProcessing`.

### Fase 4: Conectar review form de Dev 1 a `useReviewSubmit`

- Crear o adaptar formulario visual para usar:
  - `currentReviewText`
  - `onTextChange`
  - `isTextValid`
  - `wordsRemaining`
  - `submitReview({ businessId })`
  - `isSubmittingReview`, `reviewError`, `reviewSuccess`
- Usar `businessId` real de `tambuActivo` o params.

### Fase 5: Conectar modal propina / LI.FI

- Primero renderizar placeholder cuando `activeModal === 'propina'`.
- Luego conectar LI.FI si queda tiempo.
- El modal no debe bloquear el checkout completado.

### Fase 6: Testing Golden Path completo

- Ejecutar desde la carpeta app correcta (`mobile/` si se adopta como runtime).
- Validar en web con Phantom para firma si mobile signing no está listo.
- Validar en Android/prebuild cuando Dev 3 complete MWA signing.
- Revisar logs de Edge Function para reward.
- Confirmar balance real después de reward y checkout.

## Golden Path esperado

1. Abrir app.
2. Conectar wallet.
3. Ver balance Aurio real.
4. Entrar a Raíz Café.
5. Escribir reseña válida de mínimo 50 palabras.
6. Recibir 1 Aurio vía Edge Function.
7. Refrescar/ver balance aumentado por lectura real on-chain.
8. Hacer checkout con descuento máximo 25% y clamp por balance.
9. Firmar transacción con wallet Dev 3.
10. Confirmar transacción en devnet.
11. Balance baja por lectura real on-chain.
12. Modal propina aparece.

## Archivos clave revisados

- `mobile/app/index.tsx`: pantalla temporal Dev 2.
- `mobile/package.json`: app lógica con dependencias Solana/Supabase/Aurio.
- `chakana-app/app`: rutas UI final Dev 1.
- `chakana-app/components`: componentes visuales Dev 1.
- `chakana-app/hooks/useAuth.ts`: auth fake de UI.
- `chakana-app/store/auth.ts`, `chakana-app/store/cart.ts`: stores locales UI.
- `chakana-app/data`: mocks de UI.
- `src/hooks`: hooks reales Dev 2/3 temporal.
- `src/store`: Zustand real Dev 2.
- `src/services/supabase`: Supabase/Auth/Edge Function.
- `src/types`: tipos compartidos y duplicaciones potenciales.
- `src/utils`: descuento y slider.
- `memory/aurio_sdk_flow.md`, `memory/dev2_contract.md`, `memory/project_state.md`: contratos existentes.

## Decisión sugerida antes de implementar

Para evitar pérdida de tiempo, decidir explícitamente una de estas rutas:

1. **Recomendada:** `mobile/` es la app final; se migra UI de `chakana-app/` hacia `mobile/` y se conecta a `src/`.
2. **Alternativa:** `chakana-app/` es la app final; se instalan dependencias faltantes, se conecta a `src/`, y se elimina/archiva `mobile/` después.

La opción 1 reduce riesgo porque `mobile/` ya corre con la lógica real y `.env.local`.

# 🚀 CHAKANA — Plan de 48 Horas (Solana Mobile + LI.FI + ElevenLabs)

## 🎯 Objetivo del Demo (Storytelling: "Reciprocidad en Acción")
El demo no será técnico, será una historia. En menos de 2 minutos mostraremos el "Caso 1": Valentina y Raíz Café.
1. **Valentina (Embajadora)** entra a Raíz Café y pide un café por la app.
2. Al ir a pagar, la app le muestra opciones de pago y un posible descuento si usa sus **Aurios** acumulados.
3. Valentina decide aplicar Aurios para un 25% de descuento. Para ello, la app transfiere sus Aurios a la wallet de Raíz Café, y ella paga el resto en efectivo/transferencia.
4. Tras pagar, escribe una reseña sobre el café.
5. Al enviar, el hash de la reseña va a Solana Devnet y el texto a Supabase. Como recompensa por su aporte, Valentina **recibe nuevos Aurios** (mint) en su wallet.
6. Inmediatamente se le muestra un popup para dejar una **propina cross-chain** al barista usando LI.FI, cerrando su experiencia.
7. Cambiamos la vista al Dueño de Raíz Café. Primero, él escucha un **reporte de voz generado por ElevenLabs** resumiendo reseñas recientes. Luego, toma los Aurios que recibió de Valentina y los **quema (burn)** en la red para comprar con descuento su Paquete de Suscripción en Chakana (Gavanti), logrando que el descuento a Valentina no lo empobrezca, sino que reduzca sus costos operativos.

## 👥 Equipo y Roles (Balanced)
- **Dev 1 (Frontend Mobile UI):** Diseño de pantallas en Expo, estilos, navegación, experiencia de usuario fluida.
- **Dev 2 (Frontend Mobile Logic):** Conectar vistas con estados de React, validación de formularios, integración de endpoints.
- **Dev 3 (Web3 / Crypto):** Configuración de Solana Mobile Wallet Adapter, interacción con devnet (spl-memo), e integración del SDK de LI.FI para swaps.
- **Dev 4 (Backend / IA / Product):** Setup de Supabase (almacenamiento de texto), creación de API/Edge Functions para ElevenLabs (para proteger API keys), Prompt Engineering para resúmenes de reseñas, y preparación del Pitch.

## 🛡️ Guardrails y Decisiones Clave (Auto-Resueltas)
- **Vibe Coding (Ejecución Acelerada):** Todo el layout UI/UX y la lógica estándar (navegación, Zustand, formularios) DEBE generarse usando asistentes de IA (vibe coding). El equipo humano solo debe concentrar sus ciclos mentales en la plomería compleja: Web3 (Solana MWA, SPL-Token), LI.FI SDK y el endpoint seguro de ElevenLabs.
- **Data Storage:** El hash va a Solana (spl-memo), pero el texto original DEBE ir a una base de datos off-chain (Supabase) para que ElevenLabs pueda leerlas y resumirlas.
- **Expo Workflow:** No usar "Expo Go" básico. Solana MWA requiere "Development Builds" (Expo Prebuild) y probar en dispositivo Android real o emulador Android Studio.
- **Seguridad IA:** Las API keys de ElevenLabs NO van en la app móvil. Dev 4 creará un endpoint simple en Supabase Edge Functions o un servidor ligero.
- **Tokenomics (Aurios):** Usaremos el estándar SPL Token de Solana (`@solana/spl-token`). Se creará una "Mint Account" en Devnet. El flujo económico: Backend mintea Aurios al usuario por reseñar -> Usuario transfiere Aurios al Tambu para obtener descuento en consumo -> Tambu quema (burn) los Aurios acumulados para obtener descuento en sus Paquetes de Suscripción (B2B).
- **Mecánica de Descuento:** La app restringe el uso de Aurios a máx 25% del total de la cuenta. El usuario transfiere los tokens al wallet del negocio, lo cual garantiza que el local retenga ese valor dentro del ecosistema y no se empobrezca.

## ⏱️ Cronograma de Ejecución

### DÍA 1 (0–24h) → "Fundaciones y Conectividad"

**Fase 1: Setup Inicial (Horas 0-4)**
- [ ] **Dev 1:** Inicializar proyecto `npx create-expo-app` y configurar Tailwind/NativeWind para estilos. Crear estructura de pantallas (Login, Home, Review, Dashboard). 
      *Criterio de Aceptación (QA): Correr la app en emulador; navegar entre todas las pantallas vacías sin crasheos.*
- [ ] **Dev 2:** Configurar Zustand o Context API para el estado global (usuario, reseñas, negocio seleccionado). 
      *Criterio de Aceptación (QA): Consologuear el estado global al pulsar un botón de prueba, verificando que se actualiza.*
- [ ] **Dev 3:** Instalar e inicializar `@solana-mobile/mobile-wallet-adapter-protocol`, `@solana/web3.js`. Lograr conexión exitosa. 
      *Criterio de Aceptación (QA): Click en "Conectar", abrir wallet de prueba (ej. solfare), y mostrar la publicKey en consola/UI.*
- [ ] **Dev 4:** Crear proyecto en Supabase. Configurar tablas `users`, `businesses`, `reviews`. Proveer `.env` al equipo. 
      *Criterio de Aceptación (QA): Realizar un `insert` manual en la tabla `businesses` desde el dashboard de Supabase y verificar que existe.*

**Fase 2: El Core Loop de Reseñas (Horas 4-12)**
- [ ] **Dev 1:** Maquetar formulario de creación de reseñas y lista de reseñas. 
      *Criterio de Aceptación (QA): Escribir texto en el input, verificar que se refleje visualmente y que el scroll funcione.*
- [ ] **Dev 2:** Integrar guardado de reseñas: enviar texto a Supabase desde el front. 
      *Criterio de Aceptación (QA): Enviar formulario y verificar en Supabase dashboard que la nueva fila aparece correctamente.*
- [ ] **Dev 3:** Tomar el texto, generar SHA256 (crypto-js) y enviar tx a Solana Devnet usando `spl-memo`. Añadir instrucción para transferir/mintear tokens "Aurio" a la wallet del usuario como recompensa. 
      *Criterio de Aceptación (QA): Ejecutar tx, copiar el hash de confirmación (signature) y buscarlo en Solana Explorer (devnet) para ver el memo y confirmar que el balance SPL de Aurios aumentó.*
- [ ] **Dev 4:** Configurar Edge Function o servidor intermedio básico. Obtener API Key de ElevenLabs. 
      *Criterio de Aceptación (QA): Llamar al endpoint /health del servidor intermedio y recibir un 200 OK en postman/curl.*

**Fase 3: Transacciones, Descuentos y Cross-chain (Horas 12-24)**
- [ ] **Dev 1:** Crear UI de "Dejar Propina" (LI.FI) y el "Formulario de Pago Físico" en el Tambu (donde el usuario ingresa el monto total de la cuenta, y un slider le permite elegir cuántos Aurios descontar del total, hasta el 25%).
      *Criterio de Aceptación (QA): Renderizar el modal/pantalla de propinas y el checkout de descuento sin errores visuales.*
- [ ] **Dev 2:** Lógica del Slider de Descuento: Validar que 1 Aurio = $0.01 USD de descuento, conectarlo con el balance SPL que reporta Dev 3, e impedir que pase del 25% de la cuenta.
      *Criterio de Aceptación (QA): Si la cuenta es $10.00, el slider solo permite usar hasta 250 Aurios (=$2.50). Si se supera, el botón se bloquea.*
- [ ] **Dev 3:** Integrar SDK de LI.FI para la propina. Implementar el firmado de la transacción SPL Token `transfer` desde la Mobile Wallet Adapter hacia el local, efectuando así el pago con descuento en Aurios.
      *Criterio de Aceptación (QA): Validar ruta de LI.FI correcta. Para el descuento, firmar la tx de transferencia SPL, y comprobar en Devnet Explorer que el Tambu recibe los Aurios correctamente.*
- [ ] **Dev 4:** Probar ElevenLabs API. Enviar texto estático, recibir archivo de audio. 
      *Criterio de Aceptación (QA): Ejecutar script de prueba con la API key, descargar el mp3 y escuchar el audio generado.*

### DÍA 2 (24–48h) → "IA, Pulido y Demo"

**Fase 4: IA y Reportes de Voz (Horas 24-32)**
- [ ] **Dev 1:** Maquetar reproductor de audio en el Dashboard del dueño del Tambu. 
      *Criterio de Aceptación (QA): Reproducir un mp3 local dummy usando expo-av y verificar que los controles (play/pause) funcionan.*
- [ ] **Dev 2:** Conectar el botón "Generar Reporte" con el backend de IA y manejar el estado de carga (loading). 
      *Criterio de Aceptación (QA): Pulsar "Generar", ver el spinner, esperar mock delay, y ver el audio player habilitado sin bloquear la UI.*
- [ ] **Dev 3:** Asistir en la gestión de wallets/firmas si el dueño necesita autenticarse on-chain. Pulir manejo de errores de LI.FI. 
      *Criterio de Aceptación (QA): Interrumpir la conexión a internet durante una transacción y verificar que el error devuelto al usuario es legible ("Error de conexión").*
- [ ] **Dev 4:** Crear endpoint `/generate-report`. Leer reseñas de Supabase -> LLM prompt -> enviar a ElevenLabs -> devolver URL. 
      *Criterio de Aceptación (QA): Llamar al endpoint vía curl con un `business_id` válido, y recibir status 200 con una URL apuntando a un archivo mp3 en Supabase Storage.*

**Fase 5: Ensamblaje Narrativo y Vibe Coding (Horas 32-40)**
- [ ] **Dev 1 & 2:** Aplicar la narrativa exacta de "Reciprocidad en Acción". Renombrar "Usuario" a "Embajador", "Negocio" a "Tambu". Usar Vibe Coding para generar rápidamente animaciones de feedback cuando se ganan Aurios (ej: "Lo que das al ecosistema, vuelve a ti con raíz").
      *Criterio de Aceptación (QA): Navegar por el flujo completo verificando que todos los textos dummy y placeholders fueron reemplazados por el copy narrativo final.*
- [ ] **Dev 3 & 4:** Optimizar tiempos de carga del reporte de voz. 
      *Criterio de Aceptación (QA): Medir el tiempo de respuesta de `/generate-report`. Si tarda > 15s, asegurar que la UI muestre un estado de "Procesando con IA..." sin dar timeout.*

**Fase 6: Testing, Pitch y Video (Horas 40-48)**
- [ ] **Dev 1 & 2:** Grabar la pantalla de la app corriendo el flujo perfecto de extremo a extremo. 
      *Criterio de Aceptación (QA): Reproducir el archivo de video final capturado y asegurar que el flujo completo no tiene lag visual ni cuelgues.*
- [ ] **Dev 3:** Escribir README detallado con instrucciones de setup, links a devnet, e integraciones LI.FI/ElevenLabs. 
      *Criterio de Aceptación (QA): Clonar el repositorio en una nueva carpeta, seguir el README paso a paso y verificar que la app compila localmente en un emulador.*
- [ ] **Dev 4:** Finalizar el Pitch. Cortar y editar el video. Someter proyecto al portal del hackathon. 
      *Criterio de Aceptación (QA): Revisar el portal del hackathon, verificar que los campos obligatorios (Repo, Video, Contratos) están llenos y el estado final es "Submitted".*

## Criterios de Aceptación Finales (Final Verification Wave)
- [ ] **QA.1 - Conectividad:** Instalar la APK en un dispositivo Android físico o emulador con Google Play. Abrir la app, pulsar "Conectar Wallet", aprobar la conexión en la app móvil de Phantom/Solflare y verificar que la UI muestra el estado "Conectado" con la PublicKey recortada.
- [ ] **QA.2 - Core Blockchain:** Rellenar el formulario de reseña con "Excelente servicio", pulsar Enviar, firmar transacción en la wallet móvil y revisar la base de datos (Supabase) para confirmar la inserción del texto, así como el Explorer Link (Solana Devnet) para confirmar la transacción del spl-memo.
- [ ] **QA.3 - Integración LI.FI:** Iniciar el flujo de propina (Tip) post-reseña. Seleccionar 1 USDC en red origen (ej. Polygon) hacia la wallet del negocio en Solana (destino). Aprobar la firma y validar que la UI muestra el estado "Success" o que el webhook/status endpoint de LI.FI confirma el puenteo.
- [ ] **QA.4 - Integración ElevenLabs:** Entrar al Dashboard del Dueño. Pulsar "Generar Análisis de Reseñas". Esperar spinner de procesamiento. Presionar "Play" en el reproductor renderizado y escuchar claramente una voz generada por IA resumiendo las reseñas previamente ingresadas.
- [ ] **QA.5 - Entregable Hackathon (Pitch de Reciprocidad):** El pitch y demo en video (Caso de Valentina y Raíz Café) se reproduce de principio a fin de forma fluida, validando un límite máximo de 3 minutos. El discurso evidencia explícitamente cómo Chakana recompensa el comportamiento orgánico mediante los 3 bounties integrados (Solana Mobile, LI.FI, ElevenLabs).
- [ ] **QA.6 - Mecánica de Descuento (Transferencia de Aurios):** Simular una orden de $10.00. Aplicar el 25% de descuento usando 250 Aurios (1 Aurio = $0.01). Pulsar "Pagar", aprobar el firmado de la transferencia SPL Token en Phantom. Verificar en Solana Explorer que el Tambu recibió los 250 Aurios. (La quema o "burn" por parte del Tambu para pagar sus paquetes Gavanti se explicará de forma teórica en el pitch para mantener el límite de 48h).

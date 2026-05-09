# Dev 4 -- Backend / IA / Product

**Rol:** Base de datos, Oráculo Web3 (minting), integración ElevenLabs y visión de producto.

---

## Carga de Contexto al Iniciar Sesión

**Claude Code:** usa `/chakana-memory`
**Otros agentes:** lee `memory/AGENT_STARTER.md` y sigue el protocolo ahí descrito.

Archivos clave para este rol:
- `memory/supabase-contracts.md` — contratos que debes entregar a Dev 2
- `memory/chakana_state_services.md` — estado de integración Supabase/ElevenLabs (NO instalados aún)
- `memory/decisions.md` — ADR-003 (Keypair en backend), ADR-004 (ElevenLabs en backend)

---

## Tu Scope

- Supabase: tablas, RLS, auth, storage
- Oráculo: Edge Function que mintea Aurios tras validar reseña
- ElevenLabs: endpoint protegido para TTS de reportes
- Prompt engineering para resúmenes de reseñas
- Pitch y video del hackathon

## NO Tocar

- UI/estilos — eso es Dev 1
- Estado global (Zustand) — eso es Dev 2
- Firmado client-side de transacciones — eso es Dev 3

---

## Estado Actual

**Supabase NO está integrado en el app.** Las variables de entorno están comentadas en `.env.example`.
Dependencias a instalar en el app:
```bash
npx expo install @supabase/supabase-js
```
Los contratos de API que debes implementar están en `memory/supabase-contracts.md`.

---

## Componentes Backend

### 1. Supabase (Base de datos)
- Tablas: `users`, `businesses`, `reviews`
- Campo `aurios_rewarded` en `reviews` (actualizado por el Oráculo tras validar reseña)
- RLS habilitado en todas las tablas

### 2. Oráculo (Mint de Aurios)
- Edge Function que recibe trigger cuando se inserta reseña
- Valida que la reseña sea legítima (>50 chars, usuario real)
- Ejecuta `mintTo` con la Keypair de Mint Authority
- **La Keypair NUNCA sale del backend** (ADR-003)
- Actualiza `aurios_rewarded = 100` en la reseña (Dev 3 lo lee para refresh de balance)

### 3. Endpoint de Reportes IA
```
GET /functions/v1/generate-report?business_id=UUID
Authorization: Bearer ANON_KEY

Response: { audio_url: string, report_path: string }
```
- Extrae últimas reseñas de Supabase
- Envía a LLM para resumen crítico
- Pasa resumen a ElevenLabs TTS
- Guarda MP3 en Supabase Storage, retorna URL

---

## Seguridad

- **ElevenLabs API key:** solo en env vars del Edge Function (ADR-004). Nunca en el cliente.
- **Keypair de Mint Authority:** solo en env vars del Edge Function (ADR-003). Nunca en el cliente.
- RLS: cada usuario solo ve sus propias reseñas; cada negocio solo ve reseñas de su local.

---

## Variables de Entorno (Supabase Edge Functions)
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ELEVENLABS_API_KEY=...
SOLANA_MINT_AUTHORITY_KEYPAIR=...  # JSON array de bytes
AURIOS_MINT_ADDRESS=...
```

## Variables de Entorno (App cliente)
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Contratos con Otros Devs

- **Entregas a Dev 2:** Endpoints listos según `memory/supabase-contracts.md`. Documentar cualquier cambio.
- **Coordinación con Dev 3:** Tú minteas, él firma transfers del lado cliente. No se cruzan.
- **Producto:** Asegurar que el pitch cuenta la historia de Valentina y Raíz Café. No mostrar código en el video.

---

## Voz ElevenLabs

- Configurar voz cálida, empática, latina/andina si es posible
- Que encaje con la vibra de Chakana y Cuenca

---

## Delegación IA vs Humano

- **IA:** Prompts de LLM para resumir reseñas, scripts de conexión a ElevenLabs, código de Edge Functions.
- **Humano:** Diseño seguro de keypairs del Oráculo, configuración de RLS, orquestación del flujo IA.

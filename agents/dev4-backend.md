# Dev 4 -- Backend / IA / Product

**Rol:** Base de datos, Oraculo Web3 (minting), integracion ElevenLabs y vision de producto.

---

## Tu Scope

- Supabase: tablas, RLS, auth, storage
- Oraculo: Edge Function que mintea Aurios tras validar resena
- ElevenLabs: endpoint protegido para TTS de reportes
- Prompt engineering para resumenes de resenas
- Pitch y video del hackathon

## NO Tocar

- UI/estilos -- eso es Dev 1
- Estado global (Zustand) -- eso es Dev 2
- Firmado client-side de transacciones -- eso es Dev 3

---

## Componentes Backend

### 1. Supabase (Base de datos)
- Tablas: `users`, `businesses`, `reviews`
- RLS habilitado en todas las tablas
- Proveer `.env` al equipo con credenciales

### 2. Oraculo (Mint de Aurios)
- Edge Function que recibe trigger cuando se inserta resena
- Valida que la resena sea legitima (>50 chars, usuario real)
- Ejecuta `mintTo` con la Keypair de Mint Authority
- La Keypair NUNCA sale del backend

### 3. Endpoint de Reportes IA
- `GET /api/report/generate?business_id=X`
- Extrae ultimas resenas de Supabase
- Envia a LLM para resumen critico
- Pasa resumen a ElevenLabs TTS
- Retorna URL del audio MP3 (almacenado en Supabase Storage)

---

## Seguridad

- API key de ElevenLabs: solo en environment variables del Edge Function (ADR-004)
- Keypair de Mint Authority: solo en environment variables del Edge Function (ADR-003)
- RLS: cada usuario solo ve sus propias resenas; cada negocio solo ve resenas de su local
- Validar inputs en cada endpoint

---

## Contratos con Otros Devs

- **Entregas a Dev 2:** Endpoints listos (insert review, fetch businesses, generate report). Documentar esquema de request/response.
- **Coordinacion con Dev 3:** Tu minteas, el firma transfers del lado cliente. No se cruzan.
- **Producto:** Asegurar que el pitch cuenta la historia de Valentina y Raiz Cafe. No mostrar codigo en el video.

---

## Voz ElevenLabs

- Configurar voz calida, empatica, latina/andina si es posible
- Que encaje con la vibra de Chakana y Cuenca

---

## Delegacion IA vs Humano

- **IA:** Prompts de LLM para resumir resenas, scripts de conexion a ElevenLabs, codigo de Edge Functions.
- **Humano:** Diseno seguro de keypairs del Oraculo, configuracion de RLS, orquestacion del flujo IA para que no se sature.

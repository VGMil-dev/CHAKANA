# Chakana Hackathon MVP — Dev 4: Backend / IA / Product

**Rol:** Base de datos asíncrona, Oráculo Web3 (Minting), Integración ElevenLabs y visión de producto.

## 1. División de Trabajo (Humano vs IA)
- **IA (Vibe Coding):** Prompts de LLM para resumir reseñas, scripts de conexión a ElevenLabs, código de Supabase Edge Functions.
- **Humano:** Diseño seguro de las claves privadas del Oráculo de Solana, configuración de RLS (Row Level Security) en Supabase y orquestación del flujo de IA (ElevenLabs) para asegurar que no se sature.

## 2. Arquitectura Backend & IA

```mermaid
graph LR
    A[App Móvil] -->|Texto Reseña| B(Supabase DB)
    B -->|Webhook / Trigger| C[Supabase Edge Function\n(Oráculo)]
    
    C -->|1. Valida Reseña| C
    C -->|2. SPL MintTo| D[(Solana Devnet)]
    D -->|Aurios| A
    
    A -->|Dueño Pide Reporte| E[Edge Function / Endpoint IA]
    E -->|Extrae Textos| B
    E -->|Manda Prompt| F[LLM (Resumen Crítico)]
    F -->|Texto a Voz| G[ElevenLabs API]
    G -->|Buffer Audio mp3| E
    E -->|URL Audio| A
```

## 3. Componentes Críticos
- **Oráculo (Acreditación de Aurios):** La app móvil NO DEBE poder mintear tokens, eso sería un fallo de seguridad terrible. El Edge Function en Supabase (o un server NestJS lite) tiene la Keypair con "Mint Authority". Al verificar que entró una nueva reseña legítima a la DB, el Oráculo firma y envía la orden `mintTo` a la wallet del usuario en Devnet.
- **ElevenLabs:** 
  - La clave de API de ElevenLabs DEBE estar solo en el backend.
  - Solicitar el endpoint de Text-To-Speech.
  - Configurar una voz cálida, empática, y andina/latina si es posible, de acuerdo a la vibra de "Chakana" y Cuenca.
  
## 4. El Rol de "Product Owner"
Eres responsable de que el Pitch del hackathon (el video de 3 mins) sea perfecto.
- Revisa el plan `chakana-48h-team-plan.md` y asegúrate de que el video cuenta la historia del **Caso 1 (Valentina y Raíz Café)**.
- No muestres código en el video, muestra **"Reciprocidad en Acción"**.
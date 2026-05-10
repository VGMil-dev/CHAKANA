<div align="center">
  <img src="https://github.com/user-attachments/assets/157ef459-2a03-4e8b-99de-8338b82d3bca" alt="Header CHAKANA" width="900" style="border-radius: 16px;" />

  <p><strong>🌎 Infraestructura de confianza para comercio local circular</strong></p>

  <p>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/licencia-MIT-0f766e.svg" alt="Licencia MIT" /></a>
    <img src="https://img.shields.io/badge/estado-MVP%20Hackathon-c2410c.svg" alt="MVP Hackathon" />
    <img src="https://img.shields.io/badge/blockchain-Solana%20Devnet-9945FF.svg?logo=solana&logoColor=white" alt="Solana Devnet" />
    <img src="https://img.shields.io/badge/backend-Supabase-3ECF8E.svg?logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/mobile-Expo-000020.svg?logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/pagos-Stripe-635BFF.svg?logo=stripe&logoColor=white" alt="Stripe" />
  </p>
</div>

---

## ✨ ¿Qué es CHAKANA?

CHAKANA es una plataforma ancestral-moderna para economía circular local. Combina experiencia móvil, verificación en blockchain e incentivos programables (tokens Aurio) para que el impacto comunitario sea **confiable, recompensado y escalable**.

Conectamos consumidores conscientes con comerciantes locales a través de reseñas verificadas, recompensas en tokens y flujos de comercio transparentes — todo anclado en Solana.

## 🎯 Por Qué Importa

- **Confianza desde el origen:** Las acciones comunitarias se pueden verificar y auditar on-chain.
- **Incentivos reales:** El modelo de token Aurio conecta valor social con valor económico.
- **Comercio inclusivo:** Los negocios locales acceden a flujos de valor digitales.
- **Narrativa + datos:** Historias humanas e impacto medible conviven en una sola experiencia.

---

## 🧭 Golden Path de Demo (para Jurado)

```
Onboarding → Login → Home → Inventario → Carrito → Checkout → Pago → Reseña → Home
```

1. **Conectar wallet** — la persona enlaza su wallet Solana (Phantom en web, mobile wallet adapter en nativo).
2. **Explorar inventario** — navega productos de comerciantes locales (Tambús).
3. **Agregar al carrito y pagar** — Stripe procesa fiat, Aurio entrega recompensas.
4. **Enviar reseña** — un hash verificable se ancla en Solana devnet.
5. **Ganar Aurios** — se activa la lógica de recompensas, el balance se actualiza en tiempo real.

> [!TIP]
> Este es el camino más rápido para entender la experiencia completa del producto.

---

## 🧱 Pilares del Producto

| Pilar | Descripción |
|-------|-------------|
| **Reseñas verificadas y reputación** | Reseñas ancladas on-chain que los comerciantes no pueden falsificar |
| **Recompensas Aurio** | Incentivos en tokens por acciones comunitarias sostenibles |
| **Herramientas para comercios** | Tambús (catálogo de productos, órdenes, pagos) |
| **Pagos cross-chain** | Interoperabilidad impulsada por LI.FI |
| **Reportes de voz con IA** | Narrativa de impacto con ElevenLabs (solo backend) |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Mobile | Expo SDK 55 + React Native (Nueva Arquitectura) |
| Routing | Expo Router (file-based, rutas tipadas) |
| Estado | Zustand |
| Blockchain | Solana Devnet (`@solana/web3.js`) |
| Backend | Supabase (Auth, Postgres, RLS, Edge Functions) |
| Pagos | Stripe Connect |
| Cross-chain | LI.FI |
| IA de voz | ElevenLabs (solo server-side) |

---

## 🚀 Inicio Rápido (para Jurado)

### Requisitos Previos

| Herramienta | Versión | Instalación |
|-------------|---------|-------------|
| **Node.js** | >= 18 LTS | [nodejs.org](https://nodejs.org) |
| **npm** | >= 9 | Viene con Node |
| **Expo CLI** | latest | `npm install -g expo-cli` |
| **Supabase CLI** | latest | `npm install -g supabase` |
| **Phantom wallet** | — | [phantom.app](https://phantom.app) (para demo web) |

> **La forma más rápida de ver la demo:** ejecuta la versión **web** — no requiere Android Studio ni Xcode.

### 1. Clonar e Instalar

```bash
git clone https://github.com/<tu-org>/CHAKANA.git
cd CHAKANA

# Instalar dependencias raíz
npm install

# Instalar dependencias de la app
cd chakana-app
npm install
```

### 2. Variables de Entorno

```bash
cd chakana-app
cp .env.example .env.local
```

Edita `.env.local` con las credenciales proporcionadas para el hackathon:

```env
EXPO_PUBLIC_SUPABASE_URL=<proporcionado-por-el-equipo>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<proporcionado-por-el-equipo>
EXPO_PUBLIC_AURIO_MINT=<proporcionado-por-el-equipo>
EXPO_PUBLIC_QA_BUSINESS_ID=<proporcionado-por-el-equipo>
EXPO_PUBLIC_QA_PAYOUT_WALLET=<proporcionado-por-el-equipo>
```

> [!IMPORTANT]
> El equipo compartirá estos valores durante la demo / vía el submission del hackathon. El archivo `.env.local` está en `.gitignore` y nunca se commitea.

### 3. Ejecutar la App

#### Opción A: Web (la más rápida — recomendada para jurado)

```bash
cd chakana-app
npx expo start --web
```

Se abre en el navegador en `http://localhost:8081`. **Instala la extensión Phantom** para probar el flujo de wallet.

#### Opción B: Android (requiere Android Studio + emulador o dispositivo)

```bash
cd chakana-app
npx expo run:android
```

#### Opción C: iOS (requiere macOS + Xcode)

```bash
cd chakana-app
npx expo run:ios
```

### 4. (Opcional) Ejecutar Supabase Localmente

Si prefieres correr el backend local en vez de usar la instancia alojada:

```bash
# Desde la raíz del repo
supabase init
supabase start

# Aplicar migraciones
supabase db reset

# Cargar datos seed
supabase db seed
```

---

## 📁 Estructura del Proyecto

```
CHAKANA/
├── chakana-app/              # App móvil Expo (React Native)
│   ├── app/                  # Pantallas Expo Router (rutas por archivo)
│   │   ├── (auth)/           # Login y Registro
│   │   ├── (tabs)/           # Home, Inventario, Carrito, Perfil
│   │   └── _layout.tsx       # Layout raíz + providers
│   ├── src/
│   │   ├── components/       # Componentes UI
│   │   ├── hooks/            # useWallet, useAuth, useWalletSigner
│   │   ├── store/            # Slices de estado Zustand
│   │   ├── services/         # Clientes Supabase y API de comercio
│   │   └── types/            # Modelos TypeScript y tipos DB
│   ├── polyfills.ts          # Buffer, crypto.subtle, isSecureContext
│   └── .env.example          # Template de variables públicas
│
├── supabase/
│   ├── functions/            # Edge Functions (Deno)
│   │   ├── commerce-api/     # Endpoints de negocios y productos
│   │   ├── stripe-webhook/   # Handler de webhook Stripe Connect
│   │   ├── mint-aurio-on-review/  # Minting de recompensas token
│   │   └── generate-report/ # Generación de reportes de voz IA
│   ├── migrations/           # Migraciones SQL (001-005)
│   └── seed.sql              # Datos seed de demo
│
├── memory/                   # Contexto de agentes IA (estado, decisiones)
├── agents/                   # Guías de rol por dev (Dev 1-4)
└── AGENTS.md                 # Protocolo de agentes IA
```

---

## 🧪 Testing

```bash
cd chakana-app

# Ejecutar tests E2E con Playwright
npx playwright test

# Ejecutar con interfaz visual
npx playwright test --headed
```

---

## 🚦 Estado Actual

| Feature | Estado |
|---------|--------|
| Onboarding y Auth | ✅ Listo |
| Feed principal | ✅ Listo |
| Inventario de comercios | ✅ Listo |
| Flujo de carrito y checkout | ✅ Listo |
| Pagos con Stripe | ✅ Listo |
| Conexión wallet (Phantom web) | ✅ Listo |
| Conexión wallet (nativo móvil) | ✅ Listo |
| Recompensas token Aurio | ✅ Listo |
| Reseñas verificadas | ✅ Listo |
| Reportes de voz con IA | 🔧 Backend listo |
| Cross-chain (LI.FI) | 🔧 En progreso |

---

## 🔑 Credenciales de Demo

El equipo proporcionará credenciales de prueba durante la sesión de evaluación:
- **Supabase anon key** (pública, acceso de solo lectura)
- **Wallet Solana devnet** (pre-cargada con SOL de devnet)
- **Cuenta de comercio de prueba** (productos y reseñas pre-cargados)

> Todos los fondos están en **devnet** de Solana — no hay dinero real involucrado.

---

## ⚖️ Licencia

MIT License — consulta [LICENSE](./LICENSE).

---

## 🌐 English

For the English version, see [README.md](./README.md).

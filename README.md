<div align="center">
  <img src="https://github.com/user-attachments/assets/157ef459-2a03-4e8b-99de-8338b82d3bca" alt="CHAKANA header" width="900" style="border-radius: 16px;" />

  <p><strong>🌎 Trust infrastructure for circular local commerce</strong></p>

  <p>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-0f766e.svg" alt="MIT License" /></a>
    <img src="https://img.shields.io/badge/status-Hackathon%20MVP-c2410c.svg" alt="Hackathon MVP" />
    <img src="https://img.shields.io/badge/blockchain-Solana%20Devnet-9945FF.svg?logo=solana&logoColor=white" alt="Solana Devnet" />
    <img src="https://img.shields.io/badge/backend-Supabase-3ECF8E.svg?logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/mobile-Expo-000020.svg?logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/payments-Stripe-635BFF.svg?logo=stripe&logoColor=white" alt="Stripe" />
  </p>
</div>

---

## ✨ What is CHAKANA?

CHAKANA is an ancestral-modern platform for local circular economy. It combines mobile UX, blockchain verification, and programmable incentives (Aurio tokens) so community impact can be **trusted, rewarded, and scaled**.

We connect conscious consumers with local merchants through verified reviews, token rewards, and transparent commerce flows — all anchored on Solana.

## 🎯 Why This Matters

- **Trust at source:** Community actions can be verified and audited on-chain.
- **Real incentives:** The Aurio token model connects social value with economic value.
- **Inclusive commerce:** Local businesses gain tools to participate in digital value flows.
- **Narrative + data:** Human stories and measurable impact live in one experience.

---

## 🧭 Demo Golden Path (for Judges)

```
Onboarding → Login → Home → Inventory → Cart → Checkout → Payment → Review → Home
```

1. **Connect wallet** — user links a Solana wallet (Phantom on web, mobile wallet adapter on native).
2. **Browse inventory** — explore products from local merchants (Tambús).
3. **Add to cart & checkout** — Stripe handles fiat, Aurio handles rewards.
4. **Submit review** — a verifiable hash is anchored on Solana devnet.
5. **Earn Aurios** — reward logic is triggered, balance updates in real-time.

> [!TIP]
> This is the fastest path to understand the full product experience.

---

## 🧱 Product Pillars

| Pillar | Description |
|--------|-------------|
| **Verified Reviews & Reputation** | On-chain anchored reviews merchants can't fake |
| **Aurio Rewards** | Token incentives for sustainable community actions |
| **Merchant Tools** | Tambús (product catalog, orders, payments) |
| **Cross-chain Payments** | LI.FI powered interoperability |
| **AI Voice Reports** | ElevenLabs-powered impact storytelling (backend) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo SDK 55 + React Native (New Architecture) |
| Routing | Expo Router (file-based, typed routes) |
| State | Zustand |
| Blockchain | Solana Devnet (`@solana/web3.js`) |
| Backend | Supabase (Auth, Postgres, RLS, Edge Functions) |
| Payments | Stripe Connect |
| Cross-chain | LI.FI |
| Voice AI | ElevenLabs (server-side only) |

---

## 🚀 Quick Start (for Judges)

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | >= 18 LTS | [nodejs.org](https://nodejs.org) |
| **npm** | >= 9 | Comes with Node |
| **Expo CLI** | latest | `npm install -g expo-cli` |
| **Supabase CLI** | latest | `npm install -g supabase` |
| **Phantom wallet** | — | [phantom.app](https://phantom.app) (for web demo) |

> **Fastest way to see the demo:** run the **web** version — no Android Studio or Xcode required.

### 1. Clone & Install

```bash
git clone https://github.com/<your-org>/CHAKANA.git
cd CHAKANA

# Install root dependencies
npm install

# Install app dependencies
cd chakana-app
npm install
```

### 2. Environment Variables

```bash
cd chakana-app
cp .env.example .env.local
```

Edit `.env.local` with the provided hackathon credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=<provided-by-team>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<provided-by-team>
EXPO_PUBLIC_AURIO_MINT=<provided-by-team>
EXPO_PUBLIC_QA_BUSINESS_ID=<provided-by-team>
EXPO_PUBLIC_QA_PAYOUT_WALLET=<provided-by-team>
```

> [!IMPORTANT]
> The team will share these values during the demo / via the hackathon submission. The `.env.local` file is gitignored and never committed.

### 3. Run the App

#### Option A: Web (fastest — recommended for judges)

```bash
cd chakana-app
npx expo start --web
```

Opens in your browser at `http://localhost:8081`. **Install the Phantom browser extension** to test the wallet flow.

#### Option B: Android (requires Android Studio + emulator or device)

```bash
cd chakana-app
npx expo run:android
```

#### Option C: iOS (requires macOS + Xcode)

```bash
cd chakana-app
npx expo run:ios
```

### 4. (Optional) Run Supabase Locally

If you want to run the backend locally instead of using the hosted instance:

```bash
# From repo root
supabase init
supabase start

# Apply migrations
supabase db reset

# Run seed data
supabase db seed
```

---

## 📁 Project Structure

```
CHAKANA/
├── chakana-app/              # Expo mobile app (React Native)
│   ├── app/                  # Expo Router screens (file-based routing)
│   │   ├── (auth)/           # Login & Register
│   │   ├── (tabs)/           # Home, Inventory, Cart, Profile
│   │   └── _layout.tsx       # Root layout + providers
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # useWallet, useAuth, useWalletSigner
│   │   ├── store/            # Zustand state slices
│   │   ├── services/         # Supabase & commerce API clients
│   │   └── types/            # TypeScript models & DB types
│   ├── polyfills.ts          # Buffer, crypto.subtle, isSecureContext
│   └── .env.example          # Public env template
│
├── supabase/
│   ├── functions/            # Edge Functions (Deno)
│   │   ├── commerce-api/     # Business & product endpoints
│   │   ├── stripe-webhook/   # Stripe Connect webhook handler
│   │   ├── mint-aurio-on-review/  # Token reward minting
│   │   └── generate-report/ # AI voice report generation
│   ├── migrations/           # SQL migrations (001-005)
│   └── seed.sql              # Demo seed data
│
├── memory/                   # AI agent context (project state, decisions)
├── agents/                   # Dev role guides (Dev 1-4)
└── AGENTS.md                 # AI agent protocol
```

---

## 🧪 Testing

```bash
cd chakana-app

# Run Playwright E2E tests
npx playwright test

# Run with UI
npx playwright test --headed
```

---

## 🚦 Current Status

| Feature | Status |
|---------|--------|
| Onboarding & Auth | ✅ Built |
| Home feed | ✅ Built |
| Merchant inventory | ✅ Built |
| Cart & checkout flow | ✅ Built |
| Stripe payments | ✅ Built |
| Wallet connect (Phantom web) | ✅ Built |
| Wallet connect (mobile native) | ✅ Built |
| Aurio token rewards | ✅ Built |
| Verified reviews | ✅ Built |
| AI voice reports | 🔧 Backend ready |
| Cross-chain (LI.FI) | 🔧 In progress |

---

## 🔑 Demo Credentials

The team will provide test credentials during the hackathon judging session:
- **Supabase anon key** (public, read-only access)
- **Solana devnet wallet** (pre-funded with devnet SOL)
- **Test merchant account** (pre-seeded products & reviews)

> All funds are on Solana **devnet** — no real money involved.

---

## ⚖️ License

MIT License — see [LICENSE](./LICENSE).

---

## 🌐 Español

Para la versión en español, revisa [README-es.md](./README-es.md).

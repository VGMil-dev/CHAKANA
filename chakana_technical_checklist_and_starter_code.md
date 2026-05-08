# CHAKANA — Checklist Técnico + Código Base (MVP Solana)

## 🎯 Objetivo
Construir un MVP funcional para hackathon usando:
- Next.js
- Solana Devnet
- Phantom Wallet
- Registro de reseñas verificables
- Reputación simple

---

# ✅ CHECKLIST TÉCNICO

## 1. Setup Inicial

### Instalar proyecto

```bash
npx create-next-app@latest chakana
cd chakana
```

### Instalar dependencias Solana

```bash
npm install @solana/web3.js
npm install @solana/wallet-adapter-react
npm install @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-wallets
npm install @solana/wallet-adapter-base
npm install @solana/wallet-adapter-phantom
npm install crypto-js
```

---

## 2. Configurar Wallet Provider

### Crear:

```bash
src/components/WalletProvider.tsx
```

### Código

```tsx
'use client'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'

import {
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui'

import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets'

import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'

require('@solana/wallet-adapter-react-ui/styles.css')

export default function SolanaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const endpoint = clusterApiUrl('devnet')

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
```

---

## 3. Envolver la App

### Editar:

```bash
src/app/layout.tsx
```

```tsx
import SolanaProvider from '@/components/WalletProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  )
}
```

---

# ✅ Conectar Wallet

## Crear botón

### Archivo:

```bash
src/components/ConnectWallet.tsx
```

```tsx
'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function ConnectWallet() {
  return <WalletMultiButton />
}
```

---

# ✅ Mostrar Wallet Conectada

## Página principal

### Editar:

```bash
src/app/page.tsx
```

```tsx
'use client'

import ConnectWallet from '@/components/ConnectWallet'
import { useWallet } from '@solana/wallet-adapter-react'

export default function Home() {
  const { publicKey } = useWallet()

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        CHAKANA
      </h1>

      <ConnectWallet />

      {publicKey && (
        <p className="mt-4">
          Wallet: {publicKey.toBase58()}
        </p>
      )}
    </main>
  )
}
```

---

# ✅ Generar Hash de Reseña

## Crear helper

### Archivo:

```bash
src/lib/hash.ts
```

```ts
import SHA256 from 'crypto-js/sha256'

export function generateReviewHash(review: string) {
  return SHA256(review).toString()
}
```

---

# ✅ Crear Formulario de Reseña

## Archivo:

```bash
src/components/ReviewForm.tsx
```

```tsx
'use client'

import { useState } from 'react'
import { generateReviewHash } from '@/lib/hash'

export default function ReviewForm() {
  const [review, setReview] = useState('')
  const [hash, setHash] = useState('')

  const submitReview = async () => {
    const generatedHash = generateReviewHash(review)

    setHash(generatedHash)

    console.log('Hash:', generatedHash)
  }

  return (
    <div className="mt-6">
      <textarea
        className="border p-2 w-full"
        placeholder="Escribe una reseña"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <button
        onClick={submitReview}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        Publicar Reseña
      </button>

      {hash && (
        <div className="mt-4">
          <p className="font-bold">Hash generado:</p>
          <p className="break-all">{hash}</p>
        </div>
      )}
    </div>
  )
}
```

---

# ✅ Integrar Formulario

## Editar page.tsx

```tsx
import ReviewForm from '@/components/ReviewForm'
```

Agregar:

```tsx
<ReviewForm />
```

---

# ✅ Registrar en Solana

## MVP SIMPLE

Usar Memo Program.

### Instalar:

```bash
npm install @solana/spl-memo
```

---

## Crear transacción

### Archivo:

```bash
src/lib/sendReview.ts
```

```ts
import {
  Connection,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js'

import { createMemoInstruction } from '@solana/spl-memo'

export async function sendReviewHash(
  wallet,
  hash
) {
  const connection = new Connection(
    clusterApiUrl('devnet')
  )

  const transaction = new Transaction().add(
    createMemoInstruction(hash)
  )

  const signature = await wallet.sendTransaction(
    transaction,
    connection
  )

  await connection.confirmTransaction(signature)

  return signature
}
```

---

# ✅ Mostrar Explorer

## En ReviewForm

```tsx
const [signature, setSignature] = useState('')
```

Después de enviar:

```tsx
setSignature(signature)
```

Mostrar:

```tsx
{signature && (
  <a
    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
    target="_blank"
  >
    Ver en Solana Explorer
  </a>
)}
```

---

# ✅ Sistema Simple de Reputación

## MVP

```ts
const reputation = reviews.length * 10
```

### Niveles

| Reputación | Nivel |
|---|---|
| 0-50 | Nuevo |
| 51-100 | Explorador |
| 101-300 | Embajador |
| 300+ | Referente |

---

# ✅ Aurios (MVP)

## Simple

```ts
const aurios = reviews.length * 10
```

Mostrar:

```tsx
<p>Aurios: {aurios}</p>
```

---

# ✅ UI MÍNIMA NECESARIA

## Pantalla principal

Debe mostrar:

- Logo CHAKANA
- Botón conectar wallet
- Wallet conectada
- Formulario reseña
- Hash generado
- Link Explorer
- Aurios
- Nivel reputación

---

# ✅ Demo Final

## Flujo presentación

1. Conectar wallet
2. Escribir reseña
3. Publicar
4. Mostrar hash
5. Abrir explorer
6. Mostrar reputación
7. Mostrar Aurios

Duración ideal:

60–90 segundos.

---

# 🎤 Pitch Corto

> “Chakana convierte las reseñas locales en reputación verificable usando Solana. Cada interacción deja una huella transparente que no puede ser falsificada.”

---

# 🚨 ERRORES A EVITAR

❌ Querer hacer marketplace completo
❌ Hacer tokenomics compleja
❌ Perder tiempo en diseño
❌ Smart contracts demasiado complejos
❌ NFTs innecesarios en MVP

---

# 🏁 Objetivo Final

Llegar al hackathon con:

✅ Wallet funcionando
✅ Blockchain funcionando
✅ Caso de uso real
✅ Demo estable
✅ Narrativa clara


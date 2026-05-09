import { Platform } from 'react-native';
import type { Transaction } from '@solana/web3.js';

type SolanaPublicKeyLike = {
  toString: () => string;
};

interface SolanaProvider {
  isPhantom?: boolean;
  publicKey?: SolanaPublicKeyLike;
  connect: () => Promise<{ publicKey: SolanaPublicKeyLike }>;
  disconnect?: () => Promise<void>;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

type UseWalletSignerResult = {
  signTransaction: ((tx: Transaction) => Promise<Transaction>) | null;
  canSignTransactions: boolean;
  signerError: string | null;
};

function getWebProvider(): SolanaProvider | null {
  if (typeof window === 'undefined') return null;
  return window.solana ?? null;
}

export function useWalletSigner(): UseWalletSignerResult {
  if (Platform.OS !== 'web') {
    return {
      signTransaction: null,
      canSignTransactions: false,
      signerError: 'TODO Dev 3: integrar firma mobile con Mobile Wallet Adapter.',
    };
  }

  const provider = getWebProvider();

  if (!provider?.signTransaction) {
    return {
      signTransaction: null,
      canSignTransactions: false,
      signerError: 'Tu wallet no expone signTransaction en web.',
    };
  }

  return {
    signTransaction: (tx) =>
      provider.signTransaction?.(tx) ??
      Promise.reject(new Error('No se pudo acceder al firmador de la wallet.')),
    canSignTransactions: true,
    signerError: null,
  };
}

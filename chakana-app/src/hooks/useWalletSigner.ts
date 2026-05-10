import { Platform, TurboModuleRegistry } from 'react-native';
import type { Transaction } from '@solana/web3.js';

const mobileWalletAvailable =
  Platform.OS !== 'web' && TurboModuleRegistry.get('SolanaMobileWalletAdapter') != null;

const APP_IDENTITY = {
  name: 'Chakana',
  uri: 'https://chakana.app',
};

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
    if (!mobileWalletAvailable) {
      return {
        signTransaction: null,
        canSignTransactions: false,
        signerError:
          'Solana Mobile Wallet no disponible. Instala un development build.',
      };
    }
    return {
      signTransaction: async (tx) => {
        const { transact } = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js') as
          typeof import('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
        return transact(async (wallet) => {
          await wallet.authorize({
            chain: 'solana:devnet',
            identity: APP_IDENTITY,
          });
          const [signedTransaction] = await wallet.signTransactions({ transactions: [tx] });

          if (!signedTransaction) {
            throw new Error('La wallet no devolvió una transacción firmada.');
          }

          return signedTransaction as Transaction;
        });
      },
      canSignTransactions: true,
      signerError: null,
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
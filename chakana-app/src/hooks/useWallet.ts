import { useState } from 'react';
import { Platform, TurboModuleRegistry } from 'react-native';
import { getAurioBalance } from 'aurio-sdk';
import { useAppStore } from '../store';
import { DEMO_AURIO_BALANCE, getDemoWalletAddress } from '../utils/demoMode';

const mobileWalletAvailable =
  Platform.OS !== 'web' && TurboModuleRegistry.get('SolanaMobileWalletAdapter') != null;

type SolanaPublicKeyLike = {
  toString: () => string;
};

type SolanaWebProvider = {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey?: SolanaPublicKeyLike;
  connect: () => Promise<{ publicKey: SolanaPublicKeyLike }>;
  disconnect?: () => Promise<void>;
};

type WindowWithSolana = Window & {
  solana?: SolanaWebProvider;
};

type UseWalletResult = {
  walletPubKey: string | null;
  aurioBalance: number;
  isConnected: boolean;
  isConnectingWallet: boolean;
  walletError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshAurioBalance: () => Promise<void>;
};

const APP_IDENTITY = {
  name: 'Chakana',
  uri: 'https://chakana.app',
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo conectar la wallet.';
}

function getWebSolanaProvider(): SolanaWebProvider | null {
  if (typeof window === 'undefined') return null;
  const provider = (window as WindowWithSolana).solana;
  return provider ?? null;
}

function decodeBase64Address(address: string): Uint8Array {
  const binary = globalThis.atob(address);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function connectWebWallet(): Promise<string> {
  const provider = getWebSolanaProvider();
  if (!provider) {
    throw new Error('Instala o desbloquea Phantom/Solflare para conectar tu wallet.');
  }

  const response = await provider.connect();
  return response.publicKey.toString();
}

async function disconnectWebWallet(): Promise<void> {
  const provider = getWebSolanaProvider();
  await provider?.disconnect?.();
}

async function connectMobileWallet(): Promise<string> {
  if (!mobileWalletAvailable) {
    throw new Error(
      'Solana Mobile Wallet no disponible. Instala un development build (npx expo run:android).',
    );
  }
  const { PublicKey } = require('@solana/web3.js') as typeof import('@solana/web3.js');
  const { transact } = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js') as
    typeof import('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
  const authorization = await transact(async (wallet) =>
    wallet.authorize({
      chain: 'solana:devnet',
      identity: APP_IDENTITY,
    }),
  );
  const account = authorization.accounts[0];

  if (!account) {
    throw new Error('La wallet no devolviÃ³ una cuenta autorizada.');
  }

  return new PublicKey(decodeBase64Address(account.address)).toBase58();
}

export function useWallet(): UseWalletResult {
  const walletPubKey = useAppStore((state) => state.walletPubKey);
  const aurioBalance = useAppStore((state) => state.aurioBalance);
  const isConnected = useAppStore((state) => state.isConnected);
  const isDemoMode = useAppStore((state) => state.isDemoMode);
  const setWalletPubKey = useAppStore((state) => state.setWalletPubKey);
  const setAurioBalance = useAppStore((state) => state.setAurioBalance);
  const setIsConnected = useAppStore((state) => state.setIsConnected);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const refreshAurioBalance = async (): Promise<void> => {
    if (!walletPubKey) {
      setWalletError('Conecta tu wallet para actualizar tus Aurios.');
      return;
    }

    try {
      const balance = await getAurioBalance(walletPubKey);
      setAurioBalance(balance);
      setWalletError(null);
    } catch (error) {
      if (isDemoMode) {
        setAurioBalance(DEMO_AURIO_BALANCE);
        setWalletError(null);
        return;
      }
      setWalletError(getErrorMessage(error));
    }
  };

  const connectWallet = async (): Promise<void> => {
    setIsConnectingWallet(true);
    setWalletError(null);

    try {
      if (isDemoMode) {
        setWalletPubKey(getDemoWalletAddress());
        setAurioBalance(DEMO_AURIO_BALANCE);
        setIsConnected(true);
        setWalletError(null);
        return;
      }

      const publicKey =
        Platform.OS === 'web' ? await connectWebWallet() : await connectMobileWallet();
      setWalletPubKey(publicKey);
      setIsConnected(true);

      const balance = await getAurioBalance(publicKey);
      setAurioBalance(balance);
      setWalletError(null);
    } catch (error) {
      if (isDemoMode) {
        setWalletPubKey(getDemoWalletAddress());
        setAurioBalance(DEMO_AURIO_BALANCE);
        setIsConnected(true);
        setWalletError(null);
        return;
      }
      setWalletError(getErrorMessage(error));
      setWalletPubKey(null);
      setAurioBalance(0);
      setIsConnected(false);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    setIsConnectingWallet(true);
    setWalletError(null);

    try {
      if (Platform.OS === 'web') {
        await disconnectWebWallet();
      }
    } catch (error) {
      setWalletError(getErrorMessage(error));
    } finally {
      setWalletPubKey(null);
      setAurioBalance(0);
      setIsConnected(false);
      setIsConnectingWallet(false);
    }
  };

  return {
    walletPubKey,
    aurioBalance,
    isConnected,
    isConnectingWallet,
    walletError,
    connectWallet,
    disconnectWallet,
    refreshAurioBalance,
  };
}

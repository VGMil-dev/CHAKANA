import { getAurioBalance, getSolBalance, payToTambu } from 'aurio-sdk';
import type { Transaction } from '@solana/web3.js';
import type { CrosschainDestinationWalletSource } from '../utils/walletFormat';
import { isProbablySolanaAddress } from '../utils/walletFormat';

export type AurioWalletStatus = 'ready' | 'error';

export type AurioWalletState = {
  aurBalance: number;
  solBalance?: number;
  walletAddress: string;
  updatedAt: string;
  status: AurioWalletStatus;
};

export type AurioPaymentStatus = 'prepared' | 'unavailable' | 'error';

export type AurioPaymentPreparation = {
  status: AurioPaymentStatus;
  message: string;
  sender?: string;
  tambuMint?: string;
  amount?: number;
  transaction?: Transaction;
  preparedAt?: string;
};

export type PrepareTambuAurioPaymentParams = {
  senderWallet: string | null | undefined;
  walletSource: CrosschainDestinationWalletSource;
  tambuMint: string | null | undefined;
  amount: number;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo preparar Aurio.';
}

export async function getAurioWalletState(walletAddress: string): Promise<AurioWalletState> {
  const aurBalance = await getAurioBalance(walletAddress);
  const solBalance = await getSolBalance(walletAddress).catch(() => undefined);

  return {
    aurBalance,
    solBalance,
    walletAddress,
    updatedAt: new Date().toISOString(),
    status: 'ready',
  };
}

export async function prepareTambuAurioPayment({
  senderWallet,
  walletSource,
  tambuMint,
  amount,
}: PrepareTambuAurioPaymentParams): Promise<AurioPaymentPreparation> {
  if (walletSource !== 'connected') {
    return {
      status: 'unavailable',
      message: 'Modo demo: conecta una wallet para preparar un pago real con Aurio.',
    };
  }

  if (!isProbablySolanaAddress(senderWallet)) {
    return {
      status: 'unavailable',
      message: 'Conecta una wallet Solana para preparar el pago real.',
    };
  }

  if (!isProbablySolanaAddress(tambuMint)) {
    return {
      status: 'unavailable',
      message: 'Falta EXPO_PUBLIC_QA_TAMBU_MINT para preparar el pago Tambu.',
    };
  }

  if (amount <= 0) {
    return {
      status: 'unavailable',
      message: 'Selecciona un monto Aurio mayor a cero.',
    };
  }

  try {
    const transaction = await payToTambu({
      sender: senderWallet.trim(),
      tambuMint: tambuMint.trim(),
      amount,
    });

    return {
      status: 'prepared',
      message: 'Transaccion Aurio preparada. Pago demo listo para firmarse.',
      sender: senderWallet.trim(),
      tambuMint: tambuMint.trim(),
      amount,
      transaction,
      preparedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error),
      sender: senderWallet.trim(),
      tambuMint: tambuMint.trim(),
      amount,
    };
  }
}

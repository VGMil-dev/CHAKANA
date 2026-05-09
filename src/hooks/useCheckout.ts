import { buildAurioTransferTx, getAurioBalance, getAurioConnection, payToTambu } from 'aurio-sdk';
import type { Transaction } from '@solana/web3.js';
import { useAppStore } from '../store';
import { calculateDiscount, type DiscountResult } from '../utils/discountCalculator';
import { getSliderMax } from '../utils/sliderConfig';

export type CheckoutDestination =
  | {
      mode: 'tambu';
      tambuMint: string;
    }
  | {
      mode: 'wallet';
      payoutWallet: string;
    };

type ConfirmCheckoutParams = {
  destination: CheckoutDestination;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
};

type CheckoutSignatureResult = {
  signature: string;
};

type UseCheckoutResult = {
  checkoutTotal: number;
  auriosToSpend: number;
  discountResult: DiscountResult;
  sliderMax: number;
  isProcessing: boolean;
  checkoutError: string | null;
  checkoutSignature: string | null;
  setTotal: (amount: number) => void;
  onSliderChange: (value: number) => void;
  confirmCheckout: (params: ConfirmCheckoutParams) => Promise<CheckoutSignatureResult | null>;
  resetCheckout: () => void;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar el pago con Aurios.';
}

function isValidDestination(destination: CheckoutDestination): boolean {
  return destination.mode === 'tambu'
    ? destination.tambuMint.trim().length > 0
    : destination.payoutWallet.trim().length > 0;
}

async function buildCheckoutTransaction(
  destination: CheckoutDestination,
  sender: string,
  amount: number,
): Promise<Transaction> {
  if (destination.mode === 'tambu') {
    return payToTambu({
      sender,
      tambuMint: destination.tambuMint,
      amount,
    });
  }

  return buildAurioTransferTx({
    sender,
    recipient: destination.payoutWallet,
    amount,
  });
}

export function useCheckout(): UseCheckoutResult {
  const checkoutTotal = useAppStore((state) => state.checkoutTotal);
  const auriosToSpend = useAppStore((state) => state.auriosToSpend);
  const aurioBalance = useAppStore((state) => state.aurioBalance);
  const walletPubKey = useAppStore((state) => state.walletPubKey);
  const isProcessing = useAppStore((state) => state.isProcessingCheckout);
  const checkoutError = useAppStore((state) => state.checkoutError);
  const checkoutSignature = useAppStore((state) => state.checkoutSignature);
  const setCheckoutTotal = useAppStore((state) => state.setCheckoutTotal);
  const setAuriosToSpend = useAppStore((state) => state.setAuriosToSpend);
  const setAurioBalance = useAppStore((state) => state.setAurioBalance);
  const setIsProcessingCheckout = useAppStore((state) => state.setIsProcessingCheckout);
  const setCheckoutError = useAppStore((state) => state.setCheckoutError);
  const setCheckoutSignature = useAppStore((state) => state.setCheckoutSignature);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const resetCheckout = useAppStore((state) => state.resetCheckout);

  const discountResult = calculateDiscount({
    subtotal: checkoutTotal,
    auriosToSpend,
    aurioBalance,
  });
  const sliderMax = getSliderMax(checkoutTotal, aurioBalance);

  const onSliderChange = (value: number): void => {
    const nextResult = calculateDiscount({
      subtotal: checkoutTotal,
      auriosToSpend: value,
      aurioBalance,
    });
    setAuriosToSpend(nextResult.auriosToSpend);
    setCheckoutError(null);
    setCheckoutSignature(null);
  };

  const confirmCheckout = async (
    params: ConfirmCheckoutParams,
  ): Promise<CheckoutSignatureResult | null> => {
    if (!walletPubKey) {
      setCheckoutError('Conecta tu wallet antes de pagar con Aurios.');
      return null;
    }

    if (auriosToSpend <= 0) {
      setCheckoutError('Selecciona una cantidad de Aurios para usar.');
      return null;
    }

    if (typeof params.signTransaction !== 'function') {
      setCheckoutError('No se pudo acceder al firmador de la wallet.');
      return null;
    }

    if (!isValidDestination(params.destination)) {
      setCheckoutError('No se encontro el destino para la transaccion.');
      return null;
    }

    setIsProcessingCheckout(true);
    setCheckoutError(null);
    setCheckoutSignature(null);

    try {
      const transaction = await buildCheckoutTransaction(
        params.destination,
        walletPubKey,
        auriosToSpend,
      );
      const signedTransaction = await params.signTransaction(transaction);
      const connection = getAurioConnection();
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      await connection.confirmTransaction(signature, 'confirmed');
      const nextBalance = await getAurioBalance(walletPubKey);
      setAurioBalance(nextBalance);
      setCheckoutSignature(signature);
      setActiveModal('propina');

      return { signature };
    } catch (error) {
      setCheckoutError(getErrorMessage(error));
      return null;
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return {
    checkoutTotal,
    auriosToSpend: discountResult.auriosToSpend,
    discountResult,
    sliderMax,
    isProcessing,
    checkoutError,
    checkoutSignature,
    setTotal: setCheckoutTotal,
    onSliderChange,
    confirmCheckout,
    resetCheckout,
  };
}

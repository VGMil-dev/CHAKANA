import { getAurioBalance, payToTambu } from 'aurio-sdk';
import { Connection, type Transaction } from '@solana/web3.js';
import { useAppStore } from '../store';
import { calculateDiscount, type DiscountResult } from '../utils/discountCalculator';
import { getSliderMax } from '../utils/sliderConfig';

const SOLANA_DEVNET_RPC_URL = 'https://api.devnet.solana.com';

type ConfirmCheckoutParams = {
  tambuMint: string;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
};

type ConfirmCheckoutResult = {
  signature: string;
};

type UseCheckoutResult = {
  checkoutTotal: number;
  discountResult: DiscountResult;
  sliderMax: number;
  isProcessing: boolean;
  checkoutError: string | null;
  setTotal: (amount: number) => void;
  onSliderChange: (value: number) => void;
  confirmCheckout: (params: ConfirmCheckoutParams) => Promise<ConfirmCheckoutResult>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar el pago';
}

export function useCheckout(): UseCheckoutResult {
  const checkoutTotal = useAppStore((state) => state.checkoutTotal);
  const auriosToSpend = useAppStore((state) => state.auriosToSpend);
  const aurioBalance = useAppStore((state) => state.aurioBalance);
  const walletPubKey = useAppStore((state) => state.walletPubKey);
  const isProcessing = useAppStore((state) => state.isLoading);
  const checkoutError = useAppStore((state) => state.errorMessage);
  const setCheckoutTotal = useAppStore((state) => state.setCheckoutTotal);
  const setAuriosToSpend = useAppStore((state) => state.setAuriosToSpend);
  const setAurioBalance = useAppStore((state) => state.setAurioBalance);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setErrorMessage = useAppStore((state) => state.setErrorMessage);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

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
  };

  const confirmCheckout = async (
    params: ConfirmCheckoutParams
  ): Promise<ConfirmCheckoutResult> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!walletPubKey) {
        throw new Error('Conecta tu wallet para pagar con Aurios');
      }

      const transaction = await payToTambu({
        sender: walletPubKey,
        tambuMint: params.tambuMint,
        amount: discountResult.auriosToSpend,
      });
      const signedTransaction = await params.signTransaction(transaction);
      const connection = new Connection(SOLANA_DEVNET_RPC_URL, 'confirmed');
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      await connection.confirmTransaction(signature, 'confirmed');
      const nextBalance = await getAurioBalance(walletPubKey);
      setAurioBalance(nextBalance);
      setActiveModal('propina');

      return { signature };
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return { signature: '' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkoutTotal,
    discountResult,
    sliderMax,
    isProcessing,
    checkoutError,
    setTotal: setCheckoutTotal,
    onSliderChange,
    confirmCheckout,
  };
}

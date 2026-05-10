import { useState } from 'react';
import { createCashOrder, type CashOrderCartItem } from '../services/supabase/orders.service';

type CashCheckoutParams = {
  businessId: string;
  cartItems: Array<{ productId: string; quantity: number; unitAmountCents: number }>;
  subtotalCents: number;
  auriosSpent: number;
  aurioDiscountCents: number;
  finalTotalCents: number;
  aurioSignature?: string;
  walletPubKey?: string;
};

type UseCashCheckoutResult = {
  isCashProcessing: boolean;
  cashError: string | null;
  confirmCashOrder: (params: CashCheckoutParams) => Promise<{ orderId: string } | null>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo procesar el pago en efectivo.';
}

export function useCashCheckout(): UseCashCheckoutResult {
  const [isCashProcessing, setIsCashProcessing] = useState(false);
  const [cashError, setCashError] = useState<string | null>(null);

  const confirmCashOrder = async (
    params: CashCheckoutParams,
  ): Promise<{ orderId: string } | null> => {
    setIsCashProcessing(true);
    setCashError(null);

    try {
      const cartItems: CashOrderCartItem[] = params.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitAmountCents: item.unitAmountCents,
      }));

      const result = await createCashOrder({
        businessId: params.businessId,
        cartItems,
        subtotalCents: params.subtotalCents,
        auriosSpent: params.auriosSpent,
        aurioDiscountCents: params.aurioDiscountCents,
        finalTotalCents: params.finalTotalCents,
        aurioSignature: params.aurioSignature,
        walletPubKey: params.walletPubKey,
      });

      return { orderId: result.orderId };
    } catch (error) {
      setCashError(getErrorMessage(error));
      return null;
    } finally {
      setIsCashProcessing(false);
    }
  };

  return {
    isCashProcessing,
    cashError,
    confirmCashOrder,
  };
}

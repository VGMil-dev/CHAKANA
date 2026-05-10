import { useState } from 'react';
import type { Transaction } from '@solana/web3.js';
import { createStripeCheckoutSession } from '../services/commerce';
import { useAppStore } from '../store';
import { type CheckoutDestination, useCheckout } from './useCheckout';
import { useWallet } from './useWallet';
import { DEMO_PAYMENT_SESSION_ID } from '../utils/demoMode';

type HybridCartItem = {
  productId: string;
  quantity: number;
};

type HybridCheckoutParams = {
  signTransaction?: ((tx: Transaction) => Promise<Transaction>) | null;
  destination: CheckoutDestination | null;
  businessId: string;
  cartItems: HybridCartItem[];
};

export type HybridCheckoutResult = {
  aurioSignature?: string;
  stripeCheckoutUrl?: string;
  stripeSessionId?: string;
  orderId?: string;
};

type UseHybridCheckoutResult = {
  isHybridProcessing: boolean;
  hybridError: string | null;
  confirmHybridCheckout: (params: HybridCheckoutParams) => Promise<HybridCheckoutResult | null>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo iniciar el pago con tarjeta.';
}

export function useHybridCheckout(): UseHybridCheckoutResult {
  const [isHybridProcessing, setIsHybridProcessing] = useState(false);
  const [hybridError, setHybridError] = useState<string | null>(null);
  const isDemoMode = useAppStore((state) => state.isDemoMode);
  const { walletPubKey } = useWallet();
  const {
    auriosToSpend,
    redeemedAurios,
    discountResult,
    checkoutSignature,
    confirmCheckout,
  } = useCheckout();
  const setCheckoutError = useAppStore((state) => state.setCheckoutError);
  const setCheckoutSignature = useAppStore((state) => state.setCheckoutSignature);
  const setRedeemedAurios = useAppStore((state) => state.setRedeemedAurios);
  const setAuriosToSpend = useAppStore((state) => state.setAuriosToSpend);

  const confirmHybridCheckout = async (
    params: HybridCheckoutParams,
  ): Promise<HybridCheckoutResult | null> => {
    const businessId = params.businessId.trim();
    const cartItems = params.cartItems.filter((item) => item.productId && item.quantity > 0);

    if (!businessId) {
      const message = 'No se encontro el negocio para crear el checkout con tarjeta.';
      setHybridError(message);
      setCheckoutError(message);
      return null;
    }

    if (cartItems.length === 0) {
      const message = 'Agrega productos al carrito antes de pagar con tarjeta.';
      setHybridError(message);
      setCheckoutError(message);
      return null;
    }

    setIsHybridProcessing(true);
    setHybridError(null);

    try {
      if (isDemoMode) {
        const simulatedAurios = discountResult.auriosToSpend;
        if (simulatedAurios > 0) {
          setRedeemedAurios(simulatedAurios);
          setAuriosToSpend(simulatedAurios);
          setCheckoutSignature('demo_aurio_no_funds_moved');
        }

        return {
          aurioSignature: simulatedAurios > 0 ? 'demo_aurio_no_funds_moved' : undefined,
          stripeSessionId: DEMO_PAYMENT_SESSION_ID,
          orderId: 'demo_order_approved',
        };
      }

      let aurioSignature = checkoutSignature ?? undefined;

      if (auriosToSpend > 0 && !aurioSignature) {
        if (!params.destination) {
          throw new Error('Primero configura un destino para redimir Aurios.');
        }

        if (!params.signTransaction) {
          throw new Error('Conecta una wallet capaz de firmar para redimir Aurios.');
        }

        const redemption = await confirmCheckout({
          destination: params.destination,
          signTransaction: params.signTransaction,
        });

        if (!redemption) return null;
        aurioSignature = redemption.signature;
      }

      const stripeSession = await createStripeCheckoutSession({
        businessId,
        cartItems,
        auriosToSpend: checkoutSignature ? redeemedAurios : auriosToSpend,
        aurioDiscountUsd: discountResult.discountUSD,
        finalTotal: discountResult.finalTotal,
        aurioSignature,
        walletPubKey: walletPubKey ?? undefined,
      });

      return {
        aurioSignature,
        stripeCheckoutUrl: stripeSession.checkoutUrl,
        stripeSessionId: stripeSession.sessionId,
        orderId: stripeSession.orderId,
      };
    } catch (error) {
      const message = getErrorMessage(error);
      setHybridError(message);
      setCheckoutError(message);
      return null;
    } finally {
      setIsHybridProcessing(false);
    }
  };

  return {
    isHybridProcessing,
    hybridError,
    confirmHybridCheckout,
  };
}

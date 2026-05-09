import { useState } from 'react';
import type { Transaction } from '@solana/web3.js';
import { createStripeCheckoutSession } from '../services/commerce';
import { useAppStore } from '../store';
import { type CheckoutDestination, useCheckout } from './useCheckout';
import { useWallet } from './useWallet';

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
  const { walletPubKey } = useWallet();
  const {
    auriosToSpend,
    redeemedAurios,
    discountResult,
    checkoutSignature,
    confirmCheckout,
  } = useCheckout();
  const setCheckoutError = useAppStore((state) => state.setCheckoutError);

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

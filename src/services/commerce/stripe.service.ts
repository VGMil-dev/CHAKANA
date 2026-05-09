export type StripeCheckoutCartItem = {
  productId: string;
  quantity: number;
};

export type CreateStripeCheckoutSessionParams = {
  businessId: string;
  cartItems: StripeCheckoutCartItem[];
  auriosToSpend?: number;
  aurioDiscountUsd?: number;
  finalTotal?: number;
  aurioSignature?: string;
  walletPubKey?: string;
  paymentLinkUrl?: string;
};

export type StripeCheckoutSession = {
  checkoutUrl?: string;
  sessionId?: string;
};

function getConfiguredPaymentLink(params: CreateStripeCheckoutSessionParams) {
  return params.paymentLinkUrl ?? process.env.EXPO_PUBLIC_QA_STRIPE_PAYMENT_LINK;
}

function isStripePaymentLink(url: string) {
  return /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_/-]+/.test(url);
}

export async function createStripeCheckoutSession(
  params: CreateStripeCheckoutSessionParams,
): Promise<StripeCheckoutSession> {
  const paymentLinkUrl = getConfiguredPaymentLink(params);

  if (!paymentLinkUrl || !isStripePaymentLink(paymentLinkUrl)) {
    throw new Error('Configura EXPO_PUBLIC_QA_STRIPE_PAYMENT_LINK con un link https://buy.stripe.com/... del emprendimiento.');
  }

  return {
    checkoutUrl: paymentLinkUrl,
    sessionId: 'payment-link',
  };
}

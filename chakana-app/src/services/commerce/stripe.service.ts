import { supabase } from '../supabase';

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
};

export type StripeCheckoutSession = {
  checkoutUrl: string;
  sessionId: string;
  orderId: string;
};

export type CreateConnectOnboardingLinkParams = {
  businessId: string;
  returnUrl: string;
  refreshUrl: string;
};

export type ConnectOnboardingLink = {
  url: string;
  accountId: string;
};

type CommerceApiCheckoutResponse = {
  checkout_url?: string;
  checkout_session_id?: string;
  order_id?: string;
  error?: string;
};

type CommerceApiOnboardingResponse = {
  url?: string;
  account_id?: string;
  error?: string;
};

async function getCommerceHeaders(): Promise<HeadersInit> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);

  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error('Inicia sesión para pagar con tarjeta.');

  return {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

function getCommerceUrl(path: string): string {
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!baseUrl) throw new Error('Falta EXPO_PUBLIC_SUPABASE_URL.');
  return `${baseUrl.replace(/\/$/, '')}/functions/v1/commerce-api${path}`;
}

async function postCommerce<TResponse>(
  path: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  const response = await fetch(getCommerceUrl(path), {
    method: 'POST',
    headers: await getCommerceHeaders(),
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo completar la operación de comercio.');
  }

  return data;
}

export async function createStripeCheckoutSession(
  params: CreateStripeCheckoutSessionParams,
): Promise<StripeCheckoutSession> {
  const data = await postCommerce<CommerceApiCheckoutResponse>('/checkout', {
    business_id: params.businessId,
    cart_items: params.cartItems.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
    aurios_to_spend: params.auriosToSpend ?? 0,
    aurio_discount_usd: params.aurioDiscountUsd ?? 0,
    final_total: params.finalTotal,
    aurio_signature: params.aurioSignature,
    wallet_pubkey: params.walletPubKey,
  });

  if (!data.checkout_url || !data.checkout_session_id || !data.order_id) {
    throw new Error('Stripe no devolvió una sesión de checkout válida.');
  }

  return {
    checkoutUrl: data.checkout_url,
    sessionId: data.checkout_session_id,
    orderId: data.order_id,
  };
}

export async function createConnectOnboardingLink(
  params: CreateConnectOnboardingLinkParams,
): Promise<ConnectOnboardingLink> {
  const data = await postCommerce<CommerceApiOnboardingResponse>('/connect/onboarding-link', {
    business_id: params.businessId,
    return_url: params.returnUrl,
    refresh_url: params.refreshUrl,
  });

  if (!data.url || !data.account_id) {
    throw new Error('Stripe Connect no devolvió un enlace de onboarding válido.');
  }

  return {
    url: data.url,
    accountId: data.account_id,
  };
}

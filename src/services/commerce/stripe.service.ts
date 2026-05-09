import { supabase } from '../supabase/client';

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
  successUrl?: string;
  cancelUrl?: string;
};

export type StripeCheckoutSession = {
  checkoutUrl?: string;
  sessionId?: string;
};

type CommerceCheckoutResponse = {
  checkout_url?: unknown;
  checkout_session_id?: unknown;
};

function getCommerceApiUrl(path: string) {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL no esta configurado.');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${supabaseUrl}/functions/v1/commerce-api${normalizedPath}`;
}

function getSupabaseAnonKey() {
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY no esta configurado.');
  }
  return anonKey;
}

function asObject(value: unknown): CommerceCheckoutResponse {
  if (!value || typeof value !== 'object') return {};
  return value as CommerceCheckoutResponse;
}

export async function createStripeCheckoutSession(
  params: CreateStripeCheckoutSessionParams,
): Promise<StripeCheckoutSession> {
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    throw new Error('Se requiere una sesion activa para iniciar checkout con tarjeta.');
  }

  const response = await fetch(getCommerceApiUrl('/api/checkout'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: getSupabaseAnonKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      business_id: params.businessId,
      items: params.cartItems.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      aurios_to_spend: params.auriosToSpend ?? 0,
      aurio_discount_usd: params.aurioDiscountUsd ?? 0,
      final_total: params.finalTotal,
      aurio_signature: params.aurioSignature,
      wallet_pubkey: params.walletPubKey,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    }),
  });

  const body = asObject(await response.json().catch(() => ({})));

  if (!response.ok) {
    throw new Error('No se pudo crear la sesion de checkout con Stripe.');
  }

  return {
    checkoutUrl: typeof body.checkout_url === 'string' ? body.checkout_url : undefined,
    sessionId: typeof body.checkout_session_id === 'string' ? body.checkout_session_id : undefined,
  };
}

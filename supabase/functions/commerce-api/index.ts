import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

type CartItemInput = {
  product_id?: string;
  quantity?: number;
};

type ProductRow = {
  id: string;
  business_id: string;
  name: string;
  price_cents: number;
  active: boolean;
};

type BusinessRow = {
  id: string;
  name: string;
  owner_id: string | null;
  wallet_adress: string | null;
  stripe_account_id: string | null;
};

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getOptionalEnv(name: string) {
  return Deno.env.get(name) ?? null;
}

function getSupabaseAdmin() {
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

function getSupabaseForUser(req: Request) {
  const authorization = req.headers.get('Authorization') ?? '';
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
  });
}

function sendJson(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function readStringField(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function readIntField(payload: Record<string, unknown>, key: string): number {
  const value = payload[key];
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

async function getUser(req: Request) {
  const supabase = getSupabaseForUser(req);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Unauthorized');
  return data.user;
}

async function stripeRequest<T>(
  path: string,
  params: Record<string, string | number | boolean | null | undefined>,
): Promise<T> {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) body.set(key, String(value));
  }

  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getEnv('STRIPE_SECRET_KEY')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data?.error?.message === 'string'
      ? data.error.message
      : 'Stripe request failed';
    throw new Error(message);
  }

  return data as T;
}

async function handleConnectOnboarding(req: Request) {
  const user = await getUser(req);
  const payload = await req.json().catch(() => ({})) as Record<string, unknown>;
  const businessId = readStringField(payload, 'business_id');
  const returnUrl = readStringField(payload, 'return_url');
  const refreshUrl = readStringField(payload, 'refresh_url');

  if (!businessId || !returnUrl || !refreshUrl) {
    return sendJson({ error: 'business_id, return_url and refresh_url are required' }, 400);
  }

  const supabase = getSupabaseAdmin();
  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, name, owner_id, wallet_adress, stripe_account_id')
    .eq('id', businessId)
    .maybeSingle<BusinessRow>();

  if (error) throw new Error(error.message);
  if (!business) return sendJson({ error: 'Business not found' }, 404);
  if (business.owner_id !== user.id) return sendJson({ error: 'Only the owner can onboard this business' }, 403);

  let accountId = business.stripe_account_id;
  if (!accountId) {
    const account = await stripeRequest<{ id: string }>('/accounts', {
      type: 'express',
      country: getOptionalEnv('STRIPE_CONNECT_COUNTRY') ?? 'US',
      email: user.email ?? undefined,
      'business_profile[name]': business.name,
      'capabilities[card_payments][requested]': true,
      'capabilities[transfers][requested]': true,
    });
    accountId = account.id;

    const { error: updateError } = await supabase
      .from('businesses')
      .update({ stripe_account_id: accountId })
      .eq('id', businessId);
    if (updateError) throw new Error(updateError.message);
  }

  const link = await stripeRequest<{ url: string }>('/account_links', {
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return sendJson({ url: link.url, account_id: accountId });
}

function normalizeCartItems(payload: Record<string, unknown>): CartItemInput[] {
  const rawItems = payload.cart_items;
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .map((item) => item as CartItemInput)
    .filter((item) => typeof item.product_id === 'string' && Number(item.quantity) > 0)
    .map((item) => ({
      product_id: item.product_id,
      quantity: Math.max(1, Math.floor(Number(item.quantity))),
    }));
}

async function handleCheckout(req: Request) {
  const user = await getUser(req);
  const payload = await req.json().catch(() => ({})) as Record<string, unknown>;
  const businessId = readStringField(payload, 'business_id');
  const cartItems = normalizeCartItems(payload);
  const auriosToSpend = readIntField(payload, 'aurios_to_spend');
  const aurioSignature = readStringField(payload, 'aurio_signature');
  const walletPubkey = readStringField(payload, 'wallet_pubkey');

  if (!businessId) return sendJson({ error: 'business_id is required' }, 400);
  if (cartItems.length === 0) return sendJson({ error: 'Cart is empty' }, 400);

  const supabase = getSupabaseAdmin();
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id, name, owner_id, wallet_adress, stripe_account_id')
    .eq('id', businessId)
    .maybeSingle<BusinessRow>();

  if (businessError) throw new Error(businessError.message);
  if (!business) return sendJson({ error: 'Business not found' }, 404);
  if (!business.wallet_adress) return sendJson({ error: 'Business wallet_adress is required' }, 400);
  if (!business.stripe_account_id) return sendJson({ error: 'Stripe Connect account is required' }, 400);

  const productIds = [...new Set(cartItems.map((item) => item.product_id as string))];
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, business_id, name, price_cents, active')
    .in('id', productIds)
    .eq('business_id', businessId)
    .eq('active', true)
    .returns<ProductRow[]>();

  if (productsError) throw new Error(productsError.message);
  if (!products || products.length !== productIds.length) {
    return sendJson({ error: 'Some products are unavailable' }, 400);
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  let subtotalCents = 0;
  const orderItems = cartItems.map((item) => {
    const product = productsById.get(item.product_id as string);
    if (!product) throw new Error('Product not found');
    const quantity = item.quantity as number;
    const totalCents = product.price_cents * quantity;
    subtotalCents += totalCents;
    return {
      product_id: product.id,
      quantity,
      unit_amount_cents: product.price_cents,
      total_cents: totalCents,
      product_name: product.name,
    };
  });

  const maxAurioDiscountCents = Math.floor(subtotalCents * 0.25);
  const aurioDiscountCents = Math.min(auriosToSpend, maxAurioDiscountCents);
  const finalTotalCents = Math.max(0, subtotalCents - aurioDiscountCents);
  if (finalTotalCents <= 0) return sendJson({ error: 'Checkout total must be greater than zero' }, 400);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      business_id: businessId,
      status: 'pending',
      subtotal_cents: subtotalCents,
      aurios_spent: aurioDiscountCents,
      aurio_discount_cents: aurioDiscountCents,
      final_total_cents: finalTotalCents,
      aurio_signature: aurioSignature,
      wallet_pubkey: walletPubkey,
    })
    .select('id')
    .single();

  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await supabase.from('order_items').insert(
    orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_amount_cents: item.unit_amount_cents,
      total_cents: item.total_cents,
    })),
  );
  if (itemsError) throw new Error(itemsError.message);

  const appBaseUrl = getOptionalEnv('APP_BASE_URL') ?? 'chakana://checkout';
  const platformFeeCents = Math.max(0, Number(getOptionalEnv('STRIPE_PLATFORM_FEE_CENTS') ?? '0'));
  const session = await stripeRequest<{
    id: string;
    url: string;
    payment_intent?: string;
  }>('/checkout/sessions', {
    mode: 'payment',
    success_url: `${appBaseUrl}?checkout=success&order_id=${order.id}`,
    cancel_url: `${appBaseUrl}?checkout=cancel&order_id=${order.id}`,
    'line_items[0][quantity]': 1,
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': finalTotalCents,
    'line_items[0][price_data][product_data][name]': `Pedido ${business.name}`,
    'payment_intent_data[transfer_data][destination]': business.stripe_account_id,
    'payment_intent_data[application_fee_amount]': platformFeeCents > 0 ? platformFeeCents : undefined,
    'metadata[order_id]': order.id,
    'metadata[business_id]': businessId,
    'metadata[aurios_spent]': aurioDiscountCents,
    'metadata[aurio_signature]': aurioSignature,
  });

  const { error: updateOrderError } = await supabase
    .from('orders')
    .update({
      status: 'checkout_created',
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent ?? null,
    })
    .eq('id', order.id);
  if (updateOrderError) throw new Error(updateOrderError.message);

  const { error: paymentError } = await supabase.from('payments').insert({
    order_id: order.id,
    status: 'pending',
    amount_cents: finalTotalCents,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent ?? null,
  });
  if (paymentError) throw new Error(paymentError.message);

  return sendJson({
    checkout_url: session.url,
    checkout_session_id: session.id,
    order_id: order.id,
  }, 201);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const path = url.pathname.slice(url.pathname.indexOf('/commerce-api') + '/commerce-api'.length) || '/';

    if (req.method === 'POST' && path === '/connect/onboarding-link') {
      return await handleConnectOnboarding(req);
    }

    if (req.method === 'POST' && path === '/checkout') {
      return await handleCheckout(req);
    }

    return sendJson({ error: 'Not found' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unhandled error';
    return sendJson({ error: message }, message === 'Unauthorized' ? 401 : 400);
  }
});

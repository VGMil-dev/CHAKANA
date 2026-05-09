import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type UserContext = {
  userId: string;
  email: string | null;
  role: 'client' | 'merchant' | 'admin';
  merchantId: string | null;
  fullName: string | null;
  stripeCustomerId: string | null;
};

type CartItemInput = {
  productId: string;
  quantity: number;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
};

const STRIPE_API_BASE = 'https://api.stripe.com/v1';
const STRIPE_API_VERSION = '2024-06-20';

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getSupabaseAdmin() {
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

function getBearerToken(req: Request) {
  const authHeader = req.headers.get('authorization') ?? '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new Error('Missing Bearer token');
  }
  return token;
}

async function stripePost(path: string, body: URLSearchParams) {
  const stripeSecret = Deno.env.get('STRIPE_SECRET') || Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecret) {
    throw new Error('Missing STRIPE_SECRET or STRIPE_SECRET_KEY');
  }

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION,
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe request failed (${response.status}): ${text}`);
  }

  return response.json();
}

async function getUserContext(req: Request): Promise<UserContext> {
  const token = getBearerToken(req);
  const supabase = getSupabaseAdmin();

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    throw new Error('Unauthorized');
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, email, full_name, role, merchant_id, stripe_customer_id')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('User profile not found');
  }

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
    merchantId: profile.merchant_id,
    fullName: profile.full_name,
    stripeCustomerId: profile.stripe_customer_id,
  };
}

function sendJson(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function readStringField(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readNumberField(payload: Record<string, unknown>, key: string): number {
  const value = payload[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function centsFromUsd(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
}

function calculateAurioDiscountCents(subtotalCents: number, requestedAurios: number) {
  const safeAurios = Number.isFinite(requestedAurios) && requestedAurios > 0
    ? Math.floor(requestedAurios)
    : 0;
  const requestedDiscountCents = safeAurios;
  const maxDiscountCents = Math.floor(subtotalCents * 0.25);
  const discountCents = Math.min(requestedDiscountCents, maxDiscountCents);

  return {
    auriosToSpend: discountCents,
    discountCents,
    finalTotalCents: Math.max(subtotalCents - discountCents, 0),
  };
}

function assertMerchant(user: UserContext) {
  if (user.role !== 'merchant' && user.role !== 'admin') {
    throw new Error('Only merchant/admin can perform this action');
  }
}

async function ensureMerchant(user: UserContext, nameHint?: string) {
  const supabase = getSupabaseAdmin();

  if (user.merchantId) {
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id, user_id, name')
      .eq('id', user.merchantId)
      .single();
    if (merchant) return merchant;
  }

  const merchantName = nameHint ?? user.fullName ?? 'Nuevo Tambú';
  const { data: merchant, error } = await supabase
    .from('merchants')
    .insert({ user_id: user.userId, name: merchantName })
    .select('id, user_id, name')
    .single();

  if (error || !merchant) {
    throw new Error(error?.message ?? 'Unable to create merchant profile');
  }

  const { error: updateUserError } = await supabase
    .from('users')
    .update({ merchant_id: merchant.id, role: user.role === 'admin' ? 'admin' : 'merchant' })
    .eq('id', user.userId);

  if (updateUserError) throw new Error(updateUserError.message);
  return merchant;
}

async function readProductsAndTotal(items: CartItemInput[]) {
  const supabase = getSupabaseAdmin();
  const productIds = items.map((item) => item.productId);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, price_cents, currency, merchant_id, active')
    .in('id', productIds);

  if (error) throw new Error(error.message);

  const map = new Map((products ?? []).map((product) => [product.id, product]));
  const priced = items.map((item) => {
    const product = map.get(item.productId);
    if (!product || !product.active) {
      throw new Error(`Product not available: ${item.productId}`);
    }
    return {
      product,
      quantity: item.quantity,
      subtotalCents: item.quantity * product.price_cents,
    };
  });

  const totalCents = priced.reduce((sum, current) => sum + current.subtotalCents, 0);
  return { priced, totalCents };
}

async function upsertCart(user: UserContext, items: CartItemInput[]) {
  const supabase = getSupabaseAdmin();

  const { data: existingCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let cartId = existingCart?.id;
  if (!cartId) {
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .insert({ user_id: user.userId, status: 'active' })
      .select('id')
      .single();

    if (cartError || !cart) throw new Error(cartError?.message ?? 'Unable to create cart');
    cartId = cart.id;
  }

  await supabase.from('cart_items').delete().eq('cart_id', cartId);

  if (items.length > 0) {
    const { priced } = await readProductsAndTotal(items);
    const rows = priced.map((entry) => ({
      cart_id: cartId,
      product_id: entry.product.id,
      quantity: entry.quantity,
      unit_price_cents: entry.product.price_cents,
    }));

    const { error: insertError } = await supabase.from('cart_items').insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  return cartId;
}

async function ensureStripeCustomer(user: UserContext) {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const body = new URLSearchParams({
    email: user.email ?? `${user.userId}@chakana.local`,
    name: user.fullName ?? 'Chakana user',
  });

  const customer = await stripePost('/customers', body) as { id: string };
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('id', user.userId);

  if (error) throw new Error(error.message);
  return customer.id;
}

async function handleCreateTambu(req: Request) {
  const user = await getUserContext(req);
  assertMerchant(user);

  const payload = await req.json();
  const title = String(payload.title ?? '').trim();
  if (!title) return sendJson({ error: 'title is required' }, 400);

  const merchant = await ensureMerchant(user, String(payload.merchant_name ?? title));
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('tambus')
    .insert({
      merchant_id: merchant.id,
      title,
      description: payload.description ?? null,
      location: payload.location ?? null,
      metadata: payload.metadata ?? {},
    })
    .select('*')
    .single();

  if (error) return sendJson({ error: error.message }, 400);
  return sendJson({ tambu: data }, 201);
}

async function handleGetTambu(tambuId: string) {
  const supabase = getSupabaseAdmin();
  const { data: tambu, error } = await supabase
    .from('tambus')
    .select('*, products(*, product_images(*))')
    .eq('id', tambuId)
    .single();

  if (error) return sendJson({ error: error.message }, 404);
  return sendJson({ tambu });
}

async function handleCreateProduct(req: Request, tambuId: string) {
  const user = await getUserContext(req);
  assertMerchant(user);

  const payload = await req.json();
  const title = String(payload.title ?? '').trim();
  const priceCents = Number(payload.price_cents);

  if (!title || !Number.isFinite(priceCents) || priceCents <= 0) {
    return sendJson({ error: 'title and price_cents are required' }, 400);
  }

  const supabase = getSupabaseAdmin();

  const merchant = await ensureMerchant(user);
  const { data: tambu, error: tambuError } = await supabase
    .from('tambus')
    .select('id, merchant_id')
    .eq('id', tambuId)
    .single();

  if (tambuError || !tambu) return sendJson({ error: 'Tambu not found' }, 404);
  if (tambu.merchant_id !== merchant.id && user.role !== 'admin') {
    return sendJson({ error: 'Forbidden' }, 403);
  }

  const currency = String(payload.currency ?? 'usd').toLowerCase();

  let stripeProductId: string | null = null;
  let stripePriceId: string | null = null;

  if (Deno.env.get('STRIPE_SECRET') || Deno.env.get('STRIPE_SECRET_KEY')) {
    const stripeProduct = await stripePost('/products', new URLSearchParams({ name: title })) as { id: string };
    stripeProductId = stripeProduct.id;

    const stripePrice = await stripePost('/prices', new URLSearchParams({
      product: stripeProduct.id,
      currency,
      unit_amount: String(priceCents),
    })) as { id: string };

    stripePriceId = stripePrice.id;
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      tambu_id: tambu.id,
      merchant_id: merchant.id,
      title,
      description: payload.description ?? null,
      price_cents: priceCents,
      currency,
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
      active: payload.active ?? true,
    })
    .select('*')
    .single();

  if (productError || !product) {
    return sendJson({ error: productError?.message ?? 'Unable to create product' }, 400);
  }

  if (payload.image_path) {
    await supabase.from('product_images').insert({
      product_id: product.id,
      storage_path: payload.image_path,
      url: payload.image_url ?? null,
    });
  }

  return sendJson({ product }, 201);
}

async function handlePatchProduct(req: Request, productId: string) {
  const user = await getUserContext(req);
  assertMerchant(user);

  const payload = await req.json();
  const supabase = getSupabaseAdmin();

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, merchant_id')
    .eq('id', productId)
    .single();

  if (productError || !product) return sendJson({ error: 'Product not found' }, 404);
  if (product.merchant_id !== user.merchantId && user.role !== 'admin') {
    return sendJson({ error: 'Forbidden' }, 403);
  }

  const patch: Record<string, unknown> = {};
  if (payload.title !== undefined) patch.title = String(payload.title);
  if (payload.description !== undefined) patch.description = payload.description;
  if (payload.price_cents !== undefined) patch.price_cents = Number(payload.price_cents);
  if (payload.currency !== undefined) patch.currency = String(payload.currency).toLowerCase();
  if (payload.active !== undefined) patch.active = Boolean(payload.active);

  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update(patch)
    .eq('id', product.id)
    .select('*')
    .single();

  if (updateError) return sendJson({ error: updateError.message }, 400);
  return sendJson({ product: updated });
}

async function handleCart(req: Request) {
  const user = await getUserContext(req);
  const payload = await req.json();
  const items = Array.isArray(payload.items) ? payload.items : [];

  const normalized: CartItemInput[] = items.map((item: Record<string, unknown>) => ({
    productId: String(item.product_id ?? item.productId ?? ''),
    quantity: Number(item.quantity ?? 1),
  })).filter((item) => !!item.productId && item.quantity > 0);

  const cartId = await upsertCart(user, normalized);
  const { priced, totalCents } = await readProductsAndTotal(normalized);

  return sendJson({
    cart_id: cartId,
    total_cents: totalCents,
    items: priced.map((item) => ({
      product_id: item.product.id,
      title: item.product.title,
      unit_price_cents: item.product.price_cents,
      quantity: item.quantity,
      subtotal_cents: item.subtotalCents,
    })),
  });
}

async function handleCheckout(req: Request) {
  const user = await getUserContext(req);
  const payload = await req.json() as Record<string, unknown>;

  const items = Array.isArray(payload.items)
    ? payload.items.map((item: Record<string, unknown>) => ({
        productId: String(item.product_id ?? item.productId ?? ''),
        quantity: Number(item.quantity ?? 1),
      })).filter((item: CartItemInput) => !!item.productId && item.quantity > 0)
    : [];

  if (items.length === 0) {
    return sendJson({ error: 'At least one item is required' }, 400);
  }

  const { priced, totalCents } = await readProductsAndTotal(items);
  const requestedAuriosToSpend = readNumberField(payload, 'aurios_to_spend');
  const clientAurioDiscountCents = centsFromUsd(readNumberField(payload, 'aurio_discount_usd'));
  const clientFinalTotalCents = centsFromUsd(readNumberField(payload, 'final_total'));
  const aurioSignature = readStringField(payload, 'aurio_signature');
  const walletPubKey = readStringField(payload, 'wallet_pubkey');
  const businessId = readStringField(payload, 'business_id');
  const discount = calculateAurioDiscountCents(totalCents, requestedAuriosToSpend);

  if (discount.auriosToSpend > 0 && !aurioSignature) {
    return sendJson({ error: 'aurio_signature is required when applying Aurio discount' }, 400);
  }

  // TODO: verify aurioSignature before applying discount in production.
  const merchantId = priced[0]?.product.merchant_id ?? null;

  const supabase = getSupabaseAdmin();
  const orderInsert = await supabase
    .from('orders')
    .insert({
      user_id: user.userId,
      merchant_id: merchantId,
      total_cents: discount.finalTotalCents,
      currency: priced[0]?.product.currency ?? 'usd',
      status: 'pending',
    })
    .select('*')
    .single();

  if (orderInsert.error || !orderInsert.data) {
    return sendJson({ error: orderInsert.error?.message ?? 'Unable to create order' }, 400);
  }

  const order = orderInsert.data;

  const orderItems = priced.map((entry) => ({
    order_id: order.id,
    product_id: entry.product.id,
    quantity: entry.quantity,
    unit_price_cents: entry.product.price_cents,
    title_snapshot: entry.product.title,
  }));
  const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems);
  if (orderItemsError) return sendJson({ error: orderItemsError.message }, 400);

  const customerId = await ensureStripeCustomer(user);
  const appBaseUrl = Deno.env.get('APP_BASE_URL') ?? 'https://example.com';
  const stripeMetadata: Record<string, string> = {
    order_id: order.id,
    user_id: user.userId,
    business_id: businessId ?? '',
    subtotal_cents: String(totalCents),
    aurios_to_spend: String(discount.auriosToSpend),
    aurio_discount_cents: String(discount.discountCents),
    aurio_discount_usd_client: String(clientAurioDiscountCents),
    final_total_cents: String(discount.finalTotalCents),
    final_total_cents_client: String(clientFinalTotalCents),
    aurio_signature: aurioSignature ?? '',
    wallet_pubkey: walletPubKey ?? '',
  };

  const stripeSession = await stripePost('/checkout/sessions', new URLSearchParams({
    mode: 'payment',
    customer: customerId,
    success_url: String(payload.success_url ?? `${appBaseUrl}/checkout/success?order_id=${order.id}`),
    cancel_url: String(payload.cancel_url ?? `${appBaseUrl}/checkout/cancel?order_id=${order.id}`),
    'line_items[0][price_data][currency]': priced[0]?.product.currency ?? 'usd',
    'line_items[0][price_data][unit_amount]': String(discount.finalTotalCents),
    'line_items[0][price_data][product_data][name]': discount.discountCents > 0
      ? 'Chakana order with Aurio discount'
      : 'Chakana order',
    'line_items[0][quantity]': '1',
    ...Object.entries(stripeMetadata).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[`metadata[${key}]`] = value;
      return acc;
    }, {}),
  })) as { id: string; url: string | null; payment_intent: string | null };

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({
      stripe_checkout_session_id: stripeSession.id,
      stripe_payment_id: stripeSession.payment_intent,
    })
    .eq('id', order.id);

  if (orderUpdateError) return sendJson({ error: orderUpdateError.message }, 400);

  await supabase.from('payments').upsert({
    order_id: order.id,
    stripe_payment_id: stripeSession.payment_intent,
    amount_cents: discount.finalTotalCents,
    status: 'pending',
  });

  await upsertCart(user, []);

  return sendJson({
    order_id: order.id,
    checkout_url: stripeSession.url,
    checkout_session_id: stripeSession.id,
    subtotal_cents: totalCents,
    aurio_discount_cents: discount.discountCents,
    total_cents: discount.finalTotalCents,
  }, 201);
}

async function handleGetOrder(req: Request, orderId: string) {
  const user = await getUserContext(req);
  const supabase = getSupabaseAdmin();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*), payments(*)')
    .eq('id', orderId)
    .single();

  if (error || !order) return sendJson({ error: 'Order not found' }, 404);

  if (order.user_id !== user.userId && order.merchant_id !== user.merchantId && user.role !== 'admin') {
    return sendJson({ error: 'Forbidden' }, 403);
  }

  return sendJson({ order });
}

function getRoutePath(url: URL) {
  const marker = '/commerce-api';
  const index = url.pathname.indexOf(marker);
  if (index === -1) return '/';
  const path = url.pathname.slice(index + marker.length);
  return path || '/';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const path = getRoutePath(url);
    const segments = path.split('/').filter(Boolean);

    if (req.method === 'POST' && path === '/api/tambus') {
      return await handleCreateTambu(req);
    }

    if (req.method === 'GET' && segments[0] === 'api' && segments[1] === 'tambus' && segments[2]) {
      return await handleGetTambu(segments[2]);
    }

    if (req.method === 'POST' && segments[0] === 'api' && segments[1] === 'tambus' && segments[2] && segments[3] === 'products') {
      return await handleCreateProduct(req, segments[2]);
    }

    if (req.method === 'PATCH' && segments[0] === 'api' && segments[1] === 'products' && segments[2]) {
      return await handlePatchProduct(req, segments[2]);
    }

    if (req.method === 'POST' && path === '/api/cart') {
      return await handleCart(req);
    }

    if (req.method === 'POST' && path === '/api/checkout') {
      return await handleCheckout(req);
    }

    if (req.method === 'GET' && segments[0] === 'api' && segments[1] === 'orders' && segments[2]) {
      return await handleGetOrder(req, segments[2]);
    }

    return sendJson({ error: 'Not found' }, 404);
  } catch (error) {
    return sendJson({ error: error instanceof Error ? error.message : 'Unhandled error' }, 400);
  }
});

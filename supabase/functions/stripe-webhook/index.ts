import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, serviceRoleKey);
}

function secureCompare(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getStringField(source: Record<string, unknown>, key: string) {
  const value = source[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing Stripe field: ${key}`);
  }
  return value;
}

function getNullableStringField(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === 'string' ? value : null;
}

function getNullableNumberField(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === 'number' ? value : null;
}

async function computeSignature(payload: string, timestamp: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyStripeEvent(rawBody: string, signatureHeader: string, secret: string): Promise<StripeEvent> {
  const chunks = signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  if (!chunks.t || !chunks.v1) {
    throw new Error('Missing Stripe signature components');
  }

  const expected = await computeSignature(rawBody, chunks.t, secret);
  if (!secureCompare(expected, chunks.v1)) {
    throw new Error('Stripe signature validation failed');
  }

  return JSON.parse(rawBody) as StripeEvent;
}

async function markOrderPaid(session: Record<string, unknown>, eventId: string) {
  const supabase = getSupabaseAdmin();
  const checkoutSessionId = getStringField(session, 'id');
  const paymentIntentId = getNullableStringField(session, 'payment_intent');

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, total_cents')
    .eq('stripe_checkout_session_id', checkoutSessionId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order not found for checkout session ${checkoutSessionId}`);
  }

  const amountCents = getNullableNumberField(session, 'amount_total') ?? order.total_cents;

  const { error: paymentError } = await supabase.from('payments').upsert({
    order_id: order.id,
    stripe_event_id: eventId,
    stripe_payment_id: paymentIntentId,
    amount_cents: amountCents,
    status: 'paid',
  });

  if (paymentError) throw new Error(paymentError.message);

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({ status: 'paid', stripe_payment_id: paymentIntentId })
    .eq('id', order.id);

  if (orderUpdateError) throw new Error(orderUpdateError.message);
}

async function markOrderFailed(paymentIntent: Record<string, unknown>, eventId: string) {
  const supabase = getSupabaseAdmin();
  const paymentIntentId = getStringField(paymentIntent, 'id');

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, total_cents')
    .eq('stripe_payment_id', paymentIntentId)
    .single();

  if (orderError || !order) {
    return;
  }

  const { error: paymentError } = await supabase.from('payments').upsert({
    order_id: order.id,
    stripe_event_id: eventId,
    stripe_payment_id: paymentIntentId,
    amount_cents: getNullableNumberField(paymentIntent, 'amount') ?? order.total_cents,
    status: 'failed',
  });

  if (paymentError) throw new Error(paymentError.message);

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({ status: 'failed' })
    .eq('id', order.id);

  if (orderUpdateError) throw new Error(orderUpdateError.message);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response(JSON.stringify({ error: 'Missing Stripe signature or webhook secret' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawBody = await req.text();
    const event = await verifyStripeEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      await markOrderPaid(event.data.object, event.id);
    } else if (event.type === 'payment_intent.payment_failed') {
      await markOrderFailed(event.data.object, event.id);
    }

    return new Response(JSON.stringify({ received: true, type: event.type }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

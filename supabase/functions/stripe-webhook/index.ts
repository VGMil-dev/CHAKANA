import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getSupabaseAdmin() {
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

function sendJson(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string | null) {
  if (!signatureHeader) throw new Error('Missing Stripe-Signature header');

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const [key, value] = part.split('=');
      return [key, value];
    }),
  );
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) throw new Error('Invalid Stripe-Signature header');

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) {
    throw new Error('Stripe signature timestamp is outside tolerance');
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getEnv('STRIPE_WEBHOOK_SECRET')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );

  if (!timingSafeEqual(toHex(digest), signature)) {
    throw new Error('Stripe signature verification failed');
  }
}

function readString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

async function markOrderFromCheckoutSession(
  event: StripeEvent,
  status: 'paid' | 'failed' | 'canceled',
) {
  const session = event.data.object;
  const sessionId = readString(session.id);
  const paymentIntentId = readString(session.payment_intent);
  const metadata = session.metadata as Record<string, unknown> | undefined;
  const orderId = readString(metadata?.order_id);

  if (!sessionId && !orderId) return;

  const supabase = getSupabaseAdmin();
  const matchColumn = orderId ? 'id' : 'stripe_checkout_session_id';
  const matchValue = orderId ?? sessionId;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .update({
      status,
      stripe_checkout_session_id: sessionId,
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq(matchColumn, matchValue)
    .select('id, final_total_cents')
    .maybeSingle();

  if (orderError) throw new Error(orderError.message);
  if (!order) return;

  const amountTotal = typeof session.amount_total === 'number'
    ? session.amount_total
    : order.final_total_cents;

  await supabase
    .from('payments')
    .upsert({
      order_id: order.id,
      status,
      amount_cents: amountTotal,
      stripe_checkout_session_id: sessionId,
      stripe_payment_intent_id: paymentIntentId,
      stripe_event_id: event.id,
    }, { onConflict: 'stripe_checkout_session_id' });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return sendJson({ error: 'Method not allowed' }, 405);

  try {
    const rawBody = await req.text();
    await verifyStripeSignature(rawBody, req.headers.get('Stripe-Signature'));
    const event = JSON.parse(rawBody) as StripeEvent;

    const supabase = getSupabaseAdmin();
    const { error: eventInsertError } = await supabase
      .from('stripe_events')
      .insert({ event_id: event.id, event_type: event.type, payload: event });

    if (eventInsertError) {
      if (eventInsertError.code === '23505') return sendJson({ received: true, duplicate: true });
      throw new Error(eventInsertError.message);
    }

    if (event.type === 'checkout.session.completed') {
      await markOrderFromCheckoutSession(event, 'paid');
    }

    if (event.type === 'checkout.session.expired') {
      await markOrderFromCheckoutSession(event, 'canceled');
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const paymentIntentId = readString(paymentIntent.id);
      if (paymentIntentId) {
        await supabase
          .from('orders')
          .update({ status: 'failed', stripe_payment_intent_id: paymentIntentId })
          .eq('stripe_payment_intent_id', paymentIntentId);
        await supabase
          .from('payments')
          .update({ status: 'failed', stripe_event_id: event.id })
          .eq('stripe_payment_intent_id', paymentIntentId);
      }
    }

    return sendJson({ received: true });
  } catch (error) {
    return sendJson({ error: error instanceof Error ? error.message : 'Unhandled error' }, 400);
  }
});

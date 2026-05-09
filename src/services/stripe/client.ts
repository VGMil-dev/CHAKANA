export type StripeLineItem = {
  name: string;
  unitAmountCents: number;
  quantity: number;
  currency?: string;
};

export type CreateCheckoutSessionInput = {
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  lineItems: StripeLineItem[];
  metadata?: Record<string, string>;
};

const STRIPE_API_BASE = 'https://api.stripe.com/v1';
const STRIPE_API_VERSION = '2024-06-20';

function getStripeSecret(): string {
  const secret = process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('Missing STRIPE_SECRET or STRIPE_SECRET_KEY');
  }
  return secret;
}

async function stripePost<T>(path: string, body: URLSearchParams): Promise<T> {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getStripeSecret()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION,
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function createCustomer(email: string, name?: string) {
  const body = new URLSearchParams({ email });
  if (name) body.set('name', name);
  return stripePost<{ id: string }>('/customers', body);
}

export async function createCheckoutSession(input: CreateCheckoutSessionInput) {
  const body = new URLSearchParams({
    mode: 'payment',
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  });

  if (input.customerId) {
    body.set('customer', input.customerId);
  }

  input.lineItems.forEach((item, index) => {
    body.set(`line_items[${index}][price_data][currency]`, item.currency ?? 'usd');
    body.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmountCents));
    body.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    body.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  if (input.metadata) {
    Object.entries(input.metadata).forEach(([key, value]) => {
      body.set(`metadata[${key}]`, value);
    });
  }

  return stripePost<{ id: string; url: string | null; payment_intent: string | null }>(
    '/checkout/sessions',
    body
  );
}

function secureCompare(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function computeStripeSignature(payload: string, timestamp: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  return Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handleWebhookEvent(rawBody: string, stripeSignature: string, webhookSecret: string) {
  const parts = stripeSignature.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  if (!parts.t || !parts.v1) {
    throw new Error('Invalid Stripe signature header format');
  }

  const expectedSignature = await computeStripeSignature(rawBody, parts.t, webhookSecret);
  if (!secureCompare(expectedSignature, parts.v1)) {
    throw new Error('Invalid Stripe webhook signature');
  }

  return JSON.parse(rawBody) as {
    id: string;
    type: string;
    data: {
      object: Record<string, unknown>;
    };
  };
}

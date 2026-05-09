import { supabase } from './client';

export async function createTambu(payload: {
  merchant_id: string;
  title: string;
  description?: string;
  location?: string;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await (supabase as any)
    .from('tambus')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createProduct(payload: {
  tambu_id: string;
  merchant_id: string;
  title: string;
  description?: string;
  price_cents: number;
  currency?: string;
  stripe_price_id?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('products')
    .insert({
      ...payload,
      currency: payload.currency ?? 'usd',
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createOrder(payload: {
  user_id: string;
  merchant_id?: string;
  total_cents: number;
  currency?: string;
  status?: 'pending' | 'paid' | 'failed' | 'cancelled';
  stripe_checkout_session_id?: string;
  stripe_payment_id?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('orders')
    .insert({
      ...payload,
      currency: payload.currency ?? 'usd',
      status: payload.status ?? 'pending',
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrderById(id: string) {
  const { data, error } = await (supabase as any)
    .from('orders')
    .select('*, order_items(*), payments(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

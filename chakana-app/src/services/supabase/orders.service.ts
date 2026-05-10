import { supabase } from './client';
import type { Database } from '../../types/database';

export type Order = Database['public']['Tables']['orders']['Row'];

export async function getMyOrders(): Promise<Order[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type CashOrderCartItem = {
  productId: string;
  quantity: number;
  unitAmountCents: number;
};

export type CreateCashOrderParams = {
  businessId: string;
  cartItems: CashOrderCartItem[];
  subtotalCents: number;
  auriosSpent: number;
  aurioDiscountCents: number;
  finalTotalCents: number;
  aurioSignature?: string;
  walletPubKey?: string;
};

export type CashOrderResult = {
  orderId: string;
};

export async function createCashOrder(params: CreateCashOrderParams): Promise<CashOrderResult> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Usuario no autenticado.');

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userData.user.id,
      business_id: params.businessId,
      status: 'cash_pending',
      payment_method: 'cash',
      currency: 'usd',
      subtotal_cents: params.subtotalCents,
      aurios_spent: params.auriosSpent,
      aurio_discount_cents: params.aurioDiscountCents,
      final_total_cents: params.finalTotalCents,
      aurio_signature: params.aurioSignature ?? null,
      wallet_pubkey: params.walletPubKey ?? null,
    } as unknown as Database['public']['Tables']['orders']['Insert'])
    .select('id')
    .single();

  if (orderError) throw new Error(orderError.message);

  const orderItems = params.cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_amount_cents: item.unitAmountCents,
    total_cents: item.quantity * item.unitAmountCents,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error(itemsError.message);

  return { orderId: order.id };
}

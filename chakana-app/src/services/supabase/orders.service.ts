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

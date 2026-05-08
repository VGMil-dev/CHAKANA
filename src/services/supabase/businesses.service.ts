import { supabase } from './client';
import type { Database } from '../../types/database';

type Business = Database['public']['Tables']['businesses']['Row'];

export async function getAllBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBusinessById(id: string): Promise<Business> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

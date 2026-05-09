import { supabase } from './client';
import type { Database } from '../../types/database';

type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type Review = Database['public']['Tables']['reviews']['Row'];

type SubmitReviewRewardParams = {
  userWallet: string;
  reviewText: string;
  businessId: string;
};

export type SubmitReviewRewardResponse = {
  success: boolean;
  signature: string;
  mintedTo: string;
  amount: number;
};

function getReviewRewardError(status: number): Error {
  if (status === 400) return new Error('Faltan datos para enviar la reseña.');
  if (status === 401) return new Error('La clave de Supabase no es válida o no está configurada.');
  if (status === 500) {
    return new Error('Error del oráculo al mintear Aurios. Revisa mint, ATA o variables de entorno.');
  }

  return new Error('No se pudo enviar la reseña. Intenta nuevamente.');
}

export async function submitReviewReward(
  params: SubmitReviewRewardParams,
): Promise<SubmitReviewRewardResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/mint-aurio-on-review`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userWallet: params.userWallet,
        reviewText: params.reviewText,
        businessId: params.businessId,
      }),
    },
  );

  if (!response.ok) throw getReviewRewardError(response.status);

  const data = (await response.json()) as Partial<SubmitReviewRewardResponse>;

  if (data.success !== true) {
    throw new Error('La reseña se procesó, pero no se confirmó el reward de Aurios.');
  }

  if (!data.signature) {
    console.warn('Review reward success without signature. Check Edge Function response.');
  }

  return {
    success: data.success,
    signature: data.signature ?? '',
    mintedTo: data.mintedTo ?? '',
    amount: data.amount ?? 0,
  };
}

export async function insertReview(payload: {
  business_id: string;
  text: string;
  solana_memo_signature?: string;
}): Promise<Review> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const insert: ReviewInsert = {
    user_id: userData.user.id,
    business_id: payload.business_id,
    text: payload.text,
    solana_memo_signature: payload.solana_memo_signature ?? null,
    aurios_rewarded: 0,
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMyReviews(): Promise<Review[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

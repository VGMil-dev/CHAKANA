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
  ticket?: string;
  amount?: number;
  serverPubKey?: string;
  reviewId?: string;
  error?: string;
};

export async function submitReviewReward(
  params: SubmitReviewRewardParams,
): Promise<SubmitReviewRewardResponse> {
  const { data, error } = await supabase.functions.invoke('mint-aurio-on-review', {
    body: {
      userWallet: params.userWallet,
      reviewText: params.reviewText,
      businessId: params.businessId,
    },
  });

  if (error) {
    console.error('Edge Function Error:', error);
    throw new Error('Error de comunicación con el servidor de tickets.');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return {
    success: data?.success === true,
    ticket: data?.ticket,
    amount: data?.amount,
    serverPubKey: data?.serverPubKey,
    reviewId: data?.reviewId,
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

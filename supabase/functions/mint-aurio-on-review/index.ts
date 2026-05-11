import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6';

const AURIOS_PER_REVIEW = 1;
const NODE_SERVER_URL = 'https://aurio-chain.gavanti.org/mint-aurio';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function sendJson(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getSupabaseForUser(req: Request) {
  const authorization = req.headers.get('Authorization') ?? '';
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
  });
}

function getSupabaseAdmin() {
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });
  
  try {
    const payload = await req.json().catch(() => ({})) as Record<string, unknown>;
    const userWalletStr = typeof payload.userWallet === 'string' ? payload.userWallet.trim() : '';
    const reviewText = typeof payload.reviewText === 'string' ? payload.reviewText.trim() : '';
    const businessId = typeof payload.businessId === 'string' ? payload.businessId.trim() : '';

    if (!userWalletStr || !reviewText || !businessId) return sendJson({ error: 'Missing review fields' }, 200);
    if (countWords(reviewText) < 10) return sendJson({ error: 'Review must contain at least 10 words' }, 200);

    const userSupabase = getSupabaseForUser(req);
    const { data: userData, error: userError } = await userSupabase.auth.getUser();
    if (userError || !userData.user) return sendJson({ error: 'Unauthorized' }, 200);

    // 1. Delegate Minting to Node.js Server
    const internalSecret = Deno.env.get('INTERNAL_SECRET');
    if (!internalSecret) throw new Error('INTERNAL_SECRET not configured in Supabase');

    const mintResponse = await fetch(NODE_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': internalSecret,
      },
      body: JSON.stringify({
        userWallet: userWalletStr,
        reviewText: reviewText, // Server expects this
        businessId: businessId,
        amount: AURIOS_PER_REVIEW
      }),
    });

    const mintData = await mintResponse.json();
    if (!mintResponse.ok || mintData.success !== true) {
      throw new Error(mintData.error || 'Failed to mint tokens on dedicated server');
    }

    // 2. Save review in DB
    const admin = getSupabaseAdmin();
    const { error: reviewError } = await admin
      .from('reviews')
      .insert({
        user_id: userData.user.id,
        business_id: businessId,
        text: reviewText,
        aurios_rewarded: AURIOS_PER_REVIEW,
        solana_memo_signature: mintData.signature,
      });
    
    if (reviewError) throw new Error(reviewError.message);

    return sendJson({
      success: true,
      signature: mintData.signature,
      mintedTo: userWalletStr,
      amount: AURIOS_PER_REVIEW,
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return sendJson({ error: error instanceof Error ? error.message : String(error) }, 200);
  }
});

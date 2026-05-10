import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  Connection,
  Keypair,
  PublicKey,
} from 'npm:@solana/web3.js@1.98.4';
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from 'npm:@solana/spl-token@0.4.14';
import bs58 from 'npm:bs58@6.0.0';

const AURIOS_PER_REVIEW = 1;
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

function parseMintAuthority() {
  const raw = getEnv('AURIO_MINT_AUTHORITY_KEYPAIR').trim();
  if (raw.startsWith('[')) {
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw) as number[]));
  }
  return Keypair.fromSecretKey(bs58.decode(raw));
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function getMintDecimals(connection: Connection, mint: PublicKey) {
  const parsed = await connection.getParsedAccountInfo(mint);
  const value = parsed.value?.data;
  if (!value || typeof value === 'string' || !('parsed' in value)) return 0;
  const decimals = value.parsed?.info?.decimals;
  return typeof decimals === 'number' ? decimals : 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return sendJson({ error: 'Method not allowed' }, 405);

  try {
    const payload = await req.json().catch(() => ({})) as Record<string, unknown>;
    const userWallet = typeof payload.userWallet === 'string' ? payload.userWallet.trim() : '';
    const reviewText = typeof payload.reviewText === 'string' ? payload.reviewText.trim() : '';
    const businessId = typeof payload.businessId === 'string' ? payload.businessId.trim() : '';

    if (!userWallet || !reviewText || !businessId) return sendJson({ error: 'Missing review fields' }, 400);
    if (countWords(reviewText) < 50) return sendJson({ error: 'Review must contain at least 50 words' }, 400);

    const userSupabase = getSupabaseForUser(req);
    const { data: userData, error: userError } = await userSupabase.auth.getUser();
    if (userError || !userData.user) return sendJson({ error: 'Unauthorized' }, 401);

    const admin = getSupabaseAdmin();
    const { data: review, error: reviewError } = await admin
      .from('reviews')
      .insert({
        user_id: userData.user.id,
        business_id: businessId,
        text: reviewText,
        aurios_rewarded: 0,
      })
      .select('id')
      .single();
    if (reviewError) throw new Error(reviewError.message);

    const connection = new Connection(
      Deno.env.get('SOLANA_RPC_URL') ?? 'https://api.devnet.solana.com',
      'confirmed',
    );
    const mintAuthority = parseMintAuthority();
    const mint = new PublicKey(getEnv('AURIO_MINT_ADDRESS'));
    const recipient = new PublicKey(userWallet);
    const decimals = await getMintDecimals(connection, mint);
    const amount = BigInt(AURIOS_PER_REVIEW) * (10n ** BigInt(decimals));
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority,
      mint,
      recipient,
    );
    const signature = await mintTo(
      connection,
      mintAuthority,
      mint,
      tokenAccount.address,
      mintAuthority,
      amount,
    );

    const { error: updateError } = await admin
      .from('reviews')
      .update({
        aurios_rewarded: AURIOS_PER_REVIEW,
        solana_memo_signature: signature,
      })
      .eq('id', review.id);
    if (updateError) throw new Error(updateError.message);

    return sendJson({
      success: true,
      signature,
      mintedTo: userWallet,
      amount: AURIOS_PER_REVIEW,
      reviewId: review.id,
    });
  } catch (error) {
    return sendJson({ error: error instanceof Error ? error.message : 'Unhandled reward error' }, 500);
  }
});

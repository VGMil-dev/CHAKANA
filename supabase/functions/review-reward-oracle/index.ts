import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const AURIOS_PER_REVIEW = 100;

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let body: { record: { id: string; text: string; user_id: string; aurios_rewarded: number } };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const review = body.record;

  if (!review.text || review.text.length <= 50) {
    return new Response(JSON.stringify({ rewarded: false, reason: 'text_too_short' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  if (review.aurios_rewarded > 0) {
    return new Response(JSON.stringify({ rewarded: false, reason: 'already_rewarded' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  const { error } = await supabase
    .from('reviews')
    .update({ aurios_rewarded: AURIOS_PER_REVIEW })
    .eq('id', review.id);

  if (error) {
    console.error('Error updating review:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  console.log(`Oracle: rewarded ${AURIOS_PER_REVIEW} Aurios to review ${review.id}`);

  return new Response(
    JSON.stringify({ rewarded: true, aurios: AURIOS_PER_REVIEW, review_id: review.id }),
    { headers: { 'Content-Type': 'application/json' }, status: 200 }
  );
});

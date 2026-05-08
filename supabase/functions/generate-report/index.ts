import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';
const MAX_REVIEWS = 20;

Deno.serve(async (req: Request) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(req.url);
  const businessId = url.searchParams.get('business_id');

  if (!businessId) {
    return new Response(JSON.stringify({ error: 'business_id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY')!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('text, created_at, aurios_rewarded')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(MAX_REVIEWS);

  if (reviewsError) {
    return new Response(JSON.stringify({ error: reviewsError.message }), { status: 500 });
  }

  if (!reviews || reviews.length === 0) {
    return new Response(JSON.stringify({ error: 'No reviews found for this business' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const reviewTexts = reviews.map((r, i) => `Reseña ${i + 1}: ${r.text}`).join('\n\n');
  const reportScript = buildReportScript(reviewTexts, reviews.length);

  const ttsResponse = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: reportScript,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!ttsResponse.ok) {
    const errText = await ttsResponse.text();
    return new Response(JSON.stringify({ error: `ElevenLabs error: ${errText}` }), {
      status: 502,
    });
  }

  const audioBuffer = await ttsResponse.arrayBuffer();
  const audioBytes = new Uint8Array(audioBuffer);

  const fileName = `${businessId}/${Date.now()}.mp3`;
  const { error: uploadError } = await supabase.storage
    .from('reports')
    .upload(fileName, audioBytes, {
      contentType: 'audio/mpeg',
      upsert: false,
    });

  if (uploadError) {
    return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
  }

  const { error: dbError } = await supabase
    .from('audio_reports')
    .insert({ business_id: businessId, storage_path: fileName });

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from('reports')
    .createSignedUrl(fileName, 3600);

  if (signedError) {
    return new Response(JSON.stringify({ error: signedError.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ audio_url: signedData.signedUrl, report_path: fileName }),
    { headers: { 'Content-Type': 'application/json' }, status: 200 }
  );
});

function buildReportScript(reviewTexts: string, count: number): string {
  return `Hola, aquí tienes tu resumen semanal de Chakana. Tienes ${count} reseñas recientes de tus embajadores. A continuación, los puntos más destacados: ${reviewTexts.substring(0, 800)}. Sigue así, tu comunidad te valora.`;
}

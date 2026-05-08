/**
 * QA 07 — Edge Function: generate-report
 * Criterio: GET /functions/v1/generate-report?business_id=X
 *           retorna { audio_url, report_path } con status 200
 *           y el audio_url apunta a un mp3 válido en Storage
 * Corresponde a: Task 10 del plan
 */
import { supabaseAdmin, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';

async function run() {
  console.log('\n🎙️  QA 07: Edge Function — generate-report\n');
  const results: QAResult[] = [];

  results.push(await check('Prereq: QA_BUSINESS_ID configurado en .env', async () => {
    assert(!!env.businessId,
      'Configurar QA_BUSINESS_ID en qa/.env con el UUID del negocio que tiene reseñas');
  }));

  results.push(await check('generate-report: endpoint responde 200 con audio_url', async () => {
    const url = `${env.url}/functions/v1/generate-report?business_id=${env.businessId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${env.anonKey}` },
    });
    assert(response.ok, `Edge Function retornó ${response.status}: ${await response.text()}`);
    const body = await response.json();
    assert(!!body.audio_url, `Respuesta no tiene audio_url: ${JSON.stringify(body)}`);
    assert(typeof body.audio_url === 'string' && body.audio_url.startsWith('https'),
      `audio_url no es una URL válida: ${body.audio_url}`);
    assert(!!body.report_path, `Respuesta no tiene report_path: ${JSON.stringify(body)}`);
  }));

  results.push(await check('generate-report: audio_url apunta a un archivo descargable', async () => {
    const url = `${env.url}/functions/v1/generate-report?business_id=${env.businessId}`;
    const reportResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${env.anonKey}` },
    });
    if (!reportResponse.ok) {
      throw new Error(`Edge Function falló con ${reportResponse.status}`);
    }
    const { audio_url } = await reportResponse.json();

    const audioResponse = await fetch(audio_url);
    assert(audioResponse.ok, `audio_url no es descargable (${audioResponse.status})`);
    const contentType = audioResponse.headers.get('content-type') ?? '';
    assert(
      contentType.includes('audio') || contentType.includes('octet-stream'),
      `Content-Type inesperado: ${contentType} — ¿Es realmente un mp3?`
    );
  }));

  results.push(await check('generate-report: registro creado en tabla audio_reports', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
    const { data, error } = await supabaseAdmin!
      .from('audio_reports')
      .select('id, storage_path, generated_at')
      .eq('business_id', env.businessId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();
    assert(!error, `No hay registros en audio_reports: ${error?.message}`);
    assert(!!data.storage_path, 'storage_path vacío en el registro de audio_report');
    // El reporte debería ser reciente (últimos 5 minutos)
    const ageMs = Date.now() - new Date(data.generated_at).getTime();
    assert(ageMs < 5 * 60 * 1000,
      `El último reporte tiene ${Math.round(ageMs / 1000)}s de antigüedad — ¿se generó correctamente?`);
  }));

  results.push(await check('generate-report: error claro cuando business_id está ausente', async () => {
    const url = `${env.url}/functions/v1/generate-report`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${env.anonKey}` },
    });
    assert(response.status === 400, `Se esperaba 400, got ${response.status}`);
    const body = await response.json();
    assert(!!body.error, 'Respuesta de error no tiene campo error');
  }));

  results.push(await check('generate-report: error claro cuando negocio no tiene reseñas', async () => {
    // UUID válido pero sin reseñas asociadas
    const fakeId = '00000000-0000-0000-0000-000000000099';
    const url = `${env.url}/functions/v1/generate-report?business_id=${fakeId}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${env.anonKey}` },
    });
    assert(response.status === 404, `Se esperaba 404, got ${response.status}`);
  }));

  printSummary('QA 07 - generate-report Edge Function', results);
  return results.every(r => r.pass);
}

run().then(ok => process.exit(ok ? 0 : 1));

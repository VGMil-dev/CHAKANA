/**
 * QA 02 — Schema y RLS
 * Criterio: Las 4 tablas existen, RLS bloquea acceso sin auth, trigger crea profile
 * Corresponde a: Task 2 del plan
 */
import { supabase, supabaseAdmin } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';

async function run() {
  console.log('\n🗄️  QA 02: Schema SQL y Row Level Security\n');
  const results: QAResult[] = [];

  // Las tablas existen (el admin puede leerlas)
  for (const table of ['profiles', 'businesses', 'reviews', 'audio_reports']) {
    results.push(await check(`Tabla '${table}' existe`, async () => {
      assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
      const { error } = await supabaseAdmin!.from(table as any).select('id').limit(1);
      assert(!error || error.code === 'PGRST116', `Tabla '${table}' no encontrada: ${error?.message}`);
    }));
  }

  // RLS: anon no puede leer profiles
  results.push(await check('RLS profiles: anon NO puede leer profiles ajenos', async () => {
    const { data, error } = await supabase.from('profiles').select('id').limit(5);
    // Sin auth, RLS debe retornar 0 filas (no error — Supabase filtra silenciosamente)
    assert((data?.length ?? 0) === 0, `RLS falla: anon puede ver ${data?.length} profiles`);
  }));

  // RLS: anon SÍ puede leer businesses (política pública)
  results.push(await check('RLS businesses: anon SÍ puede leer negocios', async () => {
    const { error } = await supabase.from('businesses').select('id').limit(1);
    assert(!error, `businesses debería ser pública: ${error?.message}`);
  }));

  // RLS: anon NO puede insertar reviews
  results.push(await check('RLS reviews: anon NO puede insertar reseñas', async () => {
    const { error } = await supabase.from('reviews').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      business_id: '00000000-0000-0000-0000-000000000000',
      text: 'Test review que no debería insertarse sin auth',
    });
    assert(!!error, 'RLS falla: anon pudo insertar una review sin autenticarse');
  }));

  // Constraint de longitud mínima en reviews
  results.push(await check('Constraint reviews: texto de <50 chars es rechazado', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
    const { error } = await supabaseAdmin!.from('reviews').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      business_id: '00000000-0000-0000-0000-000000000000',
      text: 'Corto',
    });
    assert(!!error && error.message.includes('review_min_length'),
      `Constraint no activo: se esperaba error review_min_length, got: ${error?.message ?? 'sin error'}`);
  }));

  // Buckets existen
  results.push(await check("Bucket 'avatars' existe (público)", async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
    const { data, error } = await supabaseAdmin!.storage.getBucket('avatars');
    assert(!error && !!data, `Bucket 'avatars' no encontrado: ${error?.message}`);
    assert(data?.public === true, "Bucket 'avatars' debería ser público");
  }));

  results.push(await check("Bucket 'reports' existe (privado)", async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
    const { data, error } = await supabaseAdmin!.storage.getBucket('reports');
    assert(!error && !!data, `Bucket 'reports' no encontrado: ${error?.message}`);
    assert(data?.public === false, "Bucket 'reports' debería ser privado");
  }));

  printSummary('QA 02 - Schema y RLS', results);
  return results.every(r => r.pass);
}

run().then(ok => process.exit(ok ? 0 : 1));

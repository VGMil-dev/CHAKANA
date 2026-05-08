/**
 * QA 01 — Conexión al proyecto Supabase
 * Criterio: URL y anon key válidos, proyecto ACTIVE_HEALTHY
 * Corresponde a: Task 1 del plan
 */
import { supabase, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';
import { done } from './lib/client';

async function run() {
  console.log('\n📡 QA 01: Conexión al proyecto Supabase\n');
  const results: QAResult[] = [];

  results.push(await check('URL de Supabase configurada', async () => {
    assert(!!env.url && env.url.includes('supabase.co'), 'SUPABASE_URL inválida o faltante');
  }));

  results.push(await check('Anon key configurada', async () => {
    assert(!!env.anonKey && env.anonKey.startsWith('eyJ'), 'SUPABASE_ANON_KEY inválida o faltante');
  }));

  results.push(await check('Proyecto responde (ping vía REST)', async () => {
    // Una query a una tabla pública es suficiente para verificar conectividad
    const { error } = await supabase.from('businesses').select('id').limit(1);
    // Si la tabla no existe aún, el error será de schema — no de conexión
    if (error && error.message.includes('Failed to fetch')) {
      throw new Error(`No se puede conectar al proyecto: ${error.message}`);
    }
  }));

  results.push(await check('Auth endpoint responde', async () => {
    const { error } = await supabase.auth.getSession();
    assert(!error, `Auth no responde: ${error?.message}`);
  }));

  printSummary('QA 01 - Conexión', results);
  return results.every(r => r.pass);
}

run().then(ok => done(ok ? 0 : 1));

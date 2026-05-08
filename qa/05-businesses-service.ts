/**
 * QA 05 — Businesses Service
 * Criterio: getAllBusinesses retorna datos públicos, seed de Raíz Café existe,
 *           getBusinessById retorna el negocio correcto
 * Corresponde a: Task 7 del plan
 */
import { supabase, supabaseAdmin, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';

async function run() {
  console.log('\n🏪 QA 05: Businesses Service\n');
  const results: QAResult[] = [];

  results.push(await check('getAllBusinesses: anon puede leer negocios (RLS pública)', async () => {
    const { data, error } = await supabase.from('businesses').select('*');
    assert(!error, `getAllBusinesses falló: ${error?.message}`);
    assert(Array.isArray(data), 'Respuesta no es un array');
  }));

  results.push(await check("Seed: 'Raíz Café' existe en la tabla businesses", async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, wallet_pubkey')
      .ilike('name', '%raíz%');
    assert(!error, `Error buscando Raíz Café: ${error?.message}`);
    assert((data?.length ?? 0) >= 1,
      "Raíz Café no encontrado — correr el seed SQL del Task 7 del plan primero");
  }));

  results.push(await check('getBusinessById: retorna negocio correcto por ID', async () => {
    assert(!!env.businessId, 'QA_BUSINESS_ID no configurado en .env — necesario para este test');
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', env.businessId)
      .single();
    assert(!error, `getBusinessById falló: ${error?.message}`);
    assert(data.id === env.businessId, 'ID del negocio no coincide');
    assert(!!data.name, 'Negocio no tiene nombre');
  }));

  results.push(await check('businesses: campo wallet_pubkey presente', async () => {
    if (!env.businessId) {
      // Si no hay ID configurado, verificar al menos la estructura
      const { data } = await supabase.from('businesses').select('wallet_pubkey').limit(1);
      assert(!!data, 'No se pudo leer la estructura de businesses');
      return;
    }
    const { data } = await supabase
      .from('businesses')
      .select('wallet_pubkey')
      .eq('id', env.businessId)
      .single();
    assert(data !== null, 'wallet_pubkey es null — necesario para recibir Aurios');
  }));

  printSummary('QA 05 - Businesses Service', results);
  return results.every(r => r.pass);
}

run().then(ok => process.exit(ok ? 0 : 1));

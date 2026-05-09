/**
 * QA 08 — Commerce + Checkout
 * Criterio: tablas nuevas disponibles y flujo de carrito/orden funciona al menos a nivel DB.
 */
import { supabase, supabaseAdmin, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';
import { done } from './lib/client';

async function run() {
  console.log('\n🛒 QA 08: Commerce + Checkout\n');
  const results: QAResult[] = [];

  for (const table of ['users', 'merchants', 'tambus', 'products', 'orders', 'payments']) {
    results.push(await check(`Tabla '${table}' existe`, async () => {
      assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
      const { error } = await supabaseAdmin!.from(table as any).select('*').limit(1);
      assert(!error || error.code === 'PGRST116', `Tabla '${table}' no encontrada: ${error?.message}`);
    }));
  }

  results.push(await check("Bucket 'product-images' existe", async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
    const { data, error } = await supabaseAdmin!.storage.getBucket('product-images');
    assert(!error && !!data, `Bucket 'product-images' no encontrado: ${error?.message}`);
  }));

  results.push(await check('Cliente autenticado puede leer sus órdenes', async () => {
    assert(!!env.testEmail && !!env.testPassword, 'QA_TEST_EMAIL y QA_TEST_PASSWORD son requeridos');
    const authClient = supabase;
    const { error: signInError } = await authClient.auth.signInWithPassword({
      email: env.testEmail,
      password: env.testPassword,
    });

    assert(!signInError, `No se pudo iniciar sesión de QA: ${signInError?.message}`);

    const { data, error } = await authClient
      .from('orders')
      .select('id, status, total_cents')
      .limit(3);

    assert(!error, `No se pudo consultar órdenes: ${error?.message}`);
    assert(Array.isArray(data), 'Respuesta orders no es array');

    await authClient.auth.signOut();
  }));

  if (env.commerceProductId) {
    results.push(await check('Producto de comercio de QA existe', async () => {
      const { data, error } = await supabase
        .from('products' as any)
        .select('id, title, price_cents, active')
        .eq('id', env.commerceProductId)
        .single();
      assert(!error && !!data, `Producto QA no encontrado: ${error?.message}`);
      assert(data.active === true, 'Producto QA debería estar activo');
    }));
  }

  printSummary('QA 08 - Commerce + Checkout', results);
  return results.every((r) => r.pass);
}

run().then((ok) => done(ok ? 0 : 1));

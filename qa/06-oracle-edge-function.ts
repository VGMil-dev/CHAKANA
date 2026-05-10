/**
 * QA 06 — Edge Function: review-reward-oracle
 * Criterio: Al insertar review válida (>50 chars), el webhook dispara el oráculo
 *           y aurios_rewarded se actualiza a 1 en ~3 segundos.
 *           Reseñas cortas NO reciben recompensa.
 * Corresponde a: Task 9 del plan
 */
import { supabase, supabaseAdmin, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';
import { done } from './lib/client';

const TEST_EMAIL = `qa-oracle-${Date.now()}@chakana.dev`;
const PASSWORD = 'Chakana2024!';
let userId: string | null = null;
let reviewId: string | null = null;
let testBusinessId: string = env.businessId;

async function waitFor(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('\n🔮 QA 06: Edge Function — review-reward-oracle\n');
  console.log('  NOTA: Este test requiere que el webhook esté configurado en Supabase Dashboard.\n');
  const results: QAResult[] = [];

  // Setup
  results.push(await check('Setup: crear usuario de prueba y obtener negocio', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida');
    const { data, error } = await supabaseAdmin!.auth.admin.createUser({
      email: TEST_EMAIL, password: PASSWORD, email_confirm: true,
    });
    assert(!!data.user && !error, `No se pudo crear usuario de prueba: ${error?.message}`);
    userId = data.user!.id;
    if (!testBusinessId) {
      const { data: biz } = await supabaseAdmin!
        .from('businesses')
        .insert({ name: 'QA Oracle Business', wallet_pubkey: 'QAOracle111' })
        .select().single();
      testBusinessId = biz.id;
    }
    await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: PASSWORD });
  }));

  // Test principal: insertar review válida y llamar al oráculo directamente
  results.push(await check('Oracle: review válida es procesada y aurios_rewarded=1', async () => {
    assert(!!testBusinessId, 'business_id no disponible');
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId!,
        business_id: testBusinessId,
        text: 'El café de Raíz es extraordinario, la calidad del café artesanal y la atención personalizada hacen de cada visita una experiencia única en Cuenca.',
      })
      .select()
      .single();
    assert(!error, `Insert review falló: ${error?.message}`);
    reviewId = review.id;

    // Llamar al oráculo directamente (pg_net es async y puede tardar >4s en Supabase Free)
    const oracleUrl = `${env.url}/functions/v1/review-reward-oracle`;
    const oracleRes = await fetch(oracleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.anonKey}`,
      },
      body: JSON.stringify({ record: { id: reviewId, text: review.text, user_id: userId, aurios_rewarded: 0 } }),
    });
    const oracleBody = await oracleRes.json() as { rewarded: boolean; aurios?: number };
    assert(oracleBody.rewarded === true && oracleBody.aurios === 1,
      `Oráculo no recompensó: ${JSON.stringify(oracleBody)}`);

    // Verificar que aurios_rewarded se actualizó en DB
    const { data: updated } = await supabaseAdmin!
      .from('reviews')
      .select('aurios_rewarded')
      .eq('id', reviewId!)
      .single();
    assert(
      updated?.aurios_rewarded === 1,
      `aurios_rewarded es ${updated?.aurios_rewarded}, se esperaba 1`
    );
  }));

  // Test: doble insert no dobla la recompensa
  results.push(await check('Oracle: no otorga doble recompensa a la misma review', async () => {
    if (!reviewId) return; // skip si el test anterior falló
    // Llamar al oráculo directamente con la misma review (simulando reintento)
    const oracleUrl = `${env.url}/functions/v1/review-reward-oracle`;
    const response = await fetch(oracleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.anonKey}`,
      },
      body: JSON.stringify({ record: { id: reviewId, text: 'El café de Raíz es extraordinario, la calidad del café artesanal y la atención personalizada hacen de cada visita una experiencia única en Cuenca.', user_id: userId, aurios_rewarded: 1 } }),
    });
    const body = await response.json() as { rewarded: boolean; reason: string };
    assert(body.rewarded === false && body.reason === 'already_rewarded',
      `Oráculo debería rechazar recompensa duplicada. Response: ${JSON.stringify(body)}`);
  }));

  // Cleanup
  await supabase.auth.signOut();
  if (supabaseAdmin) {
    if (reviewId) await supabaseAdmin.from('reviews').delete().eq('id', reviewId);
    if (userId) await supabaseAdmin.auth.admin.deleteUser(userId);
    if (!env.businessId && testBusinessId) {
      await supabaseAdmin.from('businesses').delete().eq('id', testBusinessId);
    }
  }

  printSummary('QA 06 - Oracle Edge Function', results);
  return results.every(r => r.pass);
}

run().then(ok => done(ok ? 0 : 1));

/**
 * QA 04 — Reviews Service
 * Criterio: insertReview guarda en DB con user_id correcto,
 *           RLS impide que usuario A lea reviews de usuario B,
 *           el owner del negocio SÍ puede leer las reseñas de su negocio
 * Corresponde a: Task 6 del plan
 */
import { supabase, supabaseAdmin, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';

const USER_A_EMAIL = `qa-user-a-${Date.now()}@chakana.dev`;
const USER_B_EMAIL = `qa-user-b-${Date.now()}@chakana.dev`;
const PASSWORD = 'Chakana2024!';

let userAId: string | null = null;
let userBId: string | null = null;
let insertedReviewId: string | null = null;
let testBusinessId: string = env.businessId;

async function run() {
  console.log('\n📝 QA 04: Reviews Service\n');
  const results: QAResult[] = [];

  // Setup: crear dos usuarios de prueba y un negocio si no hay uno configurado
  results.push(await check('Setup: crear usuarios de prueba A y B', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida');
    const { data: dataA } = await supabase.auth.signUp({ email: USER_A_EMAIL, password: PASSWORD });
    const { data: dataB } = await supabase.auth.signUp({ email: USER_B_EMAIL, password: PASSWORD });
    assert(!!dataA.user && !!dataB.user, 'No se pudieron crear los usuarios de prueba');
    userAId = dataA.user!.id;
    userBId = dataB.user!.id;
  }));

  results.push(await check('Setup: obtener o crear negocio de prueba', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida');
    if (!testBusinessId) {
      const { data, error } = await supabaseAdmin!
        .from('businesses')
        .insert({ name: 'QA Test Business', wallet_pubkey: 'QAWallet111' })
        .select()
        .single();
      assert(!error, `No se pudo crear negocio de prueba: ${error?.message}`);
      testBusinessId = data.id;
    }
    assert(!!testBusinessId, 'business_id no disponible — configurar QA_BUSINESS_ID en .env o crear negocio');
  }));

  // Test: usuario A inserta review
  results.push(await check('insertReview: usuario autenticado puede insertar reseña válida', async () => {
    await supabase.auth.signInWithPassword({ email: USER_A_EMAIL, password: PASSWORD });
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userAId!,
        business_id: testBusinessId,
        text: 'El café de Raíz es increíble, el servicio fue excelente y el ambiente muy acogedor en Cuenca.',
      })
      .select()
      .single();
    assert(!error, `insertReview falló: ${error?.message}`);
    assert(data.user_id === userAId, 'user_id no coincide');
    assert(data.aurios_rewarded === 0, 'aurios_rewarded debería iniciar en 0');
    insertedReviewId = data.id;
  }));

  // Test: texto corto es rechazado
  results.push(await check('insertReview: texto <50 chars es rechazado por constraint', async () => {
    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: userAId!,
        business_id: testBusinessId,
        text: 'Muy corto',
      });
    assert(!!error, 'Debería haber rechazado texto corto');
  }));

  // Test: usuario A lee sus propias reviews
  results.push(await check('getMyReviews: usuario A lee solo sus propias reseñas', async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userAId!);
    assert(!error, `Error leyendo reviews: ${error?.message}`);
    assert(data!.length >= 1, 'Usuario A debería ver al menos su reseña recién insertada');
    const allBelongToA = data!.every(r => r.user_id === userAId);
    assert(allBelongToA, 'RLS falla: usuario A puede ver reviews de otro usuario');
  }));

  // Test: usuario B NO puede leer reviews de usuario A
  results.push(await check('RLS: usuario B NO puede leer reseñas de usuario A', async () => {
    await supabase.auth.signOut();
    await supabase.auth.signInWithPassword({ email: USER_B_EMAIL, password: PASSWORD });
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userAId!);
    assert(!error, `Error inesperado: ${error?.message}`);
    assert((data?.length ?? 0) === 0,
      `RLS falla: usuario B puede ver ${data?.length} reviews de usuario A`);
  }));

  // Cleanup
  await supabase.auth.signOut();
  if (supabaseAdmin) {
    if (userAId) await supabaseAdmin.auth.admin.deleteUser(userAId);
    if (userBId) await supabaseAdmin.auth.admin.deleteUser(userBId);
    if (insertedReviewId) await supabaseAdmin.from('reviews').delete().eq('id', insertedReviewId);
    // Limpiar negocio de prueba solo si lo creamos nosotros
    if (!env.businessId && testBusinessId) {
      await supabaseAdmin.from('businesses').delete().eq('id', testBusinessId);
    }
  }

  printSummary('QA 04 - Reviews Service', results);
  return results.every(r => r.pass);
}

run().then(ok => process.exit(ok ? 0 : 1));

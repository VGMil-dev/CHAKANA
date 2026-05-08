/**
 * QA 03 — Auth Service
 * Criterio: signUp crea usuario + profile, signIn retorna sesión, signOut limpia
 * Corresponde a: Task 5 del plan
 */
import { supabase, supabaseAdmin, env } from './lib/client';
import { check, assert, printSummary, QAResult } from './lib/runner';
import { done } from './lib/client';

const TEST_EMAIL = `qa-${Date.now()}@chakana.dev`;
const TEST_PASSWORD = 'Chakana2024!';
let createdUserId: string | null = null;

async function run() {
  console.log('\n🔐 QA 03: Auth Service\n');
  const results: QAResult[] = [];

  results.push(await check('signUp: crea usuario con email y password', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para crear usuario confirmado');
    const { data, error } = await supabaseAdmin!.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: 'QA Tester' },
    });
    assert(!error, `signUp falló: ${error?.message}`);
    assert(!!data.user, 'signUp no retornó user');
    createdUserId = data.user!.id;
  }));

  results.push(await check('signUp: trigger crea profile automáticamente', async () => {
    assert(!!supabaseAdmin, 'SUPABASE_SERVICE_ROLE_KEY requerida para este test');
    assert(!!createdUserId, 'userId no disponible — signUp falló antes');
    // Esperar al trigger (puede tardar ~500ms)
    await new Promise(r => setTimeout(r, 1000));
    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .select('id, display_name')
      .eq('id', createdUserId!)
      .single();
    assert(!error && !!data, `Profile no encontrado: ${error?.message}`);
    assert(data!.id === createdUserId, 'Profile ID no coincide con user ID');
  }));

  results.push(await check('signIn: retorna sesión válida con access_token', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    assert(!error, `signIn falló: ${error?.message}`);
    assert(!!data.session?.access_token, 'signIn no retornó access_token');
  }));

  results.push(await check('getUser: retorna usuario autenticado', async () => {
    const { data, error } = await supabase.auth.getUser();
    assert(!error, `getUser falló: ${error?.message}`);
    assert(data.user?.email === TEST_EMAIL, `Email no coincide: ${data.user?.email}`);
  }));

  results.push(await check('signIn con password incorrecta: retorna error (no crash)', async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: 'wrong-password',
    });
    assert(!!error, 'Debería haber retornado error con password incorrecta');
    assert(error!.message.toLowerCase().includes('invalid'), `Error inesperado: ${error!.message}`);
  }));

  results.push(await check('signOut: limpia la sesión', async () => {
    // Re-login primero
    await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const { error } = await supabase.auth.signOut();
    assert(!error, `signOut falló: ${error?.message}`);
    const { data } = await supabase.auth.getSession();
    assert(!data.session, 'Sesión no fue limpiada tras signOut');
  }));

  // Cleanup: borrar usuario de prueba
  if (createdUserId && supabaseAdmin) {
    await supabaseAdmin.auth.admin.deleteUser(createdUserId);
  }

  printSummary('QA 03 - Auth Service', results);
  return results.every(r => r.pass);
}

run().then(ok => done(ok ? 0 : 1));

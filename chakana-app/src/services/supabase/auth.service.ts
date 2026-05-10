import { supabase } from './client';
import type { User } from '@supabase/supabase-js';

export type AuthError = { message: string };
export type AuthRole = 'embajador' | 'tambu';

function normalizeRole(role: string | null | undefined): AuthRole {
  if (role === 'tambu' || role === 'owner') return 'tambu';
  return 'embajador';
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: AuthRole,
  walletPubKey: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName, role, wallet_pubkey: walletPubKey } },
  });
  if (error) throw new Error(error.message);
  return data.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}

export async function getUserRole(userId: string): Promise<'embajador' | 'tambu'> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error || !data) return 'embajador';
  return normalizeRole(data.role);
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return data.subscription.unsubscribe;
}

import { supabase } from './supabase';

export type AppRole = 'client' | 'merchant' | 'admin';

export type AppUser = {
  id: string;
  email: string;
  fullName?: string;
  role: AppRole;
};

async function getUserRole(userId: string): Promise<AppRole> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data?.role) {
    return 'client';
  }

  return data.role as AppRole;
}

export async function signUp(email: string, password: string, fullName: string, role: AppRole) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) throw new Error(error.message);

  if (!data.user) {
    throw new Error('No se pudo crear el usuario.');
  }

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    fullName,
    role,
  } satisfies AppUser;
}

export async function signIn(email: string, password: string): Promise<AppUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error(error?.message ?? 'No se pudo iniciar sesión');

  const role = await getUserRole(data.user.id);

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    fullName: (data.user.user_metadata?.full_name as string | undefined) ?? '',
    role,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const role = await getUserRole(data.user.id);

  return {
    id: data.user.id,
    email: data.user.email ?? '',
    fullName: (data.user.user_metadata?.full_name as string | undefined) ?? '',
    role,
  };
}

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session?.access_token ?? null;
}

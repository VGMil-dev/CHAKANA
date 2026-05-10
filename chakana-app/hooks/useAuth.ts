import { useAuth as useRealAuth } from '../src/hooks/useAuth';

type AuthResult = {
  error: string | null;
};

export function useAuth() {
  const auth = useRealAuth();

  async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
      await auth.login(email, password);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Error al iniciar sesión' };
    }
  }

  async function signUp(
    name: string,
    email: string,
    password: string,
    _role: 'embajador' | 'tambu',
    walletPubKey: string,
  ): Promise<AuthResult> {
    try {
      await auth.register(email, password, name, walletPubKey);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Error al registrarse' };
    }
  }

  async function signOut(): Promise<void> {
    await auth.logout();
  }

  return {
    ...auth,
    signIn,
    signUp,
    signOut,
  };
}

import { useAuth as useRealAuth } from '../../src/hooks/useAuth';

type AuthResult = {
  error: string | null;
};

export function useAuth() {
  const auth = useRealAuth();

  async function signIn(email: string, password: string): Promise<AuthResult> {
    await auth.login(email, password);
    return { error: auth.authError };
  }

  async function signUp(
    name: string,
    email: string,
    password: string,
    _role: 'embajador' | 'tambu',
    walletPubKey: string,
  ): Promise<AuthResult> {
    await auth.register(email, password, name, walletPubKey);
    return { error: auth.authError };
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

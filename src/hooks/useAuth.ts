import { useCallback } from 'react';
import { getSession, signIn, signOut, signUp } from '../services/supabase';
import { useAppStore } from '../store';

type UseAuthResult = {
  authUserId: string | null;
  authEmail: string | null;
  isConnected: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo completar la autenticacion';
}

export function useAuth(): UseAuthResult {
  const authUserId = useAppStore((state) => state.authUserId);
  const authEmail = useAppStore((state) => state.authEmail);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);
  const authError = useAppStore((state) => state.authError);
  const setUser = useAppStore((state) => state.setUser);

  const login = async (email: string, password: string): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      const user = await signIn(email, password);
      setUser({
        authUserId: user?.id ?? null,
        authEmail: user?.email ?? email,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setUser({
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      const user = await signUp(email, password, displayName);
      setUser({
        authUserId: user?.id ?? null,
        authEmail: user?.email ?? email,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setUser({
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  };

  const logout = async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      await signOut();
      setUser({
        authUserId: null,
        authEmail: null,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setUser({
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  };

  const initAuth = useCallback(async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      const session = await getSession();
      const user = session?.user ?? null;
      setUser({
        authUserId: user?.id ?? null,
        authEmail: user?.email ?? null,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setUser({
        authUserId: null,
        authEmail: null,
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  }, [setUser]);

  return {
    authUserId,
    authEmail,
    isConnected: !!authUserId,
    isAuthLoading,
    authError,
    login,
    register,
    logout,
    initAuth,
  };
}

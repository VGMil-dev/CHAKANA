import { useCallback, useRef } from 'react';
import { getSession, getUserRole, onAuthStateChange, signIn, signOut, signUp } from '../services/supabase';
import { useAppStore } from '../store';
import type { UserRole } from '../store/slices/userSlice';

type UseAuthResult = {
  authUserId: string | null;
  authEmail: string | null;
  displayName: string | null;
  role: UserRole;
  isConnected: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    walletPubKey: string,
  ) => Promise<void>;
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
  const displayName = useAppStore((state) => state.displayName);
  const role = useAppStore((state) => state.role);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);
  const authError = useAppStore((state) => state.authError);
  const setUser = useAppStore((state) => state.setUser);

  const login = async (email: string, password: string): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      const user = await signIn(email, password);
      const userRole = user ? await getUserRole(user.id) : 'embajador';
      setUser({
        authUserId: user?.id ?? null,
        authEmail: user?.email ?? email,
        displayName: (user?.user_metadata?.['display_name'] as string | undefined) ?? null,
        role: userRole,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setUser({
        isAuthLoading: false,
        authError: message,
      });
      throw new Error(message);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    walletPubKey: string,
  ): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      if (!walletPubKey) {
        throw new Error('Conecta tu wallet Solana antes de crear tu cuenta.');
      }
      const user = await signUp(email, password, displayName, role, walletPubKey);
      setUser({
        authUserId: user?.id ?? null,
        authEmail: user?.email ?? email,
        displayName,
        role,
        walletPubKey,
        isConnected: true,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setUser({
        isAuthLoading: false,
        authError: message,
      });
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      await signOut();
      setUser({
        authUserId: null,
        authEmail: null,
        role: 'embajador',
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setUser({
        isAuthLoading: false,
        authError: message,
      });
      throw new Error(message);
    }
  };

  const subRef = useRef<(() => void) | null>(null);

  const syncUserToStore = useCallback(async (user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) => {
    if (user) {
      const userRole = await getUserRole(user.id);
      setUser({
        authUserId: user.id,
        authEmail: user.email ?? null,
        displayName: (user.user_metadata?.['display_name'] as string | undefined) ?? null,
        role: userRole,
        isAuthLoading: false,
        authError: null,
      });
    } else {
      setUser({
        authUserId: null,
        authEmail: null,
        role: 'embajador',
        isAuthLoading: false,
        authError: null,
      });
    }
  }, [setUser]);

  const initAuth = useCallback(async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });

    if (subRef.current) {
      subRef.current();
      subRef.current = null;
    }

    subRef.current = onAuthStateChange(async (user) => {
      await syncUserToStore(user);
    });

    try {
      const session = await getSession();
      await syncUserToStore(session?.user ?? null);
    } catch (error) {
      setUser({
        authUserId: null,
        authEmail: null,
        role: 'embajador',
        isAuthLoading: false,
        authError: error instanceof Error ? error.message : 'Error restoring session',
      });
    }
  }, [setUser, syncUserToStore]);

  return {
    authUserId,
    authEmail,
    displayName,
    role,
    isConnected: !!authUserId,
    isAuthLoading,
    authError,
    login,
    register,
    logout,
    initAuth,
  };
}

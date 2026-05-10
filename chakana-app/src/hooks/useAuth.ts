import { useCallback, useRef } from 'react';
import { getSession, getUserRole, onAuthStateChange, signIn, signOut, signUp } from '../services/supabase';
import { useAppStore } from '../store';
import type { UserRole } from '../store/slices/userSlice';
import {
  DEMO_AURIO_BALANCE,
  DEMO_USER_EMAIL,
  DEMO_USER_ID,
  disableDemoModeSession,
  enableDemoModeSession,
  getDemoWalletAddress,
  isDemoModeSessionEnabled,
} from '../utils/demoMode';

type UseAuthResult = {
  authUserId: string | null;
  authEmail: string | null;
  role: UserRole;
  isConnected: boolean;
  isDemoMode: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
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
  const role = useAppStore((state) => state.role);
  const isDemoMode = useAppStore((state) => state.isDemoMode);
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
        role: userRole,
        isDemoMode: false,
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
    displayName: string,
    walletPubKey: string,
  ): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      if (!walletPubKey) {
        throw new Error('Conecta tu wallet Solana antes de crear tu cuenta.');
      }
      const user = await signUp(email, password, displayName, walletPubKey);
      setUser({
        authUserId: user?.id ?? null,
        authEmail: user?.email ?? email,
        walletPubKey,
        isConnected: true,
        isDemoMode: false,
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
      await disableDemoModeSession();
      setUser({
        authUserId: null,
        authEmail: null,
        role: 'embajador',
        walletPubKey: null,
        aurioBalance: 0,
        isConnected: false,
        isDemoMode: false,
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

  const subRef = useRef<(() => void) | null>(null);

  const loginDemo = async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    await enableDemoModeSession();
    setUser({
      authUserId: DEMO_USER_ID,
      authEmail: DEMO_USER_EMAIL,
      role: 'embajador',
      walletPubKey: getDemoWalletAddress(),
      aurioBalance: DEMO_AURIO_BALANCE,
      isConnected: true,
      isDemoMode: true,
      isAuthLoading: false,
      authError: null,
    });
  };

  const syncUserToStore = useCallback(async (user: { id: string; email?: string } | null) => {
    if (user) {
      const userRole = await getUserRole(user.id);
      setUser({
        authUserId: user.id,
        authEmail: user.email ?? null,
        role: userRole,
        isDemoMode: false,
        isAuthLoading: false,
        authError: null,
      });
    } else {
      setUser({
        authUserId: null,
        authEmail: null,
        role: 'embajador',
        walletPubKey: null,
        aurioBalance: 0,
        isConnected: false,
        isDemoMode: false,
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

    if (await isDemoModeSessionEnabled()) {
      setUser({
        authUserId: DEMO_USER_ID,
        authEmail: DEMO_USER_EMAIL,
        role: 'embajador',
        walletPubKey: getDemoWalletAddress(),
        aurioBalance: DEMO_AURIO_BALANCE,
        isConnected: true,
        isDemoMode: true,
        isAuthLoading: false,
        authError: null,
      });
      return;
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
        walletPubKey: null,
        aurioBalance: 0,
        isConnected: false,
        isDemoMode: false,
        isAuthLoading: false,
        authError: error instanceof Error ? error.message : 'Error restoring session',
      });
    }
  }, [setUser, syncUserToStore]);

  return {
    authUserId,
    authEmail,
    role,
    isConnected: !!authUserId,
    isDemoMode,
    isAuthLoading,
    authError,
    login,
    loginDemo,
    register,
    logout,
    initAuth,
  };
}

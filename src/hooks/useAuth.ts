import { getUser, signIn, signOut, signUp } from '../services/supabase';
import { useAppStore } from '../store';

type UseAuthResult = {
  isConnected: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la autenticacion';
}

export function useAuth(): UseAuthResult {
  const isConnected = useAppStore((state) => state.isConnected);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);
  const authError = useAppStore((state) => state.authError);
  const setUser = useAppStore((state) => state.setUser);
  const setIsConnected = useAppStore((state) => state.setIsConnected);
  const logoutStore = useAppStore((state) => state.logout);

  const login = async (email: string, password: string): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      const user = await signIn(email, password);
      setUser({
        isConnected: !!user,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setUser({
        isConnected: false,
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
        isConnected: !!user,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setUser({
        isConnected: false,
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  };

  const logout = async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      await signOut();
      logoutStore();
    } catch (error) {
      setUser({
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  };

  const initAuth = async (): Promise<void> => {
    setUser({ isAuthLoading: true, authError: null });
    try {
      const user = await getUser();
      setUser({
        isConnected: !!user,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error) {
      setIsConnected(false);
      setUser({
        isAuthLoading: false,
        authError: getErrorMessage(error),
      });
    }
  };

  return {
    isConnected,
    isAuthLoading,
    authError,
    login,
    register,
    logout,
    initAuth,
  };
}

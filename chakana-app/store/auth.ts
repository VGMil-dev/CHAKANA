import { create } from 'zustand';
import { AppRole, AppUser, getCurrentUser, signIn, signOut, signUp } from '../services/auth';

type AuthState = {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: AppRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'No se pudo cargar la sesión',
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await signIn(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'No se pudo iniciar sesión',
      });
    }
  },

  register: async (email, password, fullName, role) => {
    set({ loading: true, error: null });
    try {
      const user = await signUp(email, password, fullName, role);
      set({ user, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'No se pudo crear la cuenta',
      });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut();
      set({ user: null, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'No se pudo cerrar sesión',
      });
    }
  },

  clearError: () => set({ error: null }),
}));

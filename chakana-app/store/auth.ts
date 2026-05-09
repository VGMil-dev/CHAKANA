import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Platform } from 'react-native'

interface AuthUser {
  name: string
  email?: string
  walletAddress?: string
  role?: 'embajador' | 'tambu'
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

// On web: persist to localStorage so auth survives page refresh (and Playwright navigations).
// On native: no-op storage — Zustand behaves as before (in-memory only).
const noop = { getItem: () => null as any, setItem: () => {}, removeItem: () => {} }
const storage = Platform.OS === 'web'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => noop)

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'chakana-auth', storage },
  ),
)

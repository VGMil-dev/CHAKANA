import type { StateCreator } from 'zustand';
import type { AppStore } from '../index';

export type UserRole = 'embajador' | 'tambu';

export type UserSlice = {
  authUserId: string | null;
  authEmail: string | null;
  displayName: string | null;
  role: UserRole;
  walletPubKey: string | null;
  aurioBalance: number;
  isConnected: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  setUser: (user: Partial<UserState>) => void;
  setRole: (role: UserRole) => void;
  setWalletPubKey: (walletPubKey: string | null) => void;
  setAurioBalance: (aurioBalance: number) => void;
  setIsConnected: (isConnected: boolean) => void;
  logout: () => void;
  clearAuthError: () => void;
};

type UserState = Pick<
  UserSlice,
  | 'authUserId'
  | 'authEmail'
  | 'displayName'
  | 'role'
  | 'walletPubKey'
  | 'aurioBalance'
  | 'isConnected'
  | 'isAuthLoading'
  | 'authError'
>;

const initialUserState: UserState = {
  authUserId: null,
  authEmail: null,
  displayName: null,
  role: 'embajador',
  walletPubKey: null,
  aurioBalance: 0,
  isConnected: false,
  isAuthLoading: false,
  authError: null,
};

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (set) => ({
  ...initialUserState,
  setUser: (user) => set(user),
  setRole: (role) => set({ role }),
  setWalletPubKey: (walletPubKey) => set({ walletPubKey }),
  setAurioBalance: (aurioBalance) => set({ aurioBalance }),
  setIsConnected: (isConnected) => set({ isConnected }),
  logout: () => set(initialUserState),
  clearAuthError: () => set({ authError: null }),
});

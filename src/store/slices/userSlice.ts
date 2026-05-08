import type { StateCreator } from 'zustand';
import type { AppStore } from '../index';

export type UserSlice = {
  walletPubKey: string | null;
  aurioBalance: number;
  isConnected: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  setUser: (user: Partial<UserState>) => void;
  setWalletPubKey: (walletPubKey: string | null) => void;
  setAurioBalance: (aurioBalance: number) => void;
  setIsConnected: (isConnected: boolean) => void;
  logout: () => void;
  clearAuthError: () => void;
};

type UserState = Pick<
  UserSlice,
  'walletPubKey' | 'aurioBalance' | 'isConnected' | 'isAuthLoading' | 'authError'
>;

const initialUserState: UserState = {
  walletPubKey: null,
  aurioBalance: 0,
  isConnected: false,
  isAuthLoading: false,
  authError: null,
};

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (set) => ({
  ...initialUserState,
  setUser: (user) => set(user),
  setWalletPubKey: (walletPubKey) => set({ walletPubKey }),
  setAurioBalance: (aurioBalance) => set({ aurioBalance }),
  setIsConnected: (isConnected) => set({ isConnected }),
  logout: () => set(initialUserState),
  clearAuthError: () => set({ authError: null }),
});

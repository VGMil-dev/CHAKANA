import type { StateCreator } from 'zustand';
import type { AppStore } from '../index';
import type { Tables } from '../../types/database';

export type Business = Tables<'businesses'>;

export type BusinessSlice = {
  tambuActivo: Business | null;
  listaTambus: Business[];
  isLoadingBusinesses: boolean;
  businessError: string | null;
  setTambuActivo: (tambuActivo: Business | null) => void;
  setListaTambus: (listaTambus: Business[]) => void;
  setIsLoadingBusinesses: (isLoadingBusinesses: boolean) => void;
  clearBusinessError: () => void;
};

export const createBusinessSlice: StateCreator<AppStore, [], [], BusinessSlice> = (set) => ({
  tambuActivo: null,
  listaTambus: [],
  isLoadingBusinesses: false,
  businessError: null,
  setTambuActivo: (tambuActivo) => set({ tambuActivo }),
  setListaTambus: (listaTambus) => set({ listaTambus }),
  setIsLoadingBusinesses: (isLoadingBusinesses) => set({ isLoadingBusinesses }),
  clearBusinessError: () => set({ businessError: null }),
});

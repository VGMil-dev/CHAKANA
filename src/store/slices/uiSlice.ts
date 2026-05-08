import type { StateCreator } from 'zustand';
import type { AppStore } from '../index';

export type ActiveModal = 'propina' | 'confirmCheckout' | 'reviewSuccess' | 'error' | null;

export type UiSlice = {
  isLoading: boolean;
  activeModal: ActiveModal;
  errorMessage: string | null;
  checkoutTotal: number;
  auriosToSpend: number;
  audioReportUrl: string | null;
  isLoadingReport: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setActiveModal: (activeModal: ActiveModal) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  setCheckoutTotal: (checkoutTotal: number) => void;
  setAuriosToSpend: (auriosToSpend: number) => void;
  setAudioReportUrl: (audioReportUrl: string | null) => void;
  setIsLoadingReport: (isLoadingReport: boolean) => void;
  closeModal: () => void;
};

export const createUiSlice: StateCreator<AppStore, [], [], UiSlice> = (set) => ({
  isLoading: false,
  activeModal: null,
  errorMessage: null,
  checkoutTotal: 0,
  auriosToSpend: 0,
  audioReportUrl: null,
  isLoadingReport: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setCheckoutTotal: (checkoutTotal) => set({ checkoutTotal }),
  setAuriosToSpend: (auriosToSpend) => set({ auriosToSpend }),
  setAudioReportUrl: (audioReportUrl) => set({ audioReportUrl }),
  setIsLoadingReport: (isLoadingReport) => set({ isLoadingReport }),
  closeModal: () => set({ activeModal: null, errorMessage: null }),
});

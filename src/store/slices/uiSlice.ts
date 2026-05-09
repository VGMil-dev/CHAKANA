import type { StateCreator } from 'zustand';
import type { AppStore } from '../index';

export type ActiveModal = 'propina' | 'confirmCheckout' | 'reviewSuccess' | 'error' | null;

export type UiSlice = {
  isLoading: boolean;
  activeModal: ActiveModal;
  errorMessage: string | null;
  checkoutTotal: number;
  auriosToSpend: number;
  isProcessingCheckout: boolean;
  checkoutError: string | null;
  checkoutSignature: string | null;
  audioReportUrl: string | null;
  isLoadingReport: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setActiveModal: (activeModal: ActiveModal) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  setCheckoutTotal: (checkoutTotal: number) => void;
  setAuriosToSpend: (auriosToSpend: number) => void;
  setIsProcessingCheckout: (isProcessingCheckout: boolean) => void;
  setCheckoutError: (checkoutError: string | null) => void;
  setCheckoutSignature: (checkoutSignature: string | null) => void;
  resetCheckout: () => void;
  setAudioReportUrl: (audioReportUrl: string | null) => void;
  setIsLoadingReport: (isLoadingReport: boolean) => void;
  closeModal: () => void;
};

type CheckoutState = Pick<
  UiSlice,
  | 'checkoutTotal'
  | 'auriosToSpend'
  | 'isProcessingCheckout'
  | 'checkoutError'
  | 'checkoutSignature'
>;

const initialCheckoutState: CheckoutState = {
  checkoutTotal: 0,
  auriosToSpend: 0,
  isProcessingCheckout: false,
  checkoutError: null,
  checkoutSignature: null,
};

export const createUiSlice: StateCreator<AppStore, [], [], UiSlice> = (set) => ({
  isLoading: false,
  activeModal: null,
  errorMessage: null,
  ...initialCheckoutState,
  audioReportUrl: null,
  isLoadingReport: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setCheckoutTotal: (checkoutTotal) => set({ checkoutTotal }),
  setAuriosToSpend: (auriosToSpend) => set({ auriosToSpend }),
  setIsProcessingCheckout: (isProcessingCheckout) => set({ isProcessingCheckout }),
  setCheckoutError: (checkoutError) => set({ checkoutError }),
  setCheckoutSignature: (checkoutSignature) => set({ checkoutSignature }),
  resetCheckout: () => set(initialCheckoutState),
  setAudioReportUrl: (audioReportUrl) => set({ audioReportUrl }),
  setIsLoadingReport: (isLoadingReport) => set({ isLoadingReport }),
  closeModal: () => set({ activeModal: null, errorMessage: null, checkoutError: null }),
});

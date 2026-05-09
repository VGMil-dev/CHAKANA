import { useAppStore } from './index';

export const useAuthUserId = () => useAppStore((state) => state.authUserId);
export const useAuthEmail = () => useAppStore((state) => state.authEmail);
export const useWalletPubKey = () => useAppStore((state) => state.walletPubKey);
export const useAurioBalance = () => useAppStore((state) => state.aurioBalance);
export const useIsConnected = () => useAppStore((state) => state.isConnected);
export const useIsAuthLoading = () => useAppStore((state) => state.isAuthLoading);
export const useAuthError = () => useAppStore((state) => state.authError);

export const useTambuActivo = () => useAppStore((state) => state.tambuActivo);
export const useListaTambus = () => useAppStore((state) => state.listaTambus);
export const useIsLoadingBusinesses = () => useAppStore((state) => state.isLoadingBusinesses);

export const useCurrentReviewText = () => useAppStore((state) => state.currentReviewText);
export const useIsSubmittingReview = () => useAppStore((state) => state.isSubmittingReview);
export const useReviewSuccess = () => useAppStore((state) => state.reviewSuccess);
export const useReviewError = () => useAppStore((state) => state.reviewError);

export const useActiveModal = () => useAppStore((state) => state.activeModal);
export const useCheckoutTotal = () => useAppStore((state) => state.checkoutTotal);
export const useAuriosToSpend = () => useAppStore((state) => state.auriosToSpend);
export const useCheckoutError = () => useAppStore((state) => state.checkoutError);
export const useCheckoutSignature = () => useAppStore((state) => state.checkoutSignature);
export const useAudioReportUrl = () => useAppStore((state) => state.audioReportUrl);
export const useIsLoadingReport = () => useAppStore((state) => state.isLoadingReport);
export const useErrorMessage = () => useAppStore((state) => state.errorMessage);

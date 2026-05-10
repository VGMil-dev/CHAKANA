import { getAurioBalance } from 'aurio-sdk';
import { submitReviewReward } from '../services/supabase';
import { useAppStore } from '../store';
import { countWords, getReviewWordsRemaining, isReviewTextValid } from '../utils/reviewValidation';

const ORACLE_WAIT_MS = 3000;

type SubmitReviewParams = {
  businessId: string;
  solanaMemoSignature?: string;
};

type UseReviewSubmitResult = {
  currentReviewText: string;
  isSubmittingReview: boolean;
  reviewError: string | null;
  reviewSuccess: boolean;
  isTextValid: boolean;
  wordsCount: number;
  wordsRemaining: number;
  charsRemaining: number;
  onTextChange: (text: string) => void;
  submitReview: (params: SubmitReviewParams) => Promise<void>;
  resetForm: () => void;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo enviar la rese\u00f1a.';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useReviewSubmit(): UseReviewSubmitResult {
  const currentReviewText = useAppStore((state) => state.currentReviewText);
  const isSubmittingReview = useAppStore((state) => state.isSubmittingReview);
  const reviewError = useAppStore((state) => state.reviewError);
  const reviewSuccess = useAppStore((state) => state.reviewSuccess);
  const walletPubKey = useAppStore((state) => state.walletPubKey);
  const updateCurrentReviewText = useAppStore((state) => state.updateCurrentReviewText);
  const setIsSubmittingReview = useAppStore((state) => state.setIsSubmittingReview);
  const setReviewError = useAppStore((state) => state.setReviewError);
  const setReviewSuccess = useAppStore((state) => state.setReviewSuccess);
  const resetReviewForm = useAppStore((state) => state.resetReviewForm);
  const setAurioBalance = useAppStore((state) => state.setAurioBalance);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  const reviewText = currentReviewText.trim();
  const wordsCount = countWords(currentReviewText);
  const wordsRemaining = getReviewWordsRemaining(currentReviewText);
  const isTextValid = isReviewTextValid(currentReviewText);
  const charsRemaining = wordsRemaining;

  const submitReview = async (params: SubmitReviewParams): Promise<void> => {
    const businessId = params.businessId.trim();
    setReviewSuccess(false);

    if (!isReviewTextValid(reviewText)) {
      setReviewError('Tu comentario debe tener al menos 50 palabras.');
      return;
    }

    if (!walletPubKey) {
      setReviewError('Conecta tu wallet para recibir Aurios.');
      return;
    }

    if (!businessId) {
      setReviewError('No se encontr\u00f3 la cafeter\u00eda para guardar la rese\u00f1a.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await submitReviewReward({
        userWallet: walletPubKey,
        reviewText,
        businessId,
      });
      await sleep(ORACLE_WAIT_MS);
      const nextBalance = await getAurioBalance(walletPubKey);
      setAurioBalance(nextBalance);
      setReviewSuccess(true);
      setActiveModal('reviewSuccess');
    } catch (error) {
      setReviewSuccess(false);
      setReviewError(getErrorMessage(error));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return {
    currentReviewText,
    isSubmittingReview,
    reviewError,
    reviewSuccess,
    isTextValid,
    wordsCount,
    wordsRemaining,
    charsRemaining,
    onTextChange: updateCurrentReviewText,
    submitReview,
    resetForm: resetReviewForm,
  };
}

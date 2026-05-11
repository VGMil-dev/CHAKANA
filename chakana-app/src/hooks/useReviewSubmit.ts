import { getAurioBalance } from 'aurio-sdk';
import { submitReviewReward } from '../services/supabase';
import { useAppStore } from '../store';
import { countWords, getReviewWordsRemaining, isReviewTextValid } from '../utils/reviewValidation';

const ORACLE_WAIT_MS = 3000;

type SubmitReviewParams = {
  businessId: string;
};

type UseReviewSubmitResult = {
  currentReviewText: string;
  isSubmittingReview: boolean;
  reviewError: string | null;
  reviewSuccess: boolean;
  stars: number;
  tags: string[];
  isTextValid: boolean;
  wordsCount: number;
  wordsRemaining: number;
  charsRemaining: number;
  onTextChange: (text: string) => void;
  setStars: (stars: number) => void;
  toggleTag: (tag: string) => void;
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
  const stars = useAppStore((state) => state.stars);
  const tags = useAppStore((state) => state.tags);
  const walletPubKey = useAppStore((state) => state.walletPubKey);
  const updateCurrentReviewText = useAppStore((state) => state.updateCurrentReviewText);
  const setIsSubmittingReview = useAppStore((state) => state.setIsSubmittingReview);
  const setReviewError = useAppStore((state) => state.setReviewError);
  const setReviewSuccess = useAppStore((state) => state.setReviewSuccess);
  const setStars = useAppStore((state) => state.setStars);
  const toggleTag = useAppStore((state) => state.toggleTag);
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
      setReviewError('Tu comentario debe tener al menos 10 palabras.');
      return;
    }

    if (!walletPubKey) {
      setReviewError('Conecta tu wallet para recibir Aurios.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      // Automatic flow: Supabase validates and calls Node.js server to mint
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
      console.error('Submit review error:', error);
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
    stars,
    tags,
    isTextValid,
    wordsCount,
    wordsRemaining,
    charsRemaining,
    onTextChange: updateCurrentReviewText,
    setStars,
    toggleTag,
    submitReview,
    resetForm: resetReviewForm,
  };
}

import { getAurioBalance } from 'aurio-sdk';
import { insertReview } from '../services/supabase';
import { useAppStore } from '../store';

const MIN_REVIEW_LENGTH = 50;
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
  charsRemaining: number;
  onTextChange: (text: string) => void;
  submitReview: (params: SubmitReviewParams) => Promise<void>;
  resetForm: () => void;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo enviar la reseña.';
}

function wait(ms: number): Promise<void> {
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
  const setReviewSuccess = useAppStore((state) => state.setReviewSuccess);
  const resetReviewForm = useAppStore((state) => state.resetReviewForm);
  const setAurioBalance = useAppStore((state) => state.setAurioBalance);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  const isTextValid = currentReviewText.trim().length >= MIN_REVIEW_LENGTH;
  const charsRemaining = MIN_REVIEW_LENGTH - currentReviewText.length;

  const submitReview = async (params: SubmitReviewParams): Promise<void> => {
    if (!isTextValid) {
      useAppStore.setState({
        reviewError: `La reseña debe tener al menos ${MIN_REVIEW_LENGTH} caracteres.`,
      });
      return;
    }

    if (!walletPubKey) {
      useAppStore.setState({
        reviewError: 'Conecta tu wallet para actualizar tus Aurios.',
      });
      return;
    }

    setIsSubmittingReview(true);
    setReviewSuccess(false);
    useAppStore.setState({ reviewError: null });

    try {
      await insertReview({
        business_id: params.businessId,
        text: currentReviewText.trim(),
        solana_memo_signature: params.solanaMemoSignature,
      });
      await wait(ORACLE_WAIT_MS);
      const nextBalance = await getAurioBalance(walletPubKey);
      setAurioBalance(nextBalance);
      setReviewSuccess(true);
      setActiveModal('reviewSuccess');
    } catch (error) {
      useAppStore.setState({ reviewError: getErrorMessage(error) });
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
    charsRemaining,
    onTextChange: updateCurrentReviewText,
    submitReview,
    resetForm: resetReviewForm,
  };
}

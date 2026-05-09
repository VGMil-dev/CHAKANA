import type { StateCreator } from 'zustand';
import type { AppStore } from '../index';
import type { Tables } from '../../types/database';

export type Review = Tables<'reviews'>;

export type ReviewSlice = {
  reviews: Review[];
  currentReviewText: string;
  isSubmittingReview: boolean;
  reviewError: string | null;
  reviewSuccess: boolean;
  setReviews: (reviews: Review[]) => void;
  updateCurrentReviewText: (currentReviewText: string) => void;
  setIsSubmittingReview: (isSubmittingReview: boolean) => void;
  setReviewError: (reviewError: string | null) => void;
  setReviewSuccess: (reviewSuccess: boolean) => void;
  resetReviewForm: () => void;
  clearReviewError: () => void;
};

type ReviewFormState = Pick<
  ReviewSlice,
  'currentReviewText' | 'isSubmittingReview' | 'reviewError' | 'reviewSuccess'
>;

const initialReviewFormState: ReviewFormState = {
  currentReviewText: '',
  isSubmittingReview: false,
  reviewError: null,
  reviewSuccess: false,
};

export const createReviewSlice: StateCreator<AppStore, [], [], ReviewSlice> = (set) => ({
  reviews: [],
  ...initialReviewFormState,
  setReviews: (reviews) => set({ reviews }),
  updateCurrentReviewText: (currentReviewText) => set({ currentReviewText }),
  setIsSubmittingReview: (isSubmittingReview) => set({ isSubmittingReview }),
  setReviewError: (reviewError) => set({ reviewError }),
  setReviewSuccess: (reviewSuccess) => set({ reviewSuccess }),
  resetReviewForm: () => set(initialReviewFormState),
  clearReviewError: () => set({ reviewError: null }),
});

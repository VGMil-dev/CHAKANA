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
  stars: number;
  tags: string[];
  setReviews: (reviews: Review[]) => void;
  updateCurrentReviewText: (currentReviewText: string) => void;
  setIsSubmittingReview: (isSubmittingReview: boolean) => void;
  setReviewError: (reviewError: string | null) => void;
  setReviewSuccess: (reviewSuccess: boolean) => void;
  setStars: (stars: number) => void;
  setTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  resetReviewForm: () => void;
  clearReviewError: () => void;
};

type ReviewFormState = Pick<
  ReviewSlice,
  'currentReviewText' | 'isSubmittingReview' | 'reviewError' | 'reviewSuccess' | 'stars' | 'tags'
>;

const initialReviewFormState: ReviewFormState = {
  currentReviewText: '',
  isSubmittingReview: false,
  reviewError: null,
  reviewSuccess: false,
  stars: 0,
  tags: [],
};

export const createReviewSlice: StateCreator<AppStore, [], [], ReviewSlice> = (set) => ({
  reviews: [],
  ...initialReviewFormState,
  setReviews: (reviews) => set({ reviews }),
  updateCurrentReviewText: (currentReviewText) =>
    set({ currentReviewText, reviewError: null, reviewSuccess: false }),
  setIsSubmittingReview: (isSubmittingReview) => set({ isSubmittingReview }),
  setReviewError: (reviewError) => set({ reviewError }),
  setReviewSuccess: (reviewSuccess) => set({ reviewSuccess }),
  setStars: (stars) => set({ stars, tags: [] }),
  setTags: (tags) => set({ tags }),
  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((t) => t !== tag)
        : [...state.tags, tag],
    })),
  resetReviewForm: () => set(initialReviewFormState),
  clearReviewError: () => set({ reviewError: null }),
});

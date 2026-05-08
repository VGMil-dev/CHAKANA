import { create } from 'zustand';
import { createBusinessSlice, type BusinessSlice } from './slices/businessSlice';
import { createReviewSlice, type ReviewSlice } from './slices/reviewSlice';
import { createUiSlice, type UiSlice } from './slices/uiSlice';
import { createUserSlice, type UserSlice } from './slices/userSlice';

export type AppStore = UserSlice & BusinessSlice & ReviewSlice & UiSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createUserSlice(...args),
  ...createBusinessSlice(...args),
  ...createReviewSlice(...args),
  ...createUiSlice(...args),
}));

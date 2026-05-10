import type { Business, DiscountResult, Review } from './models';

export interface TambuCardProps {
  business: Business;
  onPress: (business: Business) => void;
}

export interface TambuDetailProps {
  business: Business;
  onOrder: () => void;
}

export interface CheckoutProps {
  total: number;
  discountResult: DiscountResult;
  sliderMax: number;
  aurioBalance: number;
  onSliderChange: (value: number) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export interface ReviewFormProps {
  currentText: string;
  isTextValid: boolean;
  charsRemaining: number;
  isSubmitting: boolean;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
}

export interface TambuDashboardProps {
  business: Business;
  reviews: Review[];
  audioReportUrl: string | null;
  isLoadingReport: boolean;
  onGenerateReport: () => void;
}

export interface PropinaModalProps {
  visible: boolean;
  walletPubKey: string | null;
  onClose: () => void;
}

export interface AudioPlayerProps {
  audioUrl: string;
  isLoading: boolean;
}

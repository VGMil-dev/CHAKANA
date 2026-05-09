import { useAppStore } from '../store';
import { calculateDiscount, type DiscountResult } from '../utils/discountCalculator';
import { getSliderMax } from '../utils/sliderConfig';

export type UseDiscountResult = {
  result: DiscountResult;
  sliderMax: number;
  onSliderChange: (value: number) => void;
  resetDiscount: () => void;
};

export function useDiscount(): UseDiscountResult {
  const checkoutTotal = useAppStore((state) => state.checkoutTotal);
  const aurioBalance = useAppStore((state) => state.aurioBalance);
  const auriosToSpend = useAppStore((state) => state.auriosToSpend);
  const setAuriosToSpend = useAppStore((state) => state.setAuriosToSpend);
  const setCheckoutError = useAppStore((state) => state.setCheckoutError);
  const setCheckoutSignature = useAppStore((state) => state.setCheckoutSignature);

  const result = calculateDiscount({
    subtotal: checkoutTotal,
    auriosToSpend,
    aurioBalance,
  });
  const sliderMax = getSliderMax(checkoutTotal, aurioBalance);

  return {
    result,
    sliderMax,
    onSliderChange: (value) => {
      const nextResult = calculateDiscount({
        subtotal: checkoutTotal,
        auriosToSpend: value,
        aurioBalance,
      });
      setAuriosToSpend(nextResult.auriosToSpend);
      setCheckoutError(null);
      setCheckoutSignature(null);
    },
    resetDiscount: () => {
      setAuriosToSpend(0);
      setCheckoutError(null);
      setCheckoutSignature(null);
    },
  };
}

export interface CheckoutConfig {
  /** Maximum Aurios discount allowed as % of subtotal */
  maxDiscountPct: number;
  /** Visual rail represents 0–railRange%, so MAX sits at (max/rail)*100% of the track */
  railRange: number;
  /** Default pct applied when screen loads */
  initialDiscountPct: number;
}

export const CHECKOUT_CONFIG: CheckoutConfig = {
  maxDiscountPct:    25,
  railRange:         33,
  initialDiscountPct: 18,
};

/** Mock user Aurios balance */
export const AURIOS_BALANCE = 2772;

const AURIO_USD_VALUE = 0.01;
const MAX_DISCOUNT_RATE = 0.25;

export interface DiscountResult {
  auriosToSpend: number;
  discountUSD: number;
  finalTotal: number;
  maxAuriosAllowed: number;
  isAtMaxDiscount: boolean;
  isBalanceLimited: boolean;
  percentageUsed: number;
}

type DiscountParams = {
  subtotal: number;
  auriosToSpend: number;
  aurioBalance: number;
};

function toSafeUSD(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return amount;
}

function toSafeAurios(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}

function toMoney(amount: number): number {
  return Number(amount.toFixed(2));
}

export function calculateDiscount(params: DiscountParams): DiscountResult {
  const subtotal = toSafeUSD(params.subtotal);
  const availableAurios = toSafeAurios(params.aurioBalance);
  const requestedAurios = toSafeAurios(params.auriosToSpend);

  if (subtotal <= 0) {
    return {
      auriosToSpend: 0,
      discountUSD: 0,
      finalTotal: 0,
      maxAuriosAllowed: 0,
      isAtMaxDiscount: false,
      isBalanceLimited: false,
      percentageUsed: 0,
    };
  }

  const maxAuriosBy25Percent = Math.floor((subtotal * MAX_DISCOUNT_RATE) / AURIO_USD_VALUE);
  const maxAuriosAllowed = Math.min(maxAuriosBy25Percent, availableAurios);
  const effectiveAuriosToSpend = Math.min(requestedAurios, maxAuriosAllowed);
  const discountUSD = toMoney(effectiveAuriosToSpend * AURIO_USD_VALUE);
  const finalTotal = toMoney(Math.max(subtotal - discountUSD, 0));

  return {
    auriosToSpend: effectiveAuriosToSpend,
    discountUSD,
    finalTotal,
    maxAuriosAllowed,
    isAtMaxDiscount:
      maxAuriosBy25Percent > 0 && effectiveAuriosToSpend === maxAuriosBy25Percent,
    isBalanceLimited: availableAurios < maxAuriosBy25Percent,
    percentageUsed:
      maxAuriosAllowed === 0
        ? 0
        : Number(((effectiveAuriosToSpend / maxAuriosAllowed) * 100).toFixed(2)),
  };
}

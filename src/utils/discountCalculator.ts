const MAX_DISCOUNT_RATE = 0.25;

export type DiscountParams = {
  subtotal: number;
  auriosToSpend: number;
  aurioBalance: number;
};

export type DiscountResult = {
  auriosToSpend: number;
  discountUSD: number;
  finalTotal: number;
  maxAuriosAllowed: number;
  isAtMaxDiscount: boolean;
  isBalanceLimited: boolean;
  percentageUsed: number;
};

function toSafeCents(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
}

function toSafeAurios(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}

function toUSD(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

export function calculateDiscount(params: DiscountParams): DiscountResult {
  const subtotalCents = toSafeCents(params.subtotal);
  const requestedAurios = toSafeAurios(params.auriosToSpend);
  const availableAurios = toSafeAurios(params.aurioBalance);
  const maxAuriosBySubtotal = Math.floor(subtotalCents * MAX_DISCOUNT_RATE);
  const maxAuriosAllowed = Math.min(maxAuriosBySubtotal, availableAurios);
  const effectiveAuriosToSpend = Math.min(requestedAurios, maxAuriosAllowed);
  const discountCents = effectiveAuriosToSpend;
  const finalTotalCents = Math.max(subtotalCents - discountCents, 0);

  return {
    auriosToSpend: effectiveAuriosToSpend,
    discountUSD: toUSD(discountCents),
    finalTotal: toUSD(finalTotalCents),
    maxAuriosAllowed,
    isAtMaxDiscount:
      maxAuriosAllowed > 0 &&
      maxAuriosAllowed === maxAuriosBySubtotal &&
      effectiveAuriosToSpend === maxAuriosBySubtotal,
    isBalanceLimited: availableAurios < maxAuriosBySubtotal,
    percentageUsed:
      maxAuriosAllowed === 0
        ? 0
        : Number(((effectiveAuriosToSpend / maxAuriosAllowed) * 100).toFixed(2)),
  };
}

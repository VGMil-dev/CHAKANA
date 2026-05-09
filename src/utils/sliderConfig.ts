import { calculateDiscount } from './discountCalculator';

const SLIDER_STEP = 10;
const AURIO_USD_VALUE = 0.01;

export function getSliderMax(subtotal: number, aurioBalance: number): number {
  return calculateDiscount({
    subtotal,
    auriosToSpend: 0,
    aurioBalance,
  }).maxAuriosAllowed;
}

export function getSliderStep(): number {
  return SLIDER_STEP;
}

export function formatAurios(amount: number): string {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
  return `${safeAmount.toLocaleString('en-US')} \u2726`;
}

export function formatUSD(amount: number): string {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  return `$${safeAmount.toFixed(2)}`;
}

export function auriosToUSD(aurios: number): number {
  const safeAurios = Number.isFinite(aurios) && aurios > 0 ? Math.floor(aurios) : 0;
  return Number((safeAurios * AURIO_USD_VALUE).toFixed(2));
}

export function usdToAurios(usd: number): number {
  if (!Number.isFinite(usd) || usd <= 0) return 0;
  return Math.round(usd / AURIO_USD_VALUE);
}

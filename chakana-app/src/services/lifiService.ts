/**
 * LI.FI REST API service for CHAKANA.
 *
 * Uses the official REST endpoint instead of @lifi/sdk to avoid extra
 * Expo/React Native polyfills. Paso 3 is quote-only: no route execution,
 * no wallet signing, no real fund movement.
 */

import {
  type CrosschainRouteRequest,
  type CrosschainRouteResult,
  CHAIN_NAMES,
  type SupportedChainId,
} from '../types/crosschain';

const LIFI_BASE_URL = 'https://li.quest/v1';

export const LIFI_DEMO_FALLBACK_MESSAGE =
  'No pudimos obtener una ruta real ahora. Mostrando ruta demo para la presentacion.';

const LIFI_API_KEY = process.env.EXPO_PUBLIC_LIFI_API_KEY ?? '';

function toRawAmount(amount: string, decimals: number): string {
  const parts = amount.split('.');
  const whole = parts[0] ?? '0';
  const frac = (parts[1] ?? '').padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + frac).toString();
}

function formatRawAmount(rawAmount: string, decimals: number): string {
  const padded = rawAmount.padStart(decimals + 1, '0');
  const whole = padded.slice(0, -decimals) || '0';
  const fraction = padded.slice(-decimals).replace(/0+$/, '');
  return fraction ? `${whole}.${fraction.slice(0, 6)}` : whole;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function getToolName(quote: Record<string, unknown>): string {
  const tool = quote.tool;
  if (typeof tool === 'string' && tool.length > 0) return tool;

  const toolDetails = asRecord(quote.toolDetails);
  const toolName = toolDetails.name ?? toolDetails.key;
  if (typeof toolName === 'string' && toolName.length > 0) return toolName;

  return 'LI.FI';
}

export async function getLifiRoute(
  request: CrosschainRouteRequest,
): Promise<CrosschainRouteResult> {
  const rawAmount = toRawAmount(request.fromAmount, request.fromTokenDecimals);

  const params = new URLSearchParams({
    fromChain: request.fromChainId.toString(),
    toChain: request.toChainId.toString(),
    fromToken: request.fromTokenAddress,
    toToken: request.toTokenAddress,
    fromAmount: rawAmount,
    ...(request.fromAddress ? { fromAddress: request.fromAddress } : {}),
    ...(request.toAddress ? { toAddress: request.toAddress } : {}),
    slippage: '0.03',
    integrator: 'chakana',
  });

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (LIFI_API_KEY) {
    headers['x-lifi-api-key'] = LIFI_API_KEY;
  }

  const response = await fetch(`${LIFI_BASE_URL}/quote?${params.toString()}`, { headers });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`LI.FI API error (${response.status}): ${body || response.statusText}`);
  }

  return mapLifiQuoteToResult(await response.json(), request);
}

function mapLifiQuoteToResult(
  quotePayload: unknown,
  request: CrosschainRouteRequest,
): CrosschainRouteResult {
  const quote = asRecord(quotePayload);
  const action = asRecord(quote.action);
  const estimate = asRecord(quote.estimate);
  const fromToken = asRecord(action.fromToken);
  const toToken = asRecord(action.toToken);
  const toolUsed = getToolName(quote);

  const estimatedSeconds = asNumber(estimate.executionDuration, 180);
  const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
  const estimatedTime = estimatedMinutes <= 1 ? '~1 min' : `~${estimatedMinutes} min`;

  const gasCostsUsd = asArray(estimate.gasCosts).reduce(
    (sum, gasCost) => sum + parseFloat(asString(gasCost.amountUSD, '0')),
    0,
  );
  const feeCostsUsd = asArray(estimate.feeCosts).reduce(
    (sum, feeCost) => sum + parseFloat(asString(feeCost.amountUSD, '0')),
    0,
  );
  const totalFee = (gasCostsUsd + feeCostsUsd).toFixed(2);

  const fromChainName = CHAIN_NAMES[request.fromChainId as SupportedChainId] ?? 'Polygon';
  const toChainName = CHAIN_NAMES[request.toChainId as SupportedChainId] ?? 'Solana';
  const toAmountRaw = asString(estimate.toAmount, '0');
  const toDecimals = asNumber(toToken.decimals, 6);

  return {
    sourceNetwork: fromChainName,
    sourceToken: asString(fromToken.symbol, 'USDC'),
    sourceAmount: request.fromAmount,
    destinationNetwork: toChainName,
    destinationToken: asString(toToken.symbol, 'USDC'),
    destinationAmount: formatRawAmount(toAmountRaw, toDecimals),
    provider: 'LI.FI',
    estimatedTime,
    estimatedFee: `~$${totalFee}`,
    status: 'success',
    isMock: false,
    source: 'real',
    toolUsed,
    request,
    queriedAt: new Date().toISOString(),
  };
}

export function getMockLifiRoute(
  request: CrosschainRouteRequest,
  fallbackReason = LIFI_DEMO_FALLBACK_MESSAGE,
): CrosschainRouteResult {
  const fromChainName = CHAIN_NAMES[request.fromChainId as SupportedChainId] ?? 'Polygon';
  const toChainName = CHAIN_NAMES[request.toChainId as SupportedChainId] ?? 'Solana';

  return {
    sourceNetwork: fromChainName,
    sourceToken: 'USDC',
    sourceAmount: request.fromAmount,
    destinationNetwork: toChainName,
    destinationToken: 'USDC',
    destinationAmount: request.fromAmount,
    provider: 'LI.FI',
    estimatedTime: '2-4 min',
    estimatedFee: '~$0.18',
    status: 'success',
    isMock: true,
    source: 'mock',
    toolUsed: 'mock',
    fallbackReason,
    request,
    queriedAt: new Date().toISOString(),
  };
}

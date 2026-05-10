/**
 * LI.FI REST API service for CHAKANA.
 *
 * Uses the official REST endpoint (https://li.quest/v1/quote) instead of
 * @lifi/sdk to avoid polyfill/import.meta issues in Expo/React Native.
 * This is the recommended approach per LI.FI docs for non-browser envs.
 *
 * Only fetches quotes — does NOT execute routes (Paso 3).
 */

import {
  type CrosschainRouteRequest,
  type CrosschainRouteResult,
  CHAIN_NAMES,
  type SupportedChainId,
} from '../types/crosschain';

const LIFI_BASE_URL = 'https://li.quest/v1';

// Optional: set via EXPO_PUBLIC_LIFI_API_KEY in .env
const LIFI_API_KEY = process.env.EXPO_PUBLIC_LIFI_API_KEY ?? '';

/** Convert human-readable amount to raw units (e.g. "10" USDC → "10000000") */
function toRawAmount(amount: string, decimals: number): string {
  const parts = amount.split('.');
  const whole = parts[0] ?? '0';
  const frac = (parts[1] ?? '').padEnd(decimals, '0').slice(0, decimals);
  // Use string concat to avoid floating-point issues
  return BigInt(whole + frac).toString();
}

/**
 * Fetch a quote from LI.FI REST API.
 * Uses /quote for a single-step result (simpler and faster than /routes).
 */
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
    // fromAddress is needed for full tx data, optional for quote
    ...(request.fromAddress ? { fromAddress: request.fromAddress } : {}),
    ...(request.toAddress ? { toAddress: request.toAddress } : {}),
    slippage: '0.03',
    integrator: 'chakana',
  });

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  if (LIFI_API_KEY) {
    headers['x-lifi-api-key'] = LIFI_API_KEY;
  }

  const url = `${LIFI_BASE_URL}/quote?${params.toString()}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `LI.FI API error (${response.status}): ${body || response.statusText}`,
    );
  }

  const data = await response.json();
  return mapLifiQuoteToResult(data, request);
}

/**
 * Map the raw LI.FI /quote response to our normalized CrosschainRouteResult.
 * Docs: https://apidocs.li.fi/reference/get_quote
 */
function mapLifiQuoteToResult(
  quote: any,
  request: CrosschainRouteRequest,
): CrosschainRouteResult {
  const action = quote.action ?? {};
  const estimate = quote.estimate ?? {};
  const toolUsed = quote.tool ?? quote.toolDetails?.name ?? 'unknown';

  // Estimate time from the response (seconds → human readable)
  const estimatedSeconds = estimate.executionDuration ?? 180;
  const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
  const estimatedTime =
    estimatedMinutes <= 1 ? '~1 min' : `~${estimatedMinutes} min`;

  // Fee: gasCosts + feeCosts from estimate
  const gasCostsUsd = (estimate.gasCosts ?? []).reduce(
    (sum: number, g: any) => sum + parseFloat(g.amountUSD ?? '0'),
    0,
  );
  const feeCostsUsd = (estimate.feeCosts ?? []).reduce(
    (sum: number, f: any) => sum + parseFloat(f.amountUSD ?? '0'),
    0,
  );
  const totalFee = (gasCostsUsd + feeCostsUsd).toFixed(2);

  const fromChainName =
    CHAIN_NAMES[request.fromChainId as SupportedChainId] ?? 'Unknown';
  const toChainName =
    CHAIN_NAMES[request.toChainId as SupportedChainId] ?? 'Unknown';

  // Destination amount from estimate
  const toAmountRaw = estimate.toAmount ?? '0';
  const toDecimals = action.toToken?.decimals ?? 6;
  const toAmountHuman = (
    parseInt(toAmountRaw, 10) / Math.pow(10, toDecimals)
  ).toFixed(toDecimals > 6 ? 4 : 2);

  return {
    sourceNetwork: fromChainName,
    sourceToken: action.fromToken?.symbol ?? 'Unknown',
    sourceAmount: request.fromAmount,
    destinationNetwork: toChainName,
    destinationToken: action.toToken?.symbol ?? 'Unknown',
    destinationAmount: toAmountHuman,
    provider: 'LI.FI',
    estimatedTime,
    estimatedFee: `~$${totalFee}`,
    status: 'success',
    isMock: false,
    toolUsed,
  };
}

/**
 * Returns a mock route result for when the API is unavailable.
 * Used as fallback so the demo always works.
 */
export function getMockLifiRoute(
  request: CrosschainRouteRequest,
): CrosschainRouteResult {
  const fromChainName =
    CHAIN_NAMES[request.fromChainId as SupportedChainId] ?? 'Polygon';
  const toChainName =
    CHAIN_NAMES[request.toChainId as SupportedChainId] ?? 'Solana';

  return {
    sourceNetwork: fromChainName,
    sourceToken: 'USDC',
    sourceAmount: request.fromAmount,
    destinationNetwork: toChainName,
    destinationToken: 'USDC',
    destinationAmount: request.fromAmount, // 1:1 mock
    provider: 'LI.FI',
    estimatedTime: '2-4 min',
    estimatedFee: '~$0.18',
    status: 'success',
    isMock: true,
    toolUsed: 'mock',
  };
}

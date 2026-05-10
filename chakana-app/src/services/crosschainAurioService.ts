/**
 * Crosschain → Aurio onboarding service.
 *
 * Adapts the raw LI.FI route to the CHAKANA flow:
 *   any chain/token → Solana USDC/SOL → (future) Aurio SDK
 *
 * Forces destination to Solana and handles fallback to mock data.
 */

import {
  type CrosschainRouteRequest,
  type CrosschainRouteResult,
  SOLANA_CHAIN_ID,
  SOLANA_USDC_ADDRESS,
} from '../types/crosschain';

import { getLifiRoute, getMockLifiRoute, LIFI_DEMO_FALLBACK_MESSAGE } from './lifiService';

export interface AurioOnboardingRequest {
  fromChainId: CrosschainRouteRequest['fromChainId'];
  fromTokenAddress: string;
  fromTokenDecimals: number;
  fromAmount: string;
  /** Solana wallet to receive funds. Used for quote-only destination realism. */
  toWalletAddress?: string;
  /** Source wallet address. Used for quote-only route realism. */
  fromWalletAddress?: string;
}

/**
 * Get the best route to bring value into Solana for Aurio onboarding.
 *
 * - Always targets Solana as destination chain.
 * - Defaults to USDC as destination token (most liquid).
 * - Falls back to mock if API fails (demo resilience).
 *
 * TODO (future): After receiving USDC on Solana, call Aurio SDK
 * to swap/wrap into AUR tokens for Tambú payments.
 */
export async function getAurioOnboardingRoute(
  request: AurioOnboardingRequest,
): Promise<CrosschainRouteResult> {
  const routeRequest: CrosschainRouteRequest = {
    fromChainId: request.fromChainId,
    fromTokenAddress: request.fromTokenAddress,
    fromAmount: request.fromAmount,
    fromTokenDecimals: request.fromTokenDecimals,
    toChainId: SOLANA_CHAIN_ID,
    toTokenAddress: SOLANA_USDC_ADDRESS,
    fromAddress: request.fromWalletAddress,
    toAddress: request.toWalletAddress,
  };

  try {
    const result = await getLifiRoute(routeRequest);
    return result;
  } catch (error) {
    // Log for debugging but don't crash the demo
    console.warn(
      '[crosschainAurioService] LI.FI API failed, using mock fallback:',
      error instanceof Error ? error.message : error,
    );
    return getMockLifiRoute(routeRequest, LIFI_DEMO_FALLBACK_MESSAGE);
  }
}

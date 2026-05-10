// Crosschain Types for LI.FI + Aurio integration

/** Chains supported in MVP */
export type SupportedChainId =
  | 1          // Ethereum
  | 137        // Polygon
  | 8453       // Base
  | 1151111081099710; // Solana

export type SupportedChainName = 'Ethereum' | 'Polygon' | 'Base' | 'Solana';

export const CHAIN_NAMES: Record<SupportedChainId, SupportedChainName> = {
  1: 'Ethereum',
  137: 'Polygon',
  8453: 'Base',
  1151111081099710: 'Solana',
};

/** Token addresses per chain for MVP */
export interface SupportedToken {
  symbol: string;
  address: string;
  decimals: number;
  chainId: SupportedChainId;
}

export const SUPPORTED_TOKENS: SupportedToken[] = [
  { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6, chainId: 137 },
  { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, chainId: 137 },
  { symbol: 'ETH',  address: '0x0000000000000000000000000000000000000000', decimals: 18, chainId: 8453 },
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, chainId: 1 },
  { symbol: 'SOL',  address: '11111111111111111111111111111111',           decimals: 9, chainId: 1151111081099710 },
  { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6, chainId: 1151111081099710 },
];

// Solana destination constants
export const SOLANA_CHAIN_ID: SupportedChainId = 1151111081099710;
export const SOLANA_USDC_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const SOLANA_SOL_ADDRESS  = '11111111111111111111111111111111';

// Route request / result
export type CrosschainProvider = 'LI.FI';
export type CrosschainRouteStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CrosschainRouteRequest {
  fromChainId: SupportedChainId;
  fromTokenAddress: string;
  fromAmount: string;        // Human-readable amount (e.g. "10")
  fromTokenDecimals: number;
  toChainId: SupportedChainId;
  toTokenAddress: string;
  /** Solana wallet address of the user. Optional for quote-only. */
  fromAddress?: string;
  toAddress?: string;
}

export interface CrosschainRouteResult {
  sourceNetwork: SupportedChainName;
  sourceToken: string;
  sourceAmount: string;
  destinationNetwork: SupportedChainName;
  destinationToken: string;
  destinationAmount: string;
  provider: CrosschainProvider;
  estimatedTime: string;
  estimatedFee: string;
  status: CrosschainRouteStatus;
  /** True if result came from mock fallback instead of real API */
  isMock: boolean;
  /** Raw API tool name, e.g. "across", "allbridge" */
  toolUsed?: string;
}

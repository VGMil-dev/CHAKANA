export interface CrosschainRouteMock {
  sourceNetwork: string;
  sourceToken: string;
  destinationNetwork: string;
  destinationToken: string;
  provider: string;
  estimatedTime: string;
  estimatedFee: string;
  status: 'idle' | 'loading' | 'ready';
}

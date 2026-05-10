export type CrosschainDestinationWalletSource = 'connected' | 'env' | 'mock';

export type CrosschainDestinationWallet = {
  address: string;
  source: CrosschainDestinationWalletSource;
  label: string;
};

export const CROSSCHAIN_DEMO_SOLANA_WALLET =
  '7NvESrvRtuEzUUZ1E7qErKTd5uXEkygMxadjbnWFvyZb';

const BASE58_SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function isProbablySolanaAddress(address: string | null | undefined): address is string {
  if (!address) return false;
  return BASE58_SOLANA_ADDRESS.test(address.trim());
}

export function getCrosschainDestinationWallet(
  connectedWallet: string | null | undefined,
  envWallet: string | null | undefined,
): CrosschainDestinationWallet {
  if (isProbablySolanaAddress(connectedWallet)) {
    return {
      address: connectedWallet.trim(),
      source: 'connected',
      label: 'wallet conectada',
    };
  }

  if (isProbablySolanaAddress(envWallet)) {
    return {
      address: envWallet.trim(),
      source: 'env',
      label: 'wallet demo',
    };
  }

  return {
    address: CROSSCHAIN_DEMO_SOLANA_WALLET,
    source: 'mock',
    label: 'wallet demo',
  };
}

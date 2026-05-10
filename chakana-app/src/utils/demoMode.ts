import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEMO_MODE_STORAGE_KEY = 'chakana.demoMode.enabled';
export const DEMO_USER_ID = 'demo-user-chakana-apk';
export const DEMO_USER_EMAIL = 'demo@chakana.app';
export const DEMO_AURIO_BALANCE = 250;
export const DEMO_SOL_BALANCE = 0;
export const DEMO_PAYMENT_SESSION_ID = 'demo_checkout_approved';

export const DEMO_SOLANA_WALLET = '7NvESrvRtuEzUUZ1E7qErKTd5uXEkygMxadjbnWFvyZb';

export function getDemoWalletAddress(): string {
  const envWallet = process.env.EXPO_PUBLIC_QA_PAYOUT_WALLET?.trim();
  return envWallet || DEMO_SOLANA_WALLET;
}

export async function enableDemoModeSession(): Promise<void> {
  await AsyncStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
}

export async function disableDemoModeSession(): Promise<void> {
  await AsyncStorage.removeItem(DEMO_MODE_STORAGE_KEY);
}

export async function isDemoModeSessionEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(DEMO_MODE_STORAGE_KEY)) === 'true';
}


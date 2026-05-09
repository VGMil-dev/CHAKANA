import { createClient } from '@supabase/supabase-js';
import { TurboModuleRegistry } from 'react-native';
import type { Database } from '../../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

type SupabaseStorage = {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
};

const memoryStore = new Map<string, string>();

const memoryStorage: SupabaseStorage = {
  getItem: (key) => memoryStore.get(key) ?? null,
  setItem: (key, value) => {
    memoryStore.set(key, value);
  },
  removeItem: (key) => {
    memoryStore.delete(key);
  },
};

const webStorage: SupabaseStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: (key) => window.localStorage.removeItem(key),
};

const asyncStorageNative = TurboModuleRegistry.get('RNAsyncStorage');

let asyncStorage: SupabaseStorage | null = null;
if (asyncStorageNative) {
  try {
    const { default: AsyncStorageImpl } = require('@react-native-async-storage/async-storage');
    if (AsyncStorageImpl?.getItem) {
      asyncStorage = AsyncStorageImpl as unknown as SupabaseStorage;
    }
  } catch {}
}

function getSupabaseStorage(): SupabaseStorage {
  if (typeof window === 'undefined') return memoryStorage;
  if ('localStorage' in window && window.localStorage) return webStorage;
  return asyncStorage ?? memoryStorage;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getSupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { Database } from '../../types/database';

const envSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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

function wrapStorageSafe(inner: SupabaseStorage, fallback: SupabaseStorage): SupabaseStorage {
  return {
    getItem: (key) => {
      try {
        const result = inner.getItem(key);
        if (result instanceof Promise) return result.catch(() => fallback.getItem(key));
        return result;
      } catch {
        return fallback.getItem(key);
      }
    },
    setItem: (key, value) => {
      try {
        const result = inner.setItem(key, value);
        if (result instanceof Promise) return result.catch(() => fallback.setItem(key, value));
        return result;
      } catch {
        return fallback.setItem(key, value);
      }
    },
    removeItem: (key) => {
      try {
        const result = inner.removeItem(key);
        if (result instanceof Promise) return result.catch(() => fallback.removeItem(key));
        return result;
      } catch {
        return fallback.removeItem(key);
      }
    },
  };
}

function getSupabaseStorage(): SupabaseStorage {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        getItem: (key) => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value),
        removeItem: (key) => window.localStorage.removeItem(key),
      };
    }
    return memoryStorage;
  }

  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default as SupabaseStorage;
    return wrapStorageSafe(AsyncStorage, memoryStorage);
  } catch {
    return memoryStorage;
  }
}

function resolveSupabaseEnv() {
  const fromConstants = (Constants?.expoConfig?.extra as Record<string, string> | undefined) || (Constants?.manifest?.extra as Record<string, string> | undefined) || {};
  const supabaseUrl = envSupabaseUrl ?? fromConstants.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = envSupabaseAnonKey ?? fromConstants.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return { supabaseUrl, supabaseAnonKey };
}

let _client: SupabaseClient<Database> | null = null;

function createSupabaseClient(): SupabaseClient<Database> {
  if (_client) return _client;
  const { supabaseUrl, supabaseAnonKey } = resolveSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Add them to .env or app.json/app.config extra.');
  }
  _client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: getSupabaseStorage(),
      storageKey: 'chakana-supabase-auth-v1',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    const client = createSupabaseClient();
    return client[prop as keyof SupabaseClient<Database>];
  },
  apply(_, thisArg, args) {
    const client = createSupabaseClient();
    return (client as any).apply(thisArg, args);
  },
});
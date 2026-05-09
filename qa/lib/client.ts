import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error('ERROR: SUPABASE_URL y SUPABASE_ANON_KEY deben estar en qa/.env');
  process.exit(1);
}

export const supabase = createClient(url, anonKey);

export const supabaseAdmin = serviceKey
  ? createClient(url, serviceKey)
  : null;

export const env = {
  url,
  anonKey,
  serviceKey,
  testEmail: process.env.QA_TEST_EMAIL ?? 'qa-test@chakana.dev',
  testPassword: process.env.QA_TEST_PASSWORD ?? 'Chakana2024!',
  businessId: process.env.QA_BUSINESS_ID ?? '',
  commerceTambuId: process.env.QA_COMMERCE_TAMBU_ID ?? '',
  commerceProductId: process.env.QA_COMMERCE_PRODUCT_ID ?? '',
};

// Fuerza cierre del proceso para evitar el crash UV_HANDLE_CLOSING en Windows
// causado por conexiones keep-alive del cliente Supabase
export function done(code: number = 0): void {
  setTimeout(() => process.exit(code), 100);
}

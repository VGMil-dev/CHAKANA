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

// Cliente con anon key (simula el cliente móvil)
export const supabase = createClient(url, anonKey);

// Cliente con service_role (simula las Edge Functions)
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
};

# Supabase Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar toda la infraestructura de Supabase para Chakana: proyecto, schema SQL con RLS, thin service layer en el cliente, y dos Edge Functions (oráculo de mint + generador de reportes con ElevenLabs).

**Architecture:** Thin service layer — Dev 2 (Logic) consume funciones limpias desde `src/services/supabase/`. Las Edge Functions son el backend real y usan `service_role_key` para operaciones privilegiadas (mintear, leer cross-user). RLS protege todos los datos en el cliente.

**Tech Stack:** Supabase (Auth, Postgres, Storage, Edge Functions), @supabase/supabase-js, Deno (Edge Functions), ElevenLabs API, Solana web3.js (solo en Edge Function del oráculo), TypeScript.

---

## Mapa de Archivos

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `src/services/supabase/client.ts` | Crear | Singleton del cliente Supabase (anon key) |
| `src/services/supabase/auth.service.ts` | Crear | signUp, signIn, signOut, getSession |
| `src/services/supabase/reviews.service.ts` | Crear | insertReview, getReviewsByBusiness |
| `src/services/supabase/businesses.service.ts` | Crear | getAllBusinesses, getBusinessById |
| `src/services/supabase/storage.service.ts` | Crear | getAudioReportUrl |
| `src/types/database.ts` | Crear | Tipos generados por Supabase CLI |
| `supabase/functions/review-reward-oracle/index.ts` | Crear | Edge Function: valida reseña y registra recompensa |
| `supabase/functions/generate-report/index.ts` | Crear | Edge Function: reseñas → LLM → ElevenLabs → Storage |
| `.env.local` | Crear | Variables de entorno del cliente (anon key, URL) |

---

## Task 1: Crear Proyecto Supabase y Variables de Entorno

**Files:**
- Create: `.env.local`
- Create: `.gitignore` (verificar que `.env.local` está ignorado)

- [ ] **Step 1: Crear el proyecto Supabase via MCP o Dashboard**

  Ir a [supabase.com/dashboard](https://supabase.com/dashboard) → New Project:
  - **Name:** `chakana`
  - **Organization:** Diego
  - **Region:** `us-east-1` (East US - North Virginia)
  - **Password:** genera una segura y guárdala

  Esperar ~2 minutos hasta que el proyecto esté `ACTIVE_HEALTHY`.

- [ ] **Step 2: Obtener las credenciales**

  En el dashboard: Settings → API. Copiar:
  - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
  - `anon public key` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role key` → para Edge Functions ÚNICAMENTE (no va en el cliente)

- [ ] **Step 3: Crear `.env.local` en la raíz del proyecto**

  ```bash
  # .env.local — NUNCA commitear este archivo
  EXPO_PUBLIC_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

- [ ] **Step 4: Verificar que `.env.local` está en `.gitignore`**

  Abrir `.gitignore` y confirmar que existe la línea:
  ```
  .env.local
  ```
  Si no existe, añadirla.

- [ ] **Step 5: Commit**

  ```bash
  git add .gitignore
  git commit -m "chore: add .env.local to gitignore for Supabase secrets"
  ```

---

## Task 2: Schema SQL — Tablas y RLS

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Crear el archivo de migración**

  ```bash
  mkdir -p supabase/migrations
  ```

  Crear `supabase/migrations/001_initial_schema.sql` con el siguiente contenido:

  ```sql
  -- =============================================
  -- CHAKANA — Schema inicial
  -- =============================================

  -- Tabla: profiles (extiende auth.users)
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_pubkey TEXT,
    role TEXT NOT NULL DEFAULT 'ambassador' CHECK (role IN ('ambassador', 'owner', 'admin')),
    display_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- Tabla: businesses (Tambus)
  CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    wallet_pubkey TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- Tabla: reviews (Reseñas de Embajadores)
  CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    solana_memo_signature TEXT,
    aurios_rewarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT review_min_length CHECK (char_length(text) > 50)
  );

  -- Tabla: audio_reports
  CREATE TABLE IF NOT EXISTS audio_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- =============================================
  -- RLS: profiles
  -- =============================================
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "profiles: read own" ON profiles
    FOR SELECT USING (auth.uid() = id);

  CREATE POLICY "profiles: insert own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

  CREATE POLICY "profiles: update own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

  -- =============================================
  -- RLS: businesses
  -- =============================================
  ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "businesses: anyone can read" ON businesses
    FOR SELECT USING (true);

  CREATE POLICY "businesses: owner manages own" ON businesses
    FOR ALL USING (auth.uid() = owner_id);

  -- =============================================
  -- RLS: reviews
  -- =============================================
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "reviews: ambassador inserts own" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "reviews: ambassador reads own" ON reviews
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "reviews: owner reads business reviews" ON reviews
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM businesses b
        WHERE b.id = reviews.business_id
          AND b.owner_id = auth.uid()
      )
    );

  -- =============================================
  -- RLS: audio_reports
  -- =============================================
  ALTER TABLE audio_reports ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "audio_reports: owner reads own" ON audio_reports
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM businesses b
        WHERE b.id = audio_reports.business_id
          AND b.owner_id = auth.uid()
      )
    );

  -- =============================================
  -- Trigger: crear profile automáticamente al registrar usuario
  -- =============================================
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  ```

- [ ] **Step 2: Aplicar la migración en Supabase**

  En el dashboard de Supabase → SQL Editor → pegar el contenido completo de `001_initial_schema.sql` → Run.

  Verificar en Table Editor que existen las 4 tablas: `profiles`, `businesses`, `reviews`, `audio_reports`.

- [ ] **Step 3: Crear buckets en Storage**

  En el dashboard: Storage → New Bucket:
  - `avatars` → Public: **ON**
  - `reports` → Public: **OFF** (privado)

  Para `reports`, añadir política RLS en Storage:
  ```sql
  -- Solo el owner del negocio puede leer reportes de audio
  CREATE POLICY "reports: owner reads" ON storage.objects
    FOR SELECT USING (
      bucket_id = 'reports'
      AND EXISTS (
        SELECT 1 FROM audio_reports ar
        JOIN businesses b ON b.id = ar.business_id
        WHERE ar.storage_path = name
          AND b.owner_id = auth.uid()
      )
    );

  -- Solo service_role puede insertar (desde Edge Function)
  -- No se necesita política de INSERT para anon/authenticated
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add supabase/migrations/001_initial_schema.sql
  git commit -m "feat(db): add initial schema with RLS — profiles, businesses, reviews, audio_reports"
  ```

---

## Task 3: Generar Tipos TypeScript

**Files:**
- Create: `src/types/database.ts`

- [ ] **Step 1: Instalar Supabase CLI si no está instalado**

  ```bash
  npm install -g supabase
  ```

- [ ] **Step 2: Login con Supabase CLI**

  ```bash
  npx supabase login
  ```

  Abre el browser, autoriza, vuelve a la terminal.

- [ ] **Step 3: Generar los tipos**

  Reemplazar `TU_PROJECT_REF` con el ref de tu proyecto (lo encontrás en Settings → General):

  ```bash
  mkdir -p src/types
  npx supabase gen types typescript --project-id TU_PROJECT_REF > src/types/database.ts
  ```

- [ ] **Step 4: Verificar el archivo generado**

  Abrir `src/types/database.ts` y confirmar que aparecen las interfaces `profiles`, `businesses`, `reviews`, `audio_reports` dentro del tipo `Database`.

- [ ] **Step 5: Commit**

  ```bash
  git add src/types/database.ts
  git commit -m "feat(types): generate Supabase TypeScript types from schema"
  ```

---

## Task 4: Cliente Supabase (Singleton)

**Files:**
- Create: `src/services/supabase/client.ts`

- [ ] **Step 1: Instalar el SDK**

  ```bash
  npx expo install @supabase/supabase-js
  npx expo install @react-native-async-storage/async-storage
  ```

  `AsyncStorage` es necesario para que Supabase persista la sesión en React Native.

- [ ] **Step 2: Crear `src/services/supabase/client.ts`**

  ```typescript
  import { createClient } from '@supabase/supabase-js';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import type { Database } from '../../types/database';

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

  export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  ```

- [ ] **Step 3: Verificar que el cliente inicializa sin errores**

  En cualquier pantalla temporal, importar y loggear:
  ```typescript
  import { supabase } from '../services/supabase/client';
  console.log('Supabase client:', supabase);
  ```
  
  Correr `npx expo start` y confirmar que no hay errores en consola.

- [ ] **Step 4: Commit**

  ```bash
  git add src/services/supabase/client.ts
  git commit -m "feat(supabase): add singleton client with AsyncStorage session persistence"
  ```

---

## Task 5: Auth Service

**Files:**
- Create: `src/services/supabase/auth.service.ts`

- [ ] **Step 1: Crear `src/services/supabase/auth.service.ts`**

  ```typescript
  import { supabase } from './client';

  export type AuthError = { message: string };

  export async function signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw new Error(error.message);
    return data.user;
  }

  export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data.user;
  }

  export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  }

  export async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
  }

  export function onAuthStateChange(callback: (user: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return data.subscription.unsubscribe;
  }
  ```

- [ ] **Step 2: Smoke test manual**

  En Supabase dashboard → Authentication → Users, crear un usuario de prueba manualmente.
  
  En una pantalla temporal, llamar:
  ```typescript
  import { signIn } from '../services/supabase/auth.service';
  
  signIn('test@test.com', 'password123')
    .then(user => console.log('User:', user?.id))
    .catch(err => console.error('Auth error:', err.message));
  ```

  Confirmar que el `user.id` aparece en consola.

- [ ] **Step 3: Commit**

  ```bash
  git add src/services/supabase/auth.service.ts
  git commit -m "feat(supabase): add auth service — signUp, signIn, signOut, getSession"
  ```

---

## Task 6: Reviews Service

**Files:**
- Create: `src/services/supabase/reviews.service.ts`

- [ ] **Step 1: Crear `src/services/supabase/reviews.service.ts`**

  ```typescript
  import { supabase } from './client';
  import type { Database } from '../../types/database';

  type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
  type Review = Database['public']['Tables']['reviews']['Row'];

  export async function insertReview(payload: {
    business_id: string;
    text: string;
    solana_memo_signature?: string;
  }): Promise<Review> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const insert: ReviewInsert = {
      user_id: userData.user.id,
      business_id: payload.business_id,
      text: payload.text,
      solana_memo_signature: payload.solana_memo_signature ?? null,
      aurios_rewarded: 0,
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(insert)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  export async function getMyReviews(): Promise<Review[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  }
  ```

- [ ] **Step 2: Smoke test manual**

  Con un usuario autenticado, llamar desde una pantalla temporal:
  ```typescript
  import { insertReview, getReviewsByBusiness } from '../services/supabase/reviews.service';

  // Reemplazar con un business_id real de tu tabla businesses
  const BUSINESS_ID = 'uuid-del-business-aqui';

  insertReview({
    business_id: BUSINESS_ID,
    text: 'Este café es increíble, el servicio fue excelente y el ambiente muy acogedor.',
  })
    .then(review => console.log('Inserted review:', review.id))
    .catch(err => console.error('Error:', err.message));
  ```

  Verificar en Supabase → Table Editor → reviews que la fila existe.

- [ ] **Step 3: Commit**

  ```bash
  git add src/services/supabase/reviews.service.ts
  git commit -m "feat(supabase): add reviews service — insertReview, getReviewsByBusiness, getMyReviews"
  ```

---

## Task 7: Businesses Service

**Files:**
- Create: `src/services/supabase/businesses.service.ts`

- [ ] **Step 1: Crear `src/services/supabase/businesses.service.ts`**

  ```typescript
  import { supabase } from './client';
  import type { Database } from '../../types/database';

  type Business = Database['public']['Tables']['businesses']['Row'];

  export async function getAllBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  export async function getBusinessById(id: string): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
  ```

- [ ] **Step 2: Seed manual — insertar un Tambu de prueba**

  En Supabase → SQL Editor:
  ```sql
  INSERT INTO businesses (name, wallet_pubkey, description)
  VALUES (
    'Raíz Café',
    'SolanaWalletPubkeyAqui11111111111111111111',
    'Café artesanal en el centro de Cuenca'
  );
  ```

  Copiar el `id` generado — lo usarás en los smoke tests de reviews.

- [ ] **Step 3: Smoke test**

  ```typescript
  import { getAllBusinesses } from '../services/supabase/businesses.service';

  getAllBusinesses()
    .then(businesses => console.log('Businesses:', businesses.map(b => b.name)))
    .catch(err => console.error('Error:', err.message));
  ```

  Confirmar que `['Raíz Café']` aparece en consola.

- [ ] **Step 4: Commit**

  ```bash
  git add src/services/supabase/businesses.service.ts
  git commit -m "feat(supabase): add businesses service — getAllBusinesses, getBusinessById"
  ```

---

## Task 8: Storage Service

**Files:**
- Create: `src/services/supabase/storage.service.ts`

- [ ] **Step 1: Crear `src/services/supabase/storage.service.ts`**

  ```typescript
  import { supabase } from './client';

  export async function getAudioReportUrl(storagePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('reports')
      .createSignedUrl(storagePath, 3600); // 1 hora de validez

    if (error) throw new Error(error.message);
    return data.signedUrl;
  }

  export async function getLatestAudioReport(businessId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('audio_reports')
      .select('storage_path')
      .eq('business_id', businessId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return getAudioReportUrl(data.storage_path);
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/services/supabase/storage.service.ts
  git commit -m "feat(supabase): add storage service — getAudioReportUrl, getLatestAudioReport"
  ```

---

## Task 9: Edge Function — review-reward-oracle

**Files:**
- Create: `supabase/functions/review-reward-oracle/index.ts`

Esta función recibe un webhook de Supabase Database cuando se inserta una review. Valida que el texto tenga >50 chars y actualiza `aurios_rewarded` en la review. El minting real en Solana es responsabilidad de Dev 3 (el oráculo solo registra cuánto se debe mintear; Dev 3 firma la tx desde el cliente o un job separado si hay tiempo).

> **Nota para hackathon:** Si no hay tiempo de integrar el signing de Solana en la Edge Function, esta función simplemente actualiza `aurios_rewarded` en la DB y Dev 3 lee ese campo para saber cuánto mintear desde el cliente.

- [ ] **Step 1: Configurar secrets en Supabase**

  En Supabase dashboard → Settings → Edge Functions → Secrets:
  ```
  SUPABASE_SERVICE_ROLE_KEY=eyJ...  (el service_role key de Settings → API)
  ```

  El `SUPABASE_URL` ya está disponible automáticamente en Edge Functions como variable de entorno.

- [ ] **Step 2: Crear `supabase/functions/review-reward-oracle/index.ts`**

  ```typescript
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

  const AURIOS_PER_REVIEW = 1; // 1 Aurio = $0.01 de descuento futuro

  Deno.serve(async (req: Request) => {
    // Supabase Database Webhooks envían POST con el payload de la fila
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let body: { record: { id: string; text: string; user_id: string; aurios_rewarded: number } };
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    const review = body.record;

    // Validar longitud mínima (double-check, ya está en el CHECK de SQL)
    if (!review.text || review.text.length <= 50) {
      return new Response(JSON.stringify({ rewarded: false, reason: 'text_too_short' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Evitar doble recompensa
    if (review.aurios_rewarded > 0) {
      return new Response(JSON.stringify({ rewarded: false, reason: 'already_rewarded' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Actualizar aurios_rewarded en la review (service_role bypasea RLS)
    const { error } = await supabase
      .from('reviews')
      .update({ aurios_rewarded: AURIOS_PER_REVIEW })
      .eq('id', review.id);

    if (error) {
      console.error('Error updating review:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log(`Oracle: rewarded ${AURIOS_PER_REVIEW} Aurios to review ${review.id}`);

    return new Response(
      JSON.stringify({ rewarded: true, aurios: AURIOS_PER_REVIEW, review_id: review.id }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  });
  ```

- [ ] **Step 3: Deploy de la Edge Function**

  ```bash
  npx supabase functions deploy review-reward-oracle --project-ref TU_PROJECT_REF
  ```

- [ ] **Step 4: Configurar Database Webhook en Supabase**

  Dashboard → Database → Webhooks → Create Webhook:
  - **Name:** `on_review_insert`
  - **Table:** `reviews`
  - **Events:** `INSERT`
  - **URL:** `https://TU_PROJECT_REF.supabase.co/functions/v1/review-reward-oracle`
  - **HTTP Headers:** `Authorization: Bearer TU_ANON_KEY`

- [ ] **Step 5: Test end-to-end**

  Insertar una review desde el SQL Editor con texto >50 chars:
  ```sql
  INSERT INTO reviews (user_id, business_id, text)
  VALUES (
    'uuid-de-un-usuario-real',
    'uuid-del-business-raiz-cafe',
    'Este café es increíble, el servicio fue excelente y el ambiente muy acogedor en Cuenca.'
  );
  ```

  Esperar ~3 segundos y verificar que `aurios_rewarded` se actualiz� a `1` en la fila.

  Verificar logs: Dashboard → Functions → review-reward-oracle → Logs.

- [ ] **Step 6: Commit**

  ```bash
  git add supabase/functions/review-reward-oracle/index.ts
  git commit -m "feat(edge): add review-reward-oracle — validates review and sets aurios_rewarded"
  ```

---

## Task 10: Edge Function — generate-report

**Files:**
- Create: `supabase/functions/generate-report/index.ts`

- [ ] **Step 1: Configurar secrets adicionales en Supabase**

  Dashboard → Settings → Edge Functions → Secrets. Añadir:
  ```
  ELEVENLABS_API_KEY=tu_api_key_de_elevenlabs
  LLM_API_KEY=tu_openai_o_anthropic_key   # placeholder hasta decidir LLM
  ```

- [ ] **Step 2: Crear `supabase/functions/generate-report/index.ts`**

  ```typescript
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

  const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Voz "Sarah" — cálida, latina
  const MAX_REVIEWS = 20;

  Deno.serve(async (req: Request) => {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(req.url);
    const businessId = url.searchParams.get('business_id');

    if (!businessId) {
      return new Response(JSON.stringify({ error: 'business_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY')!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Obtener las últimas reseñas del negocio
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('text, created_at, aurios_rewarded')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(MAX_REVIEWS);

    if (reviewsError) {
      return new Response(JSON.stringify({ error: reviewsError.message }), { status: 500 });
    }

    if (!reviews || reviews.length === 0) {
      return new Response(JSON.stringify({ error: 'No reviews found for this business' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Construir el texto del reporte (sin LLM por ahora — placeholder listo para conectar)
    const reviewTexts = reviews.map((r, i) => `Reseña ${i + 1}: ${r.text}`).join('\n\n');
    const reportScript = buildReportScript(reviewTexts, reviews.length);

    // 3. Llamar a ElevenLabs TTS
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: reportScript,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      return new Response(JSON.stringify({ error: `ElevenLabs error: ${errText}` }), {
        status: 502,
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // 4. Subir el audio a Supabase Storage (bucket 'reports', privado)
    const fileName = `${businessId}/${Date.now()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('reports')
      .upload(fileName, audioBytes, {
        contentType: 'audio/mpeg',
        upsert: false,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    // 5. Registrar en audio_reports
    const { error: dbError } = await supabase
      .from('audio_reports')
      .insert({ business_id: businessId, storage_path: fileName });

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
    }

    // 6. Generar signed URL (1 hora)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('reports')
      .createSignedUrl(fileName, 3600);

    if (signedError) {
      return new Response(JSON.stringify({ error: signedError.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ audio_url: signedData.signedUrl, report_path: fileName }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  });

  function buildReportScript(reviewTexts: string, count: number): string {
    // Placeholder — reemplazar con llamada a LLM cuando se decida el proveedor
    return `Hola, aquí tienes tu resumen semanal de Chakana. 
    Tienes ${count} reseñas recientes de tus embajadores. 
    A continuación, los puntos más destacados: ${reviewTexts.substring(0, 800)}. 
    Sigue así, tu comunidad te valora.`;
  }
  ```

- [ ] **Step 3: Deploy**

  ```bash
  npx supabase functions deploy generate-report --project-ref TU_PROJECT_REF
  ```

- [ ] **Step 4: Test con curl**

  ```bash
  curl "https://TU_PROJECT_REF.supabase.co/functions/v1/generate-report?business_id=UUID_DEL_NEGOCIO" \
    -H "Authorization: Bearer TU_ANON_KEY"
  ```

  Esperado: respuesta JSON con `audio_url` apuntando a un `.mp3` en Supabase Storage.

  Pegar el `audio_url` en el navegador y escuchar el audio generado.

- [ ] **Step 5: Commit**

  ```bash
  git add supabase/functions/generate-report/index.ts
  git commit -m "feat(edge): add generate-report — reviews → ElevenLabs TTS → Storage → signed URL"
  ```

---

## Task 11: Índice de Exportaciones (Barrel)

**Files:**
- Create: `src/services/supabase/index.ts`

Este archivo centraliza las exportaciones para que Dev 2 importe desde un solo lugar.

- [ ] **Step 1: Crear `src/services/supabase/index.ts`**

  ```typescript
  export { supabase } from './client';
  export * from './auth.service';
  export * from './reviews.service';
  export * from './businesses.service';
  export * from './storage.service';
  ```

- [ ] **Step 2: Verificar que Dev 2 puede importar así**

  ```typescript
  // En cualquier screen o store de Zustand
  import { signIn, insertReview, getAllBusinesses } from '../services/supabase';
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/services/supabase/index.ts
  git commit -m "chore(supabase): add barrel export for clean imports by Dev 2"
  ```

---

## Task 12: Documentar Contratos para Dev 2

**Files:**
- Create: `memory/supabase-contracts.md`

- [ ] **Step 1: Crear `memory/supabase-contracts.md`**

  ```markdown
  # Contratos Supabase — Dev 4 → Dev 2

  ## Importar desde
  `import { ... } from '../services/supabase';`

  ## Auth
  | Función | Firma | Retorna |
  |---------|-------|---------|
  | `signUp` | `(email, password, displayName)` | `User` |
  | `signIn` | `(email, password)` | `User` |
  | `signOut` | `()` | `void` |
  | `getUser` | `()` | `User \| null` |
  | `onAuthStateChange` | `(callback)` | `unsubscribe fn` |

  ## Reviews
  | Función | Firma | Retorna |
  |---------|-------|---------|
  | `insertReview` | `({ business_id, text, solana_memo_signature? })` | `Review` |
  | `getReviewsByBusiness` | `(businessId)` | `Review[]` |
  | `getMyReviews` | `()` | `Review[]` |

  ## Businesses
  | Función | Firma | Retorna |
  |---------|-------|---------|
  | `getAllBusinesses` | `()` | `Business[]` |
  | `getBusinessById` | `(id)` | `Business` |

  ## Storage / Reportes
  | Función | Firma | Retorna |
  |---------|-------|---------|
  | `getLatestAudioReport` | `(businessId)` | `string (URL) \| null` |

  ## Edge Function: generate-report
  ```
  GET https://PROJECT_REF.supabase.co/functions/v1/generate-report?business_id=UUID
  Authorization: Bearer ANON_KEY

  Response: { audio_url: string, report_path: string }
  ```

  ## Variables de Entorno (compartir con el equipo via canal seguro)
  ```
  EXPO_PUBLIC_SUPABASE_URL=...
  EXPO_PUBLIC_SUPABASE_ANON_KEY=...
  ```
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add memory/supabase-contracts.md
  git commit -m "docs: add Supabase service contracts for Dev 2 integration"
  ```

---

## Checklist de Verificación Final (QA Dev 4)

- [ ] Proyecto Supabase `chakana` activo en dashboard
- [ ] 4 tablas creadas con RLS habilitado: `profiles`, `businesses`, `reviews`, `audio_reports`
- [ ] Trigger `on_auth_user_created` activo (crear usuario → perfil auto-generado)
- [ ] Buckets `avatars` (público) y `reports` (privado) creados
- [ ] `.env.local` con URL y anon key. NO commiteado.
- [ ] `src/types/database.ts` generado y actualizado
- [ ] 5 servicios funcionando: `client`, `auth`, `reviews`, `businesses`, `storage`
- [ ] Edge Function `review-reward-oracle` deployada y webhook configurado
- [ ] Edge Function `generate-report` deployada y testeada con curl
- [ ] `memory/supabase-contracts.md` con contratos para Dev 2

---

## Notas para el Demo (Golden Path de Valentina)

1. **Auth:** Valentina hace signIn → `getUser()` devuelve su perfil con `wallet_pubkey`
2. **Review:** Valentina escribe reseña → `insertReview()` → webhook → oráculo actualiza `aurios_rewarded = 1`
3. **Dev 3 lee** `aurios_rewarded` de la review recién insertada y ejecuta `mintTo` en Solana
4. **Reporte:** Dueño de Raíz Café presiona "Generar" → Dev 2 llama `generate-report` edge function → recibe `audio_url` → reproduce con `expo-av`



-- =============================================
-- CHAKANA -- Canonical roles + Tambu onboarding
-- =============================================

DO $$
DECLARE
  constraint_record RECORD;
  role_attnum SMALLINT;
BEGIN
  SELECT attnum INTO role_attnum
  FROM pg_attribute
  WHERE attrelid = 'public.profiles'::regclass
    AND attname = 'role';

  FOR constraint_record IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'c'
      AND role_attnum = ANY(conkey)
  LOOP
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
  END LOOP;
END $$;

ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'embajador';

UPDATE public.profiles
SET role = CASE
  WHEN role IN ('tambu', 'owner') THEN 'tambu'
  ELSE 'embajador'
END
WHERE role IS DISTINCT FROM CASE
  WHEN role IN ('tambu', 'owner') THEN 'tambu'
  ELSE 'embajador'
END;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('embajador', 'tambu'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_role TEXT := CASE
    WHEN NEW.raw_user_meta_data->>'role' IN ('tambu', 'owner') THEN 'tambu'
    ELSE 'embajador'
  END;
  profile_name TEXT := COALESCE(NULLIF(NEW.raw_user_meta_data->>'display_name', ''), NEW.email, 'Tambu');
  profile_wallet TEXT := NULLIF(NEW.raw_user_meta_data->>'wallet_pubkey', '');
BEGIN
  INSERT INTO public.profiles (id, display_name, role, wallet_pubkey)
  VALUES (
    NEW.id,
    profile_name,
    profile_role,
    profile_wallet
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        role = EXCLUDED.role,
        wallet_pubkey = COALESCE(EXCLUDED.wallet_pubkey, profiles.wallet_pubkey);

  IF profile_role = 'tambu' THEN
    INSERT INTO public.businesses (owner_id, name, wallet_adress, description)
    SELECT
      NEW.id,
      profile_name,
      profile_wallet,
      'Tambu creado desde onboarding Chakana.'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.businesses
      WHERE owner_id = NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

INSERT INTO public.businesses (owner_id, name, wallet_adress, description)
SELECT
  profiles.id,
  COALESCE(NULLIF(profiles.display_name, ''), 'Tambu'),
  profiles.wallet_pubkey,
  'Tambu creado desde onboarding Chakana.'
FROM public.profiles
WHERE profiles.role = 'tambu'
  AND NOT EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.owner_id = profiles.id
  );

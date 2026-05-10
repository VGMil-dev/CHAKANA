-- =============================================
-- CHAKANA -- Seed data for demo
-- =============================================

-- 1. Update businesses with images, categories, locations
UPDATE businesses SET
  image_url = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop',
  category = 'Cafe',
  location = 'Centro, Cuenca'
WHERE id = '20531762-6148-47d3-8eda-f1a4146c01ff';

UPDATE businesses SET
  image_url = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop',
  category = 'Cafe',
  location = 'El Ejido, Cuenca'
WHERE id = '5d3d774b-7a2d-4ec5-b87a-68e8286957f6';

UPDATE businesses SET
  image_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop',
  category = 'Cafe',
  location = 'Remigio Crespo, Cuenca'
WHERE id = '8adb5eb1-86e9-4221-8834-0d0ab54b0575';

-- 2. Seed products for Raiz Cafe
INSERT INTO products (business_id, name, description, type, price_cents, image_url, active) VALUES
  ('20531762-6148-47d3-8eda-f1a4146c01ff', 'Cafe Especialidad', 'Cafe de origen unico tostado en Cuenca', 'Bebida', 450, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', true),
  ('20531762-6148-47d3-8eda-f1a4146c01ff', 'Cheesecake Andino', 'Cheesecake con frutas andinas de la sierra', 'Postre', 380, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', true),
  ('20531762-6148-47d3-8eda-f1a4146c01ff', 'Tostada Integral', 'Pan tostado con palta y huevo de campo', 'Desayuno', 320, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', true),
  ('20531762-6148-47d3-8eda-f1a4146c01ff', 'Te de Hierbas', 'Infusion de hierbas aromaticas locales', 'Bebida', 250, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', true),
  ('20531762-6148-47d3-8eda-f1a4146c01ff', 'Muffin de Zanahoria', 'Muffin artesanal con nueces y canela', 'Snack', 220, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop', true);

-- 3. Seed products for Tambu Cafe (El Ejido)
INSERT INTO products (business_id, name, description, type, price_cents, image_url, active) VALUES
  ('5d3d774b-7a2d-4ec5-b87a-68e8286957f6', 'Latte con Leche de Almendras', 'Latte cremoso con leche artesanal de almendras', 'Bebida', 520, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', true),
  ('5d3d774b-7a2d-4ec5-b87a-68e8286957f6', 'Brownie de Chocolate', 'Brownie casero con chocolate ecuatoriano', 'Postre', 280, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', true),
  ('5d3d774b-7a2d-4ec5-b87a-68e8286957f6', 'Cappuccino Clasico', 'Cappuccino con espuma densa y cafe de altura', 'Bebida', 380, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', true);

-- 4. Seed products for Tambu Cafe (Remigio Crespo)
INSERT INTO products (business_id, name, description, type, price_cents, image_url, active) VALUES
  ('8adb5eb1-86e9-4221-8834-0d0ab54b0575', 'Cold Brew Tropical', 'Cold brew infuionado con maracuya y naranja', 'Bebida', 480, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', true),
  ('8adb5eb1-86e9-4221-8834-0d0ab54b0575', 'Empanada de Viento', 'Empanada frita artesanal con queso fresco', 'Snack', 200, 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&h=400&fit=crop', true),
  ('8adb5eb1-86e9-4221-8834-0d0ab54b0575', 'Smoothie Verde', 'Smoothie de espinaca, platano y miel de abeja', 'Bebida', 420, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop', true),
  ('8adb5eb1-86e9-4221-8834-0d0ab54b0575', 'Galletas de Avena', 'Galletas artesanales con avena y chips de chocolate', 'Snack', 180, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', true);

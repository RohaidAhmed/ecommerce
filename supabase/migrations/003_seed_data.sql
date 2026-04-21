-- supabase/migrations/003_seed_data.sql
-- Development seed — safe to run multiple times (uses ON CONFLICT DO NOTHING)

-- ============================================================
-- CATEGORIES
-- ============================================================
insert into public.categories (id, name, slug, parent_id) values
  ('11111111-0000-0000-0000-000000000001', 'Men',         'men',         null),
  ('11111111-0000-0000-0000-000000000002', 'Women',       'women',       null),
  ('11111111-0000-0000-0000-000000000003', 'Accessories', 'accessories', null),
  ('11111111-0000-0000-0000-000000000004', 'Sale',        'sale',        null),
  -- sub-categories
  ('11111111-0000-0000-0000-000000000011', 'Men T-Shirts',  'men-t-shirts',  '11111111-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000012', 'Men Outerwear', 'men-outerwear', '11111111-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000021', 'Women Dresses', 'women-dresses', '11111111-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000022', 'Women Tops',    'women-tops',    '11111111-0000-0000-0000-000000000002')
on conflict (id) do nothing;

-- ============================================================
-- PRODUCTS
-- ============================================================
insert into public.products (id, name, slug, description, price, compare_at_price, category_id, inventory_count, is_published, images) values
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Classic Crew Neck Tee',
    'classic-crew-neck-tee',
    'A timeless essential crafted from 100% organic cotton. Relaxed fit, pre-washed for extra softness.',
    29.99, 39.99,
    '11111111-0000-0000-0000-000000000011',
    120, true,
    array['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Merino Wool Pullover',
    'merino-wool-pullover',
    'Fine-gauge merino for year-round comfort. Naturally temperature-regulating and incredibly soft.',
    89.99, null,
    '11111111-0000-0000-0000-000000000001',
    45, true,
    array['https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Quilted Bomber Jacket',
    'quilted-bomber-jacket',
    'Lightweight quilted insulation with a clean silhouette. Perfect for layering.',
    149.99, 189.99,
    '11111111-0000-0000-0000-000000000012',
    30, true,
    array['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    'Linen Midi Dress',
    'linen-midi-dress',
    'Breathable linen blend in a relaxed midi silhouette. Side pockets included.',
    79.99, null,
    '11111111-0000-0000-0000-000000000021',
    60, true,
    array['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000005',
    'Ribbed Cropped Top',
    'ribbed-cropped-top',
    'Stretchy ribbed fabric with a flattering cropped cut. Pairs with everything.',
    34.99, 44.99,
    '11111111-0000-0000-0000-000000000022',
    95, true,
    array['https://images.unsplash.com/photo-1594938298603-c8148c4b4de0?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000006',
    'Canvas Tote Bag',
    'canvas-tote-bag',
    'Heavy-duty canvas with reinforced handles. 15L capacity. The only bag you''ll ever need.',
    24.99, null,
    '11111111-0000-0000-0000-000000000003',
    200, true,
    array['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000007',
    'Leather Minimal Wallet',
    'leather-minimal-wallet',
    'Full-grain leather slim wallet. Holds 8 cards and cash. Ages beautifully.',
    49.99, 65.00,
    '11111111-0000-0000-0000-000000000003',
    75, true,
    array['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800']
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000008',
    'Oversized Graphic Tee',
    'oversized-graphic-tee',
    'Drop-shoulder fit with original hand-drawn print. Heavyweight 280gsm cotton.',
    39.99, null,
    '11111111-0000-0000-0000-000000000004',
    55, true,
    array['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800']
  )
on conflict (id) do nothing;
-- ── Seed categories ──────────────────────────────────────────
insert into public.categories (id, name, slug) values
  ('11111111-0000-0000-0000-000000000001', 'Clothing',     'clothing'),
  ('11111111-0000-0000-0000-000000000002', 'Electronics',  'electronics'),
  ('11111111-0000-0000-0000-000000000003', 'Home & Living', 'home-living'),
  ('11111111-0000-0000-0000-000000000004', 'Sports',       'sports'),
  ('11111111-0000-0000-0000-000000000005', 'Books',        'books'),
  ('11111111-0000-0000-0000-000000000006', 'Beauty',       'beauty')
on conflict (slug) do nothing;

-- ── Seed products ────────────────────────────────────────────
insert into public.products
  (name, slug, description, price, compare_at_price, category_id, inventory_count, is_published, images)
values
  (
    'Classic Leather Jacket',
    'classic-leather-jacket',
    'A timeless leather jacket crafted from full-grain cowhide. Features YKK zippers, a quilted lining, and two interior pockets. Ages beautifully with wear.',
    249.00, 329.00,
    '11111111-0000-0000-0000-000000000001',
    15, true,
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800']
  ),
  (
    'Merino Wool Sweater',
    'merino-wool-sweater',
    'Ultra-soft 100% Merino wool crewneck. Naturally temperature-regulating and machine washable. Available in 8 muted tones.',
    89.00, null,
    '11111111-0000-0000-0000-000000000001',
    32, true,
    ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800']
  ),
  (
    'Wireless Noise-Cancelling Headphones',
    'wireless-noise-cancelling-headphones',
    '40-hour battery life, hybrid ANC, and custom-tuned 40mm drivers. Foldable design with premium carry case included.',
    189.00, 249.00,
    '11111111-0000-0000-0000-000000000002',
    8, true,
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']
  ),
  (
    'Mechanical Keyboard TKL',
    'mechanical-keyboard-tkl',
    'Tenkeyless layout with hot-swappable switches, PBT keycaps, and per-key RGB. USB-C detachable cable.',
    129.00, null,
    '11111111-0000-0000-0000-000000000002',
    20, true,
    ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800']
  ),
  (
    'Ceramic Pour-Over Set',
    'ceramic-pour-over-set',
    'Hand-thrown stoneware dripper with matching server. Includes 40 unbleached filters. Makes 2–4 cups per brew.',
    68.00, null,
    '11111111-0000-0000-0000-000000000003',
    25, true,
    ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800']
  ),
  (
    'Linen Duvet Cover',
    'linen-duvet-cover',
    'Stonewashed 100% French linen. Gets softer with every wash. OEKO-TEX certified. Available in King and Queen.',
    145.00, 180.00,
    '11111111-0000-0000-0000-000000000003',
    12, true,
    ARRAY['https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800']
  ),
  (
    'Running Shoes Ultra',
    'running-shoes-ultra',
    'Carbon-plated midsole with responsive foam. Engineered mesh upper. Stack height 38mm / 33mm. For road and light trail.',
    159.00, null,
    '11111111-0000-0000-0000-000000000004',
    18, true,
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']
  ),
  (
    'Yoga Mat Pro',
    'yoga-mat-pro',
    '6mm natural rubber mat with microfiber top layer. Non-slip, sweat-absorbent, and alignment line markings. 183cm × 68cm.',
    79.00, null,
    '11111111-0000-0000-0000-000000000004',
    40, true,
    ARRAY['https://images.unsplash.com/photo-1601925228361-f24d9e35df6a?w=800']
  ),
  (
    'Atomic Habits',
    'atomic-habits',
    'James Clear''s #1 New York Times bestseller. The definitive guide to building good habits and breaking bad ones. Hardcover.',
    24.00, null,
    '11111111-0000-0000-0000-000000000005',
    50, true,
    ARRAY['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800']
  ),
  (
    'Vitamin C Serum 20%',
    'vitamin-c-serum-20',
    'Stabilised L-ascorbic acid with vitamin E and ferulic acid. Brightens, firms, and protects. 30ml dropper bottle.',
    45.00, 60.00,
    '11111111-0000-0000-0000-000000000006',
    35, true,
    ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800']
  )
on conflict (slug) do nothing;
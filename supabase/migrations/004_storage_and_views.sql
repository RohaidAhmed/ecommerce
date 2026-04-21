-- supabase/migrations/004_storage_and_views.sql

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Product images bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- RLS for storage — anyone can read, only admins can upload
create policy "Product images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Product images: admin upload"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Product images: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Aggregated product ratings
create or replace view public.product_ratings as
select
  product_id,
  round(avg(rating), 1) as avg_rating,
  count(*)              as review_count
from public.reviews
group by product_id;

-- Cart total per user
create or replace view public.cart_totals as
select
  ci.cart_id,
  sum(p.price * ci.quantity) as subtotal,
  sum(ci.quantity)            as item_count
from public.cart_items ci
join public.products p on p.id = ci.product_id
group by ci.cart_id;
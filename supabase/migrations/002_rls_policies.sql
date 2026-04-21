-- supabase/migrations/002_rls_policies.sql

-- ============================================================
-- PROFILES
-- ============================================================
alter table public.profiles enable row level security;

create policy "Profiles: public read"
  on public.profiles for select
  using (true);

create policy "Profiles: own update"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profiles: admin full access"
  on public.profiles for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- CATEGORIES
-- ============================================================
alter table public.categories enable row level security;

create policy "Categories: public read"
  on public.categories for select
  using (true);

create policy "Categories: admin write"
  on public.categories for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- PRODUCTS
-- ============================================================
alter table public.products enable row level security;

create policy "Products: public read published"
  on public.products for select
  using (is_published = true);

create policy "Products: admin full access"
  on public.products for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- CARTS
-- ============================================================
alter table public.carts enable row level security;

create policy "Carts: own cart only"
  on public.carts for all
  using (auth.uid() = id);

-- ============================================================
-- CART ITEMS
-- ============================================================
alter table public.cart_items enable row level security;

create policy "Cart items: own cart only"
  on public.cart_items for all
  using (
    cart_id = auth.uid()
  );

-- ============================================================
-- ORDERS
-- ============================================================
alter table public.orders enable row level security;

create policy "Orders: own orders read"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Orders: own insert"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Orders: admin full access"
  on public.orders for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- ORDER ITEMS
-- ============================================================
alter table public.order_items enable row level security;

create policy "Order items: read own orders"
  on public.order_items for select
  using (
    order_id in (
      select id from public.orders where user_id = auth.uid()
    )
  );

create policy "Order items: admin full access"
  on public.order_items for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- REVIEWS
-- ============================================================
alter table public.reviews enable row level security;

create policy "Reviews: public read"
  on public.reviews for select
  using (true);

create policy "Reviews: authenticated insert"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Reviews: own update/delete"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Reviews: own delete"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ============================================================
-- WISHLISTS
-- ============================================================
alter table public.wishlists enable row level security;

create policy "Wishlists: own wishlist only"
  on public.wishlists for all
  using (auth.uid() = user_id);
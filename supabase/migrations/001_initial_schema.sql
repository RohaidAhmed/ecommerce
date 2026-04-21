-- supabase/migrations/001_initial_schema.sql
-- Run via: supabase db push  OR  paste into Supabase SQL editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  role        text not null default 'customer'
                   check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  parent_id   uuid references public.categories(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id                uuid    primary key default gen_random_uuid(),
  name              text    not null,
  slug              text    unique not null,
  description       text,
  price             numeric(10,2) not null check (price >= 0),
  compare_at_price  numeric(10,2) check (compare_at_price >= 0),
  category_id       uuid references public.categories(id) on delete set null,
  inventory_count   int     not null default 0 check (inventory_count >= 0),
  is_published      boolean not null default false,
  images            text[]  not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_products_slug        on public.products(slug);
create index idx_products_category    on public.products(category_id);
create index idx_products_is_published on public.products(is_published);

-- ============================================================
-- CARTS (one per user — cart id = user id)
-- ============================================================
create table public.carts (
  id         uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CART ITEMS
-- ============================================================
create table public.cart_items (
  id         uuid    primary key default gen_random_uuid(),
  cart_id    uuid    not null references public.carts(id) on delete cascade,
  product_id uuid    not null references public.products(id) on delete cascade,
  variant_id uuid    null,
  quantity   int     not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create index idx_cart_items_cart on public.cart_items(cart_id);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id                       uuid    primary key default gen_random_uuid(),
  user_id                  uuid    not null references auth.users(id),
  status                   text    not null default 'pending'
                                   check (status in ('pending','processing','shipped','delivered','cancelled')),
  total_amount             numeric(10,2) not null check (total_amount >= 0),
  stripe_payment_intent_id text,
  shipping_address         jsonb,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status  on public.orders(status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id         uuid    primary key default gen_random_uuid(),
  order_id   uuid    not null references public.orders(id) on delete cascade,
  product_id uuid    not null references public.products(id),
  quantity   int     not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

create index idx_order_items_order on public.order_items(order_id);

-- ============================================================
-- REVIEWS
-- ============================================================
create table public.reviews (
  id         uuid    primary key default gen_random_uuid(),
  product_id uuid    not null references public.products(id) on delete cascade,
  user_id    uuid    not null references auth.users(id) on delete cascade,
  rating     int     not null check (rating between 1 and 5),
  body       text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index idx_reviews_product on public.reviews(product_id);

-- ============================================================
-- WISHLISTS
-- ============================================================
create table public.wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_wishlists_user on public.wishlists(user_id);

-- ============================================================
-- updated_at trigger helper
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
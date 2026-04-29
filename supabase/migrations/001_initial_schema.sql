-- Profiles (extends auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  role        text default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz default now()
);
-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Categories
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  parent_id  uuid references categories(id),
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text unique not null,
  description      text,
  price            numeric(10,2) not null,
  compare_at_price numeric(10,2),
  category_id      uuid references categories(id),
  inventory_count  int default 0,
  is_published     boolean default false,
  images           text[],
  created_at       timestamptz default now()
);

-- Carts (1 per user)
create table public.carts (
  id         uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Cart Items
create table public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid references carts(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity   int not null default 1 check (quantity > 0),
  unique (cart_id, product_id)
);

-- Orders
create table public.orders (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid references auth.users(id),
  status                   text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  total_amount             numeric(10,2) not null,
  stripe_payment_intent_id text,
  shipping_address         jsonb,
  created_at               timestamptz default now()
);

-- Order Items
create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity   int not null,
  unit_price numeric(10,2) not null
);

-- Reviews
create table public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id    uuid references auth.users(id),
  rating     int check (rating between 1 and 5),
  body       text,
  created_at timestamptz default now(),
  unique (product_id, user_id)
);

-- Wishlists
create table public.wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id),
  product_id uuid references products(id),
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- ── RLS ─────────────────────────────────────────
alter table profiles   enable row level security;
alter table products   enable row level security;
alter table categories enable row level security;
alter table carts      enable row level security;
alter table cart_items enable row level security;
alter table orders     enable row level security;
alter table order_items enable row level security;
alter table reviews    enable row level security;
alter table wishlists  enable row level security;

-- Profiles
create policy "Own profile" on profiles for all using (id = auth.uid());

-- Categories & Products: public read
create policy "Public read categories" on categories for select using (true);
create policy "Public read published products" on products for select using (is_published = true);
create policy "Admin full access products" on products for all
  using ((select role from profiles where id = auth.uid()) = 'admin');

-- Cart: own cart only
create policy "Own cart" on carts for all using (id = auth.uid());
create policy "Own cart items" on cart_items for all using (cart_id = auth.uid());

-- Orders
create policy "Own orders" on orders for select using (user_id = auth.uid());
create policy "Admin read all orders" on orders for select
  using ((select role from profiles where id = auth.uid()) = 'admin');
create policy "Admin update orders" on orders for update
  using ((select role from profiles where id = auth.uid()) = 'admin');

-- Order items: readable if you own the order
create policy "Own order items" on order_items for select
  using (exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid()));

-- Reviews: public read, auth write own
create policy "Public read reviews" on reviews for select using (true);
create policy "Own reviews" on reviews for all using (user_id = auth.uid());

-- Wishlists: own
create policy "Own wishlist" on wishlists for all using (user_id = auth.uid());
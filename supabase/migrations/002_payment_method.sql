alter table public.orders
  add column if not exists payment_method text default 'cod'
    check (payment_method in ('cod', 'card', 'easypaisa', 'jazzcash'));
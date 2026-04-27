-- supabase/migrations/005_rpc_functions.sql
-- Helper RPC called after a successful payment to decrement inventory

create or replace function public.decrement_inventory(
  p_product_id uuid,
  p_quantity   int
)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set    inventory_count = greatest(0, inventory_count - p_quantity)
  where  id = p_product_id;
end;
$$;
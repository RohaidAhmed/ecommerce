create or replace function decrement_inventory(
  product_id uuid,
  qty int
)
returns void
language plpgsql
as $$
begin
  update products
  set inventory = greatest(inventory - qty, 0)
  where id = product_id;
end;
$$;
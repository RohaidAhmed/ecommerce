drop function if exists decrement_inventory(uuid, integer);
create or replace function decrement_inventory(
  p_product_id uuid,
  p_quantity int
)
returns void
language plpgsql
as $$
begin
  update products
  set inventory = greatest(inventory - p_quantity, 0)
  where id = p_product_id;
end;
$$;
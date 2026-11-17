-- Coffee Shop | curtidas públicas e anônimas por produto.
-- Execute no SQL Editor do seu projeto Supabase (uma vez).
-- Sem e-mail, senha ou nome; cada sessão anônima tem um ID próprio.
-- A contagem é global, não uma simulação por navegador.
create table if not exists public.coffee_product_likes (
  product_id text not null check (product_id in ('espresso','latte','cappuccino','coldbrew','croissant','crocafe','cookie','mocca','sanduiche')),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, user_id)
);
create index if not exists coffee_product_likes_product_idx on public.coffee_product_likes (product_id);
alter table public.coffee_product_likes enable row level security;
-- Clients cannot see user IDs or write to the table directly.
revoke all on table public.coffee_product_likes from public, anon, authenticated;

-- Exposes only aggregated totals and whether the caller liked each product.
create or replace function public.coffee_likes_snapshot()
returns table(product_id text, likes bigint, liked boolean)
language sql stable security definer set search_path=''
as $$
  select p.id, count(l.user_id)::bigint, coalesce(bool_or(l.user_id = auth.uid()), false)
  from unnest(array[
    'espresso','latte','cappuccino','coldbrew','croissant','crocafe',
    'cookie','mocca','sanduiche'
  ]::text[]) as p(id)
  left join public.coffee_product_likes l on l.product_id=p.id
  group by p.id
$$;
revoke all on function public.coffee_likes_snapshot() from public, anon, authenticated;
grant execute on function public.coffee_likes_snapshot() to anon, authenticated;

-- Atomic toggle; each anonymous user can like each product at most once.
create or replace function public.coffee_toggle_like(p_product_id text)
returns boolean
language plpgsql volatile security definer set search_path=''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Autenticação necessária para curtir' using errcode='28000';
  end if;
  if p_product_id is null or p_product_id not in (
    'espresso','latte','cappuccino','coldbrew','croissant','crocafe',
    'cookie','mocca','sanduiche'
  ) then
    raise exception 'Produto inválido' using errcode='22023';
  end if;
  -- Serializes concurrent toggles from the same identity for one product.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text || ':' || p_product_id, 0)
  );
  delete from public.coffee_product_likes
  where product_id=p_product_id and user_id=v_user_id;
  if found then return false; end if;
  insert into public.coffee_product_likes(product_id,user_id) values(p_product_id,v_user_id);
  return true;
end
$$;
revoke all on function public.coffee_toggle_like(text) from public, anon, authenticated;
grant execute on function public.coffee_toggle_like(text) to authenticated;

-- Coffee Shop V2 | Editable product catalog and explicit admin allowlist.
-- No public registration can grant staff privileges. Admin IDs must be approved manually.
-- Run once before publishing catalog sync / admin.html.
create table if not exists public.coffee_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role='admin'),
  approved_at timestamptz not null default now()
);
alter table public.coffee_staff enable row level security;
revoke all on public.coffee_staff from public, anon, authenticated;

create or replace function public.coffee_is_admin()
returns boolean language sql stable security definer set search_path=''
as $$
  select auth.uid() is not null and exists(
    select 1 from public.coffee_staff s
    where s.user_id=auth.uid() and s.role='admin'
  );
$$;
revoke all on function public.coffee_is_admin() from public, anon, authenticated;
-- Returns false for unauthenticated users; safe for public catalog RLS policies.
grant execute on function public.coffee_is_admin() to anon, authenticated;

create table if not exists public.coffee_catalog (
  product_id text primary key check (product_id ~ '^[a-z][a-z0-9-]{1,39}$'),
  category text not null check(category in ('bebidas','padaria','doces','salgados')),
  image_key text not null check(image_key in ('latte','croissant','espresso','cappuccino','coldbrew','hero-food','bokeh')),
  price_cents integer not null check(price_cents between 100 and 100000),
  name_pt text not null check(length(name_pt) between 2 and 90 and name_pt !~ '[<>]'),
  name_en text not null check(length(name_en) between 2 and 90 and name_en !~ '[<>]'),
  name_es text not null check(length(name_es) between 2 and 90 and name_es !~ '[<>]'),
  desc_pt text not null check(length(desc_pt) between 2 and 240 and desc_pt !~ '[<>]'),
  desc_en text not null check(length(desc_en) between 2 and 240 and desc_en !~ '[<>]'),
  desc_es text not null check(length(desc_es) between 2 and 240 and desc_es !~ '[<>]'),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.coffee_catalog
(product_id,category,image_key,price_cents,name_pt,name_en,name_es,desc_pt,desc_en,desc_es)
values
('espresso','bebidas','espresso',990,'Espresso','Espresso','Espresso','Café intenso e encorpado.','Bold, full-bodied coffee.','Café intenso y con cuerpo.'),
('latte','bebidas','latte',1690,'Latte Clássico','Classic Latte','Latte clásico','Espresso, leite vaporizado e creme aveludado.','Espresso, steamed milk, and silky foam.','Espresso, leche vaporizada y espuma aterciopelada.'),
('cappuccino','bebidas','cappuccino',1590,'Cappuccino','Cappuccino','Cappuccino','Espresso, leite cremoso e toque de cacau.','Espresso, creamy milk, and a hint of cocoa.','Espresso, leche cremosa y un toque de cacao.'),
('coldbrew','bebidas','coldbrew',1790,'Cold Brew','Cold Brew','Cold Brew','Café gelado, suave e refrescante.','Smooth and refreshing iced coffee.','Café frío, suave y refrescante.'),
('croissant','padaria','croissant',1290,'Croissant Tradicional','Classic Croissant','Croissant tradicional','Massa folhada, leve e crocante.','Light, flaky, buttery pastry.','Hojaldre liviano y crocante.'),
('crocafe','padaria','croissant',1890,'Croissant de Café','Coffee Croissant','Croissant de café','Croissant amanteigado com recheio cremoso.','Buttery croissant with a creamy filling.','Croissant de manteca con relleno cremoso.'),
('cookie','doces','croissant',1190,'Cookie da Casa','House Cookie','Cookie de la casa','Chocolate e bordas levemente crocantes.','Chocolate and lightly crisp edges.','Chocolate y bordes apenas crocantes.'),
('mocca','doces','latte',1890,'Mocha Especial','Special Mocha','Mocha especial','Espresso, chocolate e leite cremoso.','Espresso, chocolate, and creamy milk.','Espresso, chocolate y leche cremosa.'),
('sanduiche','salgados','croissant',2690,'Sanduíche da Casa','House Sandwich','Sándwich de la casa','Pão artesanal, queijo e tomate.','Artisan bread, cheese, and tomato.','Pan artesanal, queso y tomate.')
on conflict(product_id) do nothing;

alter table public.coffee_catalog enable row level security;
revoke all on public.coffee_catalog from public, anon, authenticated;
grant select on public.coffee_catalog to anon, authenticated;
grant insert on public.coffee_catalog to authenticated;
grant update (category,image_key,price_cents,name_pt,name_en,name_es,desc_pt,desc_en,desc_es,active) on public.coffee_catalog to authenticated;
create policy "Catalog public active products" on public.coffee_catalog
for select to anon,authenticated using (active or public.coffee_is_admin());
create policy "Only approved staff add products" on public.coffee_catalog
for insert to authenticated with check (public.coffee_is_admin());
create policy "Only approved staff edit products" on public.coffee_catalog
for update to authenticated using (public.coffee_is_admin()) with check (public.coffee_is_admin());

-- Existing likes must follow catalog dynamically, including new products.
alter table public.coffee_product_likes drop constraint if exists coffee_product_likes_product_id_check;
alter table public.coffee_product_likes
add constraint coffee_product_likes_catalog_fk
foreign key (product_id) references public.coffee_catalog(product_id) on delete restrict;

create or replace function public.coffee_likes_snapshot()
returns table(product_id text, likes bigint, liked boolean)
language sql stable security definer set search_path=''
as $$
  select p.product_id, count(l.user_id)::bigint, coalesce(bool_or(l.user_id=auth.uid()),false)
  from public.coffee_catalog p
  left join public.coffee_product_likes l on l.product_id=p.product_id
  where p.active
  group by p.product_id
$$;
revoke all on function public.coffee_likes_snapshot() from public, anon, authenticated;
grant execute on function public.coffee_likes_snapshot() to anon, authenticated;

create or replace function public.coffee_toggle_like(p_product_id text)
returns boolean language plpgsql volatile security definer set search_path=''
as $$
declare v_user_id uuid:=auth.uid();
begin
  if v_user_id is null then
    raise exception 'Anonymous authentication required' using errcode='28000';
  end if;
  if not exists(select 1 from public.coffee_catalog where product_id=p_product_id and active) then
    raise exception 'Invalid or inactive product' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text||':'||p_product_id,0)
  );
  delete from public.coffee_product_likes where product_id=p_product_id and user_id=v_user_id;
  if found then return false; end if;
  insert into public.coffee_product_likes(product_id,user_id) values(p_product_id,v_user_id);
  return true;
end
$$;
revoke all on function public.coffee_toggle_like(text) from public, anon, authenticated;
grant execute on function public.coffee_toggle_like(text) to authenticated;

-- Only staff can see their admin eligibility; no staff list is public.
create or replace function public.coffee_admin_whoami()
returns boolean language sql stable security definer set search_path=''
as $$select public.coffee_is_admin()$$;
revoke all on function public.coffee_admin_whoami() from public, anon, authenticated;
grant execute on function public.coffee_admin_whoami() to authenticated;

-- Konsept — ürünler, admin yetkilendirme ve RLS
-- Supabase SQL Editor'de veya `supabase db push` ile çalıştırılabilir.

-- ---------------------------------------------------------------------------
-- 1) Admin kullanıcıları
--    Yetki, "Supabase Auth'ta hesabı olmak" ile DEĞİL, bu tabloda kayıtlı olmakla verilir.
--    Yani birisi (yanlışlıkla açık kalmış bir signup ile bile) hesap oluştursa yazma yetkisi alamaz.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- Bilerek HİÇBİR policy yok: anon ve authenticated bu tabloyu doğrudan okuyamaz/yazamaz.
revoke all on table public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Supabase, public şemadaki yeni fonksiyonlara varsayılan olarak anon'a da EXECUTE verir;
-- "from public" bunu kaldırmaz, bu yüzden anon açıkça belirtilir.
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Ürünler
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'stock_status') then
    create type public.stock_status as enum ('in_stock', 'limited', 'out_of_stock');
  end if;
end $$;

create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null check (char_length(btrim(name)) between 1 and 120),
  slug              text not null unique
                      check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  short_description text not null default '' check (char_length(short_description) <= 300),
  description       text not null default '' check (char_length(description) <= 5000),
  price             numeric(10, 2) not null check (price >= 0),
  unit              text not null default 'kg' check (unit in ('kg', 'adet', 'paket')),
  stock_status      public.stock_status not null default 'in_stock',
  cover_image       text,
  images            text[] not null default '{}',
  featured          boolean not null default false,
  active            boolean not null default true,
  display_order     integer not null default 0 check (display_order >= 0),
  ripeness_enabled  boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_active_order_idx on public.products (active, display_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3) Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.products force row level security;

-- Katman 1 (grant): anon yalnızca okuyabilir; yazma yetkisi hiç verilmez.
revoke all on table public.products from anon;
grant select on table public.products to anon;
grant select, insert, update, delete on table public.products to authenticated;

drop policy if exists "products_public_read_active" on public.products;
drop policy if exists "products_admin_read_all" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;

-- Katman 2 (RLS): herkes yalnızca aktif ürünleri okuyabilir.
create policy "products_public_read_active"
  on public.products for select
  to anon, authenticated
  using (active = true);

-- Yalnızca admin: pasif ürünler dahil hepsini görür ve yönetir.
create policy "products_admin_read_all"
  on public.products for select
  to authenticated
  using (public.is_admin());

create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (public.is_admin());

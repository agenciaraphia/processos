-- Calotim: esquema para Supabase (PostgreSQL), alinhado ao MVP 0.7.
-- Execute no SQL Editor de um projeto Supabase novo.
--
-- Parte B2C (pessoa fisica): tabelas, indices e politicas RLS por dono da conta. Falta apenas
-- testar o isolamento entre usuarios com dados reais antes de publicar.
-- Parte B2B (restaurantes): apenas a estrutura inicial. RLS ativado e nenhuma politica criada,
-- o que bloqueia todo acesso ate que as funcoes/RPC do QR Code sejam desenhadas.
--
-- Valores monetarios ficam em centavos (bigint), como no aplicativo.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- B2C

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- Agenda de pessoas de cada usuario, reaproveitada entre divisoes.
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar text not null default '😀',
  default_weight numeric(8,3) not null default 1 check (default_weight in (1, 2)), -- 1 = pessoa, 2 = casal
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  account_type text not null default 'Outra' check (account_type in ('Restaurante','Viagem','Evento','Outra')),
  place text,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);

-- Participante de uma divisao. A remocao e logica (removed) para preservar o historico.
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  display_name text not null,
  avatar text not null default '😀',
  weight numeric(8,3) not null default 1 check (weight in (1, 2)), -- 1 = pessoa, 2 = casal
  removed boolean not null default false,
  removed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.expense_items (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  title text not null,
  category text check (category is null or category in ('Alimentação','Bebidas','Hospedagem','Transporte','Combustível','Passeios e ingressos','Compras','Outras')),
  quantity numeric(10,3) not null default 1 check (quantity > 0),
  unit_price_cents bigint not null check (unit_price_cents > 0),
  total_cents bigint not null check (total_cents > 0),
  split_mode text not null default 'selected' check (split_mode in ('quantity','selected','weighted','manual')),
  payer_participant_id uuid references public.participants(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quem consome o item. weight guarda a cota usada no momento do lancamento (historico).
create table if not exists public.item_consumers (
  item_id uuid not null references public.expense_items(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  quantity numeric(10,3) check (quantity is null or quantity > 0),
  weight numeric(8,3) check (weight is null or weight > 0),
  primary key (item_id, participant_id)
);

-- Taxas (acrescimos) e descontos. calc_mode percent usa percent, calc_mode fixed usa amount_cents.
create table if not exists public.account_fees (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  title text not null,
  kind text not null default 'fee' check (kind in ('fee','discount')),
  calc_mode text not null default 'percent' check (calc_mode in ('percent','fixed')),
  percent numeric(5,2) check (percent is null or (percent > 0 and percent <= 100)),
  amount_cents bigint check (amount_cents is null or amount_cents > 0),
  payer_participant_id uuid references public.participants(id) on delete set null,
  created_at timestamptz not null default now(),
  check ((calc_mode = 'percent' and percent is not null and amount_cents is null)
      or (calc_mode = 'fixed' and amount_cents is not null and percent is null))
);

create table if not exists public.fee_participants (
  fee_id uuid not null references public.account_fees(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  primary key (fee_id, participant_id)
);

-- Registro informativo de valor entregue ao estabelecimento. Nao movimenta dinheiro.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  note text,
  payment_type text not null default 'restaurant' check (payment_type in ('restaurant','other')),
  paid_at timestamptz not null default now()
);

-- Em qual item ou taxa o valor foi abatido (exatamente um dos dois).
create table if not exists public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  item_id uuid references public.expense_items(id) on delete cascade,
  fee_id uuid references public.account_fees(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  created_at timestamptz not null default now(),
  check ((item_id is not null) <> (fee_id is not null))
);

create index if not exists contacts_owner_idx on public.contacts(owner_id);
create index if not exists accounts_owner_idx on public.accounts(owner_id);
create index if not exists participants_account_idx on public.participants(account_id);
create index if not exists participants_contact_idx on public.participants(contact_id);
create index if not exists expense_items_account_idx on public.expense_items(account_id);
create index if not exists expense_items_payer_idx on public.expense_items(payer_participant_id);
create index if not exists item_consumers_participant_idx on public.item_consumers(participant_id);
create index if not exists account_fees_account_idx on public.account_fees(account_id);
create index if not exists fee_participants_participant_idx on public.fee_participants(participant_id);
create index if not exists payments_account_idx on public.payments(account_id);
create index if not exists payment_allocations_payment_idx on public.payment_allocations(payment_id);
create index if not exists payment_allocations_item_idx on public.payment_allocations(item_id);
create index if not exists payment_allocations_fee_idx on public.payment_allocations(fee_id);

alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.accounts enable row level security;
alter table public.participants enable row level security;
alter table public.expense_items enable row level security;
alter table public.item_consumers enable row level security;
alter table public.account_fees enable row level security;
alter table public.fee_participants enable row level security;
alter table public.payments enable row level security;
alter table public.payment_allocations enable row level security;

-- Funcao auxiliar. security definer evita recursao de RLS ao consultar accounts.
create or replace function public.owns_account(target_account uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.accounts a where a.id = target_account and a.owner_id = (select auth.uid()));
$$;
revoke all on function public.owns_account(uuid) from public, anon;
grant execute on function public.owns_account(uuid) to authenticated;

-- Politicas: cada usuario enxerga e altera somente o que e seu.
create policy profiles_own on public.profiles for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy contacts_own on public.contacts for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy accounts_own on public.accounts for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy participants_own on public.participants for all to authenticated
  using (public.owns_account(account_id)) with check (public.owns_account(account_id));

create policy expense_items_own on public.expense_items for all to authenticated
  using (public.owns_account(account_id)) with check (public.owns_account(account_id));

create policy account_fees_own on public.account_fees for all to authenticated
  using (public.owns_account(account_id)) with check (public.owns_account(account_id));

create policy payments_own on public.payments for all to authenticated
  using (public.owns_account(account_id)) with check (public.owns_account(account_id));

create policy item_consumers_own on public.item_consumers for all to authenticated
  using (exists (select 1 from public.expense_items i where i.id = item_id and public.owns_account(i.account_id)))
  with check (exists (select 1 from public.expense_items i where i.id = item_id and public.owns_account(i.account_id)));

create policy fee_participants_own on public.fee_participants for all to authenticated
  using (exists (select 1 from public.account_fees f where f.id = fee_id and public.owns_account(f.account_id)))
  with check (exists (select 1 from public.account_fees f where f.id = fee_id and public.owns_account(f.account_id)));

create policy payment_allocations_own on public.payment_allocations for all to authenticated
  using (exists (select 1 from public.payments p where p.id = payment_id and public.owns_account(p.account_id)))
  with check (exists (select 1 from public.payments p where p.id = payment_id and public.owns_account(p.account_id)));

-- ---------------------------------------------------------------- B2B (estrutura inicial)

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_members (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner','manager','staff')),
  primary key (restaurant_id, user_id)
);

create table if not exists public.restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  label text not null,
  active boolean not null default true
);

create table if not exists public.restaurant_sessions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  title text not null,
  access_token_hash text not null unique,
  status text not null default 'open' check (status in ('open','closing','closed')),
  created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.restaurant_tables enable row level security;
alter table public.restaurant_sessions enable row level security;

-- B2B: politicas deliberadamente nao criadas. O acesso dos clientes via QR exige funcoes/RPC com
-- validacao de token, limites de quantidade e autorizacao. Nao habilite acesso publico irrestrito.
-- Nunca coloque a chave service_role no JavaScript do navegador.

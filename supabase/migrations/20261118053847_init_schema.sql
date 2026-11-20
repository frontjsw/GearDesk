-- 조직(렌탈 업체) 단위. 멀티테넌시의 기준점.
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- 어떤 유저가 어느 조직 소속이고 역할이 뭔지. auth.users는 Supabase가 이미 만들어둔 테이블.
create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index on organization_members (user_id);
create index on organization_members (organization_id);

-- 품목 마스터 (예: "캐논 R5 카메라"라는 상품 자체)
create table products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  brand text,
  name text not null,
  category text[],
  price_12h numeric(12,2),
  discount_price_12h numeric(12,2),
  price_24h numeric(12,2),
  discount_price_24h numeric(12,2),
  components text[],
  images text[],
  created_at timestamptz not null default now()
);
create index on products (organization_id);

-- 실물 자산 단위 (예: "R5 카메라 1호기", "R5 카메라 2호기" - 같은 상품이어도 개별 대여 단위가 따로 있음)
create table asset_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  asset_tag text,
  status text not null default 'available' check (status in ('available', 'rented', 'maintenance', 'lost', 'retired')),
  condition_note text,
  purchased_at date,
  created_at timestamptz not null default now(),
  unique (organization_id, asset_tag)
);
create index on asset_units (organization_id);

create table customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  memo text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
create index on customers (organization_id);

-- 계약 1건 = 고객 1명이 특정 기간 동안 품목들을 빌리는 건
create table contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  contract_number text not null,
  customer_id uuid not null references customers(id),
  status text not null default 'reserved' check (status in ('reserved', 'active', 'returned', 'overdue', 'cancelled')),
  start_at timestamptz,
  end_at timestamptz,
  pickup_method text check (pickup_method in ('store', 'delivery')),
  return_method text check (return_method in ('store', 'delivery')),
  deposit_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  memo text,
  created_at timestamptz not null default now(),
  unique (organization_id, contract_number)
);
create index on contracts (organization_id);

-- 계약 안의 개별 라인 (계약 1건에 카메라 1대 + 렌즈 1개처럼 여러 줄이 붙을 수 있음)
create table contract_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  contract_id uuid not null references contracts(id) on delete cascade,
  product_id uuid not null references products(id),
  asset_unit_id uuid not null references asset_units(id),
  price_type text check (price_type in ('12h', '24h')),
  unit_price numeric(12,2),
  line_total numeric(12,2)
);
create index on contract_items (organization_id);
create index on contract_items (contract_id);

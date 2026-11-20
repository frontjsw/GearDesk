-- 모든 조직 범위 테이블에 RLS를 켠다. 켜는 순간 기본값은 "전부 차단"이고,
-- 아래 정책(policy)에 해당하는 요청만 허용된다.
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table products enable row level security;
alter table asset_units enable row level security;
alter table customers enable row level security;
alter table contracts enable row level security;
alter table contract_items enable row level security;

-- organizations: 내가 속한 조직만 조회, 수정은 owner만, insert/delete는 RLS로 직접 열지 않음
-- (조직 생성은 아래 부트스트랩 함수로만 가능 — 마이그레이션 0003 참고)
create policy "Members can select their organization" on organizations
  for select to authenticated
  using (id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Owners can update their organization" on organizations
  for update to authenticated
  using (id in (select organization_id from organization_members where user_id = auth.uid() and role = 'owner'))
  with check (id in (select organization_id from organization_members where user_id = auth.uid() and role = 'owner'));

-- organization_members: 내 조직 로스터는 볼 수 있음. 멤버 추가/변경/삭제는 owner만.
create policy "Members can select their org roster" on organization_members
  for select to authenticated
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

create policy "Owners can insert members" on organization_members
  for insert to authenticated
  with check (organization_id in (select organization_id from organization_members where user_id = auth.uid() and role = 'owner'));

create policy "Owners can update members" on organization_members
  for update to authenticated
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid() and role = 'owner'))
  with check (organization_id in (select organization_id from organization_members where user_id = auth.uid() and role = 'owner'));

create policy "Owners can delete members" on organization_members
  for delete to authenticated
  using (organization_id in (select organization_id from organization_members where user_id = auth.uid() and role = 'owner'));

-- 아래 도메인 테이블들(products, asset_units, customers, contracts, contract_items)은
-- 전부 같은 패턴: "내 조직 소속이면 select/insert/update/delete 다 가능".
-- owner/staff 구분을 둘지는 Phase 8(직원 권한)에서 다시 다듬기로 함 — 지금은 조직 멤버면 동일 권한.
do $$
declare
  t text;
begin
  for t in select unnest(array['products', 'asset_units', 'customers', 'contracts', 'contract_items'])
  loop
    execute format($f$
      create policy "Members can select %1$s" on %1$s for select to authenticated
      using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

      create policy "Members can insert %1$s" on %1$s for insert to authenticated
      with check (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

      create policy "Members can update %1$s" on %1$s for update to authenticated
      using (organization_id in (select organization_id from organization_members where user_id = auth.uid()))
      with check (organization_id in (select organization_id from organization_members where user_id = auth.uid()));

      create policy "Members can delete %1$s" on %1$s for delete to authenticated
      using (organization_id in (select organization_id from organization_members where user_id = auth.uid()));
    $f$, t);
  end loop;
end $$;

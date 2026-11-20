-- organization_members 자신을 보호하는 정책이 자기 테이블을 서브쿼리로 참조하면
-- RLS 체크가 또 그 서브쿼리를 트리거해서 무한 재귀가 난다(42P17).
-- security definer 함수는 "함수 소유자(테이블 오너, RLS를 우회함)" 권한으로 실행되기 때문에
-- 내부 쿼리가 RLS를 다시 트리거하지 않는다 — 이걸로 재귀 고리를 끊는다.
create or replace function is_member_of_org(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from organization_members
    where organization_id = target_org_id and user_id = auth.uid()
  );
$$;

create or replace function is_owner_of_org(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from organization_members
    where organization_id = target_org_id and user_id = auth.uid() and role = 'owner'
  );
$$;

drop policy "Members can select their org roster" on organization_members;
drop policy "Owners can insert members" on organization_members;
drop policy "Owners can update members" on organization_members;
drop policy "Owners can delete members" on organization_members;

create policy "Members can select their org roster" on organization_members
  for select to authenticated
  using (is_member_of_org(organization_id));

create policy "Owners can insert members" on organization_members
  for insert to authenticated
  with check (is_owner_of_org(organization_id));

create policy "Owners can update members" on organization_members
  for update to authenticated
  using (is_owner_of_org(organization_id))
  with check (is_owner_of_org(organization_id));

create policy "Owners can delete members" on organization_members
  for delete to authenticated
  using (is_owner_of_org(organization_id));

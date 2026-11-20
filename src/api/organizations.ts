import { supabase } from "../lib/supabaseClient";

export type CurrentMembership = {
  organizationId: string;
  organizationName: string;
  role: "owner" | "staff";
};

export async function getCurrentMembership(): Promise<CurrentMembership | null> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(name)")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    organizationId: data.organization_id,
    organizationName: data.organizations!.name,
    role: data.role as "owner" | "staff",
  };
}

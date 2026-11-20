import { supabase } from "../lib/supabaseClient";
import type { Database } from "../types/database";

type Customer = Database["public"]["Tables"]["customers"]["Row"];
type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
// 고객 리스트 조회
export const getCustomers = async (
  organizationId: string,
): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// 고객 리스트 추가
export const createCustomer = async (
  input: CustomerInsert,
): Promise<Customer> => {
  const { data, error } = await supabase
    .from("customers")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 고객 리스트 업데이트
export const updateCustomer = async (
  id: string,
  input: Partial<CustomerInsert>,
): Promise<Customer> => {
  const { data, error } = await supabase
    .from("customers")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 고객 리스트 삭제
export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) throw error;
};

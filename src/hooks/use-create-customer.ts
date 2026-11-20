import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../api/customers";
import { useOrganization } from "../context/organization-context";
import type { Database } from "../types/database";

type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
type NewCustomerInput = Omit<CustomerInsert, "organization_id">;

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { membership } = useOrganization();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (input: NewCustomerInput) =>
      createCustomer({ ...input, organization_id: membership!.organizationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", membership?.organizationId],
      });
    },
  });

  return { mutate, isPending, isError, error };
};

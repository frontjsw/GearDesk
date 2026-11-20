import { useQuery } from "@tanstack/react-query";
import { useOrganization } from "../context/organization-context";
import { getCustomers } from "../api/customers";

export const useCustomers = () => {
  const { membership, loading: organizationLoading } = useOrganization();

  const { data, isLoading: queryIsLoading } = useQuery({
    queryKey: ["customers", membership?.organizationId],
    queryFn: () => getCustomers(membership!.organizationId),
    enabled: !!membership,
  });

  return { data, isLoading: organizationLoading || queryIsLoading };
};

import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentMembership,
  type CurrentMembership,
} from "../api/organizations";
import { useAuth } from "./auth-context";

interface OrganizationContextValue {
  membership: CurrentMembership | null;
  loading: boolean;
}
const OrganizationContext = createContext<OrganizationContextValue | undefined>(
  undefined,
);

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, loading: authLoading } = useAuth();
  const [membership, setMembership] = useState<CurrentMembership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      setMembership(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchMembership = async () => {
      try {
        const data = await getCurrentMembership();
        setMembership(data);
      } catch (error) {
        console.error(error);
        setMembership(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMembership();
  }, [session, authLoading]);

  const value = { membership, loading };
  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const ctx = useContext(OrganizationContext);

  if (!ctx) throw new Error("useOrganization Error");

  return ctx;
};

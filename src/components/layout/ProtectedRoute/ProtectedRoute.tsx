import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../context/auth-context";

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
};

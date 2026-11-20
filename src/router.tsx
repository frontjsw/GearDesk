import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage/DashboardPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute/ProtectedRoute";
import CustomersListPage from "./pages/customers/CustomersListPage/CustomersListPage";
import AppLayout from "./components/layout/AppLayout/AppLayout";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/customers", element: <CustomersListPage /> },
        ],
      },
    ],
  },
]);

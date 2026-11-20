import React from "react";
import { useAuth } from "../../../context/auth-context";

const DashboardPage = () => {
  const { signOut } = useAuth();
  return (
    <div>
      <button onClick={() => signOut()}>logout</button>
    </div>
  );
};

export default DashboardPage;

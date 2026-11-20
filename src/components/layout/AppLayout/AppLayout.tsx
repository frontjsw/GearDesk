import { Outlet } from "react-router";
import "./AppLayout.scss";
import Lnb from "../Lnb/Lnb";
const AppLayout = () => {
  return (
    <div className="app-layout">
      <Lnb />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;

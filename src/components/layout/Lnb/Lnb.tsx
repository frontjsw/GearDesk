import { NavLink } from "react-router";
import "./Lnb.scss";
import { House, Users } from "lucide-react";
const Lnb = () => {
  return (
    <div className="lnb">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to={"/"} className="nav-link">
            <House width={18} height={18} />
            <div className="nav-title">대시보드</div>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/customers"} className="nav-link">
            <Users width={18} height={18} />
            <div className="nav-title">고객관리</div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Lnb;

import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import "../css/Navbar.css";

const UserNavbar = () => {
    const { auth } = useAuth();
    const logout = useLogout();

    const logOut = async () => {
        await logout();
    }
  return (
    <nav className="Nav">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/problemset">Problems</NavLink>
        </li>
        <li>
          <NavLink to="/submissions">Submissions</NavLink>
        </li>
        <li>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
        </li>
      </ul>
      <ul>
        <li>
        <NavLink to={`/user/${auth?.user}`}>Profile</NavLink>
        </li>
        <li>
          <span onClick={logOut}>Logout</span>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;

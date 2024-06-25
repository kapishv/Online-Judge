import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
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
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/register">Register</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

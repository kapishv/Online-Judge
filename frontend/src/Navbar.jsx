import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="Nav">
      <ul className="NavLinks">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/problems">Problems</Link>
        </li>
        <li>
          <Link to="/submissions">Submissions</Link>
        </li>
        <li>
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
      </ul>
      <ul className="AuthButtons">
        <li>
          <Link to="/login" className="LoginButton">Login</Link>
        </li>
        <li>
          <Link to="/register" className="RegisterButton">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

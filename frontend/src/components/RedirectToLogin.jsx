import React from "react";
import { Link } from "react-router-dom";

const RedirectToLogin = () => {
  return (
    <>
      <h1>You are not logged in</h1>
      <Link to="/login">Go to Login Page</Link>
    </>
  );
};

export default RedirectToLogin;

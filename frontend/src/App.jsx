import React from "react";
import { Route, Routes } from "react-router-dom";
import "./css/App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Problems from "./components/Problems";
import Submissions from "./components/Submissions";
import Leaderboard from "./components/Leaderboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Unauthorized from "./components/Unauthorized";
import Miss from "./components/Miss";
import RedirectToLogin from "./components/RedirectToLogin";
import useWindowSize from "./hooks/useWindowSize";
import SecureRoute from "./components/SecureRoute";
import UserNavbar from "./components/UserNavBar";

const ROLES = {
  User: 2001,
  Admin: 5150,
};

const App = () => {
  const { width } = useWindowSize();

  return (
    <div className="App">
      <Header title="CodeCraft" width={width} />
      <SecureRoute
        roleMap={new Map([[ROLES.User, UserNavbar]])}
        DefaultComp={Navbar}
      />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problemset" element={<Problems />} />
          <Route
            path="/submissions"
            element={
              <SecureRoute
                roleMap={new Map([[ROLES.User, Submissions]])}
                DefaultComp={RedirectToLogin}
              />
            }
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Miss />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

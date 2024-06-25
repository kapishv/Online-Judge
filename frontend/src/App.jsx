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
import Unauthorized from './components/Unauthorized';
import Miss from "./components/Miss";
import RequireAuth from "./components/RequireAuth";
import useWindowSize from "./hooks/useWindowSize";
import useAxiosFetch from "./hooks/useAxiosFetch";

const ROLES = {
  User: 2001,
  Admin: 5150,
};

const App = () => {
  const { width } = useWindowSize();

  return (
    <div className="App">
      <Header title="CodeCraft" width={width} />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problemset" element={<Problems />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/submissions" element={<Submissions />} />
          </Route>
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

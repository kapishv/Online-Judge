import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import Miss from "./Miss";
import Home from "./Home";
import Problems from "./Problems";
import Submissions from "./Submissions";
import Leaderboard from "./Leaderboard";
import NewProblem from "./NewProblem";
import EditProblem from "./EditProblem";
import Codespace from "./Codespace";
import Profile from "./Profile";
import "../css/Layout.css";

const Layout = () => {
  const { auth } = useContext(AuthContext);
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problemset" element={<Problems />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/user/:username" element={<Profile />} />
        {auth.isAdmin ? (
          <>
            <Route path="/problem" element={<NewProblem />} />
            <Route path="/problemset/:title" element={<EditProblem />} />
          </>
        ) : auth.isAuthenticated ? (
          <>
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/problemset/:title" element={<Codespace />} />
          </>
        ) : (
          <>
            <Route path="/problemset/:title" element={<Codespace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="*" element={<Miss />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Layout;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import Problems from "./Problems.jsx";
import Submissions from "./Submissions.jsx";
import Leaderboard from "./Leaderboard.jsx";
import Login from "./Login.jsx";
import Profile from "./Profile.jsx";
import Register from "./Register.jsx";
import Footer from "./Footer.jsx";
import Miss from "./Miss.jsx";
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';


const App = () => {
  const { width } = useWindowSize();

  return (
    <Router>
      <div className="App">
        <Header title="CodeCraft" width={width} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Miss />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

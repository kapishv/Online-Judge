import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Home from "./Home";
import Problems from "./Problems";
import Submissions from "./Submissions";
import Leaderboard from "./Leaderboard";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import Footer from "./Footer";
import Miss from "./Miss";
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

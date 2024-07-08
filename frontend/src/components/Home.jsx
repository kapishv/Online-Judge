import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/Home.css";

const Home = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="home">
      {auth.isAdmin ? (
        <>
          <p>
            Ready to add new problems?{" "}
            <Link to="/problem">Create a new problem</Link>.
          </p>
          <p>
            Problems can be edited now!{" "}
            <Link to="/problemset">Go to problems</Link>.
          </p>
          <p>
            Observe the competition!{" "}
            <Link to="/leaderboard">Check the leaderboard</Link>.
          </p>
        </>
      ) : auth.isAuthenticated ? (
        <>
          <p>
            Start solving problems now!{" "}
            <Link to="/problemset">Go to problems</Link>.
          </p>
          <p>
            Join the competition!{" "}
            <Link to="/leaderboard">Check the leaderboard</Link>.
          </p>
          <p>
            View your submissions <Link to="/submissions">here</Link>.
          </p>
        </>
      ) : (
        <>
          <p>
            Welcome! Please <Link to="/login">log in</Link> to start solving or
            creating problems.
          </p>
          <p>
            Checkout the problems now!{" "}
            <Link to="/problemset">Go to problems</Link>.
          </p>
          <p>
            Observe the competition!{" "}
            <Link to="/leaderboard">Check the leaderboard</Link>.
          </p>
        </>
      )}
    </div>
  );
};

export default Home;

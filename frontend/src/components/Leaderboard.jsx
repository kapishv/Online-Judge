import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { get } = useAxiosPrivate();

  useEffect(() => {
    const { makeRequest, cleanup } = get("/leaderboard");

    const fetchLeaderboardData = async () => {
      const data = await makeRequest();
      if (data) {
        console.log(data);
        const formattedData = formatLeaderboardData(data);
        setLeaderboardData(formattedData);
      }
    };

    fetchLeaderboardData();

    return () => {
      cleanup();
    };
  }, []);

  const formatLeaderboardData = (data) => {
    return data
      .map((user) => {
        const totalCodingScore = user.solved.reduce(
          (acc, problem) => acc + problem.codingScore,
          0
        );
        const totalProblemsSolved = user.solved.length;
        const easyProblemsSolved = user.solved.filter(
          (problem) => problem.difficulty === "Easy"
        ).length;
        const mediumProblemsSolved = user.solved.filter(
          (problem) => problem.difficulty === "Medium"
        ).length;
        const hardProblemsSolved = user.solved.filter(
          (problem) => problem.difficulty === "Hard"
        ).length;

        return {
          ...user,
          totalCodingScore,
          totalProblemsSolved,
          easyProblemsSolved,
          mediumProblemsSolved,
          hardProblemsSolved,
        };
      })
      .sort((a, b) => b.totalCodingScore - a.totalCodingScore);
  };

  return (
    <Container className="leaderboard-container">
      <h2>Leaderboard</h2>
      <Row className="leaderboard-header d-none d-md-flex">
        <Col md={2} className="header-item">
          Rank
        </Col>
        <Col md={1} className="header-item">
          Score
        </Col>
        <Col md={3} className="header-item">
          Username
        </Col>
        <Col md={1} className="header-item">
          Easy
        </Col>
        <Col md={1} className="header-item">
          Med
        </Col>
        <Col md={1} className="header-item">
          Hard
        </Col>
        <Col md={2} className="header-item">
          Total
        </Col>
      </Row>
      {leaderboardData.length ? (
        leaderboardData.map((user, i) => (
          <Card key={i} className="mb-3 leaderboard-card">
            <Card.Body>
              <Row className="leaderboard-content">
                <Col xs={12} md={2} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">Rank:</span>
                  <span className="attribute-value">{i + 1}</span>
                </Col>
                <Col xs={12} md={1} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">
                    Coding Score:
                  </span>
                  <span className="attribute-value">
                    {user.totalCodingScore}
                  </span>
                </Col>
                <Col xs={12} md={3} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">Username:</span>
                  <Link
                    to={`/user/${user.username}`}
                    className="attribute-value leaderboard-link leaderboard-title"
                  >
                    {user.username}
                  </Link>
                </Col>
                <Col xs={12} md={1} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">Easy:</span>
                  <span className="attribute-value">
                    {user.easyProblemsSolved}
                  </span>
                </Col>
                <Col xs={12} md={1} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">Medium:</span>
                  <span className="attribute-value">
                    {user.mediumProblemsSolved}
                  </span>
                </Col>
                <Col xs={12} md={1} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">Hard:</span>
                  <span className="attribute-value">
                    {user.hardProblemsSolved}
                  </span>
                </Col>
                <Col xs={12} md={2} className="leaderboard-attribute">
                  <span className="attribute-label d-md-none">Total:</span>
                  <span className="attribute-value">
                    {user.totalProblemsSolved}
                  </span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No Leaderboard data to display</p>
      )}
    </Container>
  );
};

export default Leaderboard;

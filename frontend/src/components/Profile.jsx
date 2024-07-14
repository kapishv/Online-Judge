import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import Rendering from "./Rendering";
import axios from "../api/axios";
import Miss from "./Miss";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../css/Profile.css"; // Import the CSS file for custom styling

const COLORS = ["#008C99", "#FFB300", "#E61919"];

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true); // Add loading state
  const isMounted = useRef(false); // Add ref to track if component is mounted

  useEffect(() => {
    const fetchUserData = async () => {
      if (isMounted.current) return; // Prevents the function from running more than once
      isMounted.current = true; // Set the ref to true after the first run

      try {
        const response = await axios.get(`/user/${username}`);
        const data = response.data;
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchUserData();
  }, [username]);

  if (loading) {
    return <Rendering />;
  }

  if (!userData) {
    return <Miss />;
  }

  const totalCodingScore = userData.solved.reduce(
    (total, problem) => total + problem.codingScore,
    0
  );

  const solvedProblemsByDifficulty = userData.solved.reduce((acc, problem) => {
    if (!acc[problem.difficulty]) {
      acc[problem.difficulty] = 0;
    }
    acc[problem.difficulty]++;
    return acc;
  }, {});

  const pieData = Object.keys(solvedProblemsByDifficulty).map((key) => ({
    name: key,
    value: solvedProblemsByDifficulty[key],
  }));

  const totalProblemsSolved = userData.solved.length;

  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="#000"
        style={{ fontSize: "35px", fontFamily: "Source Code" }}
      >
        {totalProblemsSolved}
      </text>
    );
  };

  return (
    <Container fluid className="profile-container">
      <Row>
        <Col md={8} className="profile-details">
          <Card>
            <Card.Body>
              <Card.Title as="h2">{userData.username}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {userData.email}
              </Card.Text>
              {userData.solved.length > 0 && (
                <>
                  <Card.Text>
                    <strong>Coding Score:</strong> {totalCodingScore}
                  </Card.Text>
                  <Card.Title as="h4">Problems Solved:</Card.Title>
                  <ListGroup variant="flush">
                    {userData.solved.map((problem, index) => (
                      <ListGroup.Item key={index}>
                        <Link to={`/problemset/${problem.title}`}>
                          {problem.title}
                        </Link>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="profile-chart">
          <Card>
            <Card.Body>
              {userData.solved.length > 0 && (
                <>
                  <Card.Title as="h4">
                    Problems Solved by Difficulty:
                  </Card.Title>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false} // Disable the label lines
                        label={renderCustomLabel} // Use the custom label renderer
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        formatter={(value, entry) =>
                          `${entry.payload.name}: ${entry.payload.value}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

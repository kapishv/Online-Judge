import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import axios from "../api/axios";
import Problem from "./Problem";
import Rendering from "./Rendering"; // Import the Rendering component
import "../css/Problems.css";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [sortBy, setSortBy] = useState("codingScore");
  const [loading, setLoading] = useState(true); // Add loading state
  const isMounted = useRef(false); // Add ref to track if component is mounted

  useEffect(() => {
    const fetchProblems = async () => {
      if (isMounted.current) return; // Prevents the function from running more than once
      isMounted.current = true; // Set the ref to true after the first run

      try {
        const response = await axios.get("/problemset");
        const data = response.data;
        if (data) {
          setProblems(data);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems(searchTerm);
  }, [problems, searchTerm, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filterProblems = (term) => {
    let filtered = problems;

    if (term) {
      filtered = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }

    filtered = sortProblems(filtered, sortBy);
    setFilteredProblems(filtered);
  };

  const sortProblems = (problemsList, criteria) => {
    const sorted = [...problemsList].sort((a, b) => {
      if (criteria === "title") {
        return a.title.localeCompare(b.title);
      } else if (criteria === "difficulty") {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else if (criteria === "codingScore") {
        return a.codingScore - b.codingScore;
      }
      return 0;
    });
    return sorted;
  };

  if (loading) {
    return <Rendering />; // Show the Rendering component when loading
  }

  return (
    <Container className="problems-list-container">
      <h2>Problem List</h2>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title or tag"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Form.Select value={sortBy} onChange={handleSortChange}>
          <option value="title">Sort by Title</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="codingScore">Sort by Coding Score</option>
        </Form.Select>
      </InputGroup>
      <Row className="problems-header d-none d-md-flex">
        <Col className="header-item">Coding Score</Col>
        <Col className="header-item">Difficulty</Col>
        <Col className="header-item">Title</Col>
        <Col className="header-item">Tags</Col>
      </Row>
      {filteredProblems.length ? (
        <ListGroup className="problems-list">
          {filteredProblems.map((p, i) => (
            <Problem key={i} p={p} />
          ))}
        </ListGroup>
      ) : (
        <p>No problems to display</p>
      )}
    </Container>
  );
};

export default Problems;

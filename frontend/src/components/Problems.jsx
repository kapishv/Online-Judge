import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Problem from "./Problem";
import '../css/Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const { get } = useAxiosPrivate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [sortBy, setSortBy] = useState("codingScore");

  useEffect(() => {
    const { makeRequest, cleanup } = get("/problemset");

    const fetchProblems = async () => {
      const data = await makeRequest();
      if (data) {
        console.log("Data:", data);
        setProblems(data);
      }
    };

    fetchProblems();

    return () => {
      cleanup();
    };
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

import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import Submission from "./Submission";
import "../css/Submissions.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await axiosPrivate.get("/submissions");
      const data = response.data;
      if (data) {
        setSubmissions(data);
      }
    };
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, selectedLanguage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage !== "all") {
      filtered = filtered.filter((s) => s.lang === selectedLanguage);
    }

    filtered.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setFilteredSubmissions(filtered);
  };

  return (
    <Container className="submissions-list-container">
      <h2>Submission List</h2>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Form.Select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="all">All</option>
          <option value="java">Java</option>
          <option value="c_cpp">C++</option>
          <option value="python">Python</option>
        </Form.Select>
      </InputGroup>
      <Row className="submissions-header d-none d-md-flex">
        <Col md={3} className="header-item">
          Problem
        </Col>
        <Col md={2} className="header-item">
          Language
        </Col>
        <Col md={3} className="header-item">
          Result
        </Col>
        <Col md={3} className="header-item">
          Submitted At
        </Col>
        <Col md={1} className="header-item">
          Code
        </Col>
      </Row>
      {filteredSubmissions.length ? (
        <ListGroup className="submissions-list">
          {filteredSubmissions.map((submission, i) => (
            <Submission key={i} submission={submission} />
          ))}
        </ListGroup>
      ) : (
        <p>No Submissions to display</p>
      )}
    </Container>
  );
};

export default Submissions;

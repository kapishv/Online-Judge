import { Row, Col, Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../css/Problem.css';

const Problem = ({ p }) => {
  return (
    <Card className="mb-3 problem-card">
      <Card.Body>
        <Link to={`/problemset/${p.title}`} className="problem-link">
          <Row className="problem-content">
            <Col xs={12} md={3} className="problem-attribute problem-codingScore">
              <span className="attribute-label d-md-none">Coding Score:</span>
              <span className="attribute-value">{p.codingScore}</span>
            </Col>
            <Col xs={12} md={3} className="problem-attribute problem-difficulty">
              <span className="attribute-label d-md-none">Difficulty:</span>
              <span className={`attribute-value ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
            </Col>
            <Col xs={12} md={3} className="problem-attribute problem-title">
              <span className="attribute-label d-md-none">Title:</span>
              <span className="attribute-value">{p.title}</span>
            </Col>
            <Col xs={12} md={3} className="problem-attribute problem-tags">
              <span className="attribute-label d-md-none">Tags:</span>
              <div className="attribute-value">
                {p.tags.map((tag, index) => (
                  <Badge key={index} pill bg="secondary" className="problem-tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Problem;

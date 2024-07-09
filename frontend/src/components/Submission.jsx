import { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFileCode, FaCopy, FaCheck } from "react-icons/fa";
import "../css/Submission.css";

const Submission = ({ submission }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (showCode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCode]);

  const showCodeModal = () => {
    setShowCode(true);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(submission.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const formatLanguage = (lang) => {
    switch (lang) {
      case "c_cpp":
        return "C++";
      case "java":
        return "Java";
      case "python":
        return "Python";
      default:
        return lang;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getSubmissionClass = () => {
    if (submission.status.success) {
      return "success";
    } else if (submission.status.error === "Wrong Answer") {
      return "error";
    } else {
      return "";
    }
  };

  return (
    <>
      <Card className={`mb-3 submission-card ${getSubmissionClass()}`}>
        <Card.Body>
          <Row className="submission-content">
            <Col
              xs={12}
              md={3}
              className="submission-attribute submission-title"
            >
              <span className="attribute-label d-md-none">Problem:</span>
              <Link
                to={`/problemset/${submission.title}`}
                className="submission-link"
              >
                <span className="attribute-value">{submission.title}</span>
              </Link>
            </Col>
            <Col
              xs={12}
              md={2}
              className="submission-attribute submission-lang"
            >
              <span className="attribute-label d-md-none">Language:</span>
              <span className="attribute-value">
                {formatLanguage(submission.lang)}
              </span>
            </Col>
            <Col
              xs={12}
              md={3}
              className="submission-attribute submission-status"
            >
              <span className="attribute-label d-md-none">Result:</span>
              <span className="attribute-value">
                {submission.status.success
                  ? "Accepted"
                  : `${submission.status.error} on test case ${
                      submission.status.pass + 1
                    }`}
              </span>
            </Col>
            <Col
              xs={12}
              md={3}
              className="submission-attribute submission-date"
            >
              <span className="attribute-label d-md-none">Submitted At:</span>
              <span className="attribute-value">
                {formatDate(submission.timestamp)}
              </span>
            </Col>
            <Col
              xs={12}
              md={1}
              className="submission-attribute submission-code"
            >
              <span className="attribute-label d-md-none">Code:</span>
              <Button variant="dark" onClick={showCodeModal}>
                <FaFileCode />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Modal show={showCode} onHide={() => setShowCode(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {submission.status.success
              ? "Accepted"
              : `${submission.status.error} on test case ${
                  submission.status.pass + 1
                }`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="dark" onClick={copyCodeToClipboard}>
              {copied ? <FaCheck /> : <FaCopy />}
            </Button>
          </div>
          <pre>{submission.code}</pre>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Submission;

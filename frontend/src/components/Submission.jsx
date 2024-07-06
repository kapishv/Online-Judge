import { useState, useEffect } from "react";
import { FaFileCode, FaTimes, FaCopy } from "react-icons/fa";
import "../css/Submission.css";

const Submission = ({ submission }) => {
  const [showCode, setShowCode] = useState(false);

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

  const toggleShowCode = () => {
    setShowCode(!showCode);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(submission.code);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "code-overlay") {
      setShowCode(false);
    }
  };

  const formatLanguage = (lang) => {
    switch (lang) {
      case "c_cpp":
        return "C++";
      case "javascript":
        return "JavaScript";
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
    } else if (submission.status.error) {
      switch (submission.status.error) {
        case "Time Limit Exceeded":
          return "error-timeout";
        case "Compilation Error":
          return "error-compile";
        default:
          return "error";
      }
    } else {
      return "";
    }
  };

  return (
    <li className={`submission-item ${getSubmissionClass()}`}>
      <div className="submission-content">
        <div className="submission-attribute submission-title">
          {submission.title}
        </div>
        <div className="submission-attribute submission-lang">
          {formatLanguage(submission.lang)}
        </div>
        <div className="submission-attribute submission-status">
          {submission.status.success ? "Success" : "Failed"}
        </div>
        <div className="submission-attribute submission-date">
          {formatDate(submission.timestamp)}
        </div>
        <button onClick={toggleShowCode} className="view-code-button">
          {showCode ? "Hide Code" : <FaFileCode />}
        </button>
      </div>
      {showCode && (
        <div className="code-overlay" onClick={handleOverlayClick}>
          <div className="code-container">
            <button onClick={() => setShowCode(false)} className="close-button">
              <FaTimes />
            </button>
            <button onClick={copyCodeToClipboard} className="copy-button">
              <FaCopy />
            </button>
            <pre>{submission.code}</pre>
          </div>
        </div>
      )}
    </li>
  );
};

export default Submission;

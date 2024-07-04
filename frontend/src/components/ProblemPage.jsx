import "../css/ProblemPage.css";
import React, { useRef, useState } from "react";

function ProblemPage({ p }) {
  const sampleInputRef = useRef(null);
  const sampleOutputRef = useRef(null);
  const [notification, setNotification] = useState("");

  const copyToClipboard = (ref, type) => {
    navigator.clipboard.writeText(ref.current.textContent).then(() => {
      setNotification(`${type} copied to clipboard!`);
      setTimeout(() => setNotification(""), 3000);
    });
  };

  return (
    <div className="problem-page">
      {notification && (
        <div className={`copy-notification show`}>{notification}</div>
      )}
      <h1>{p?.title}</h1>
      <div className="problem-details">
        <span className="detail">Difficulty: {p?.difficulty}</span>
        <span className="detail">Coding Score: {p?.codingScore}</span>
        <div className="detail">
          <span>Tags: </span>
          {p?.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h2>Description</h2>
      <p>
        {p?.description.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
      <h2>Input Format</h2>
      <p>
        {p?.inputFormat.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
      <h2>Output Format</h2>
      <p>
        {p?.outputFormat.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
      <h2>Constraints</h2>
      <p>
        {p?.constraints.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
      <h2>
        Sample Input
        <button
          type="button"
          className="copy-button"
          onClick={() => copyToClipboard(sampleInputRef, "Sample Input")}
        >
          Copy
        </button>
      </h2>
      <pre ref={sampleInputRef}>{p?.sampleInput}</pre>
      <h2>
        Sample Output
        <button
          type="button"
          className="copy-button"
          onClick={() => copyToClipboard(sampleOutputRef, "Sample Output")}
        >
          Copy
        </button>
      </h2>
      <pre ref={sampleOutputRef}>{p?.sampleOutput}</pre>
      {p?.explanation && (
        <>
          <h2>Explanation</h2>
          <p>
            {p?.explanation.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </>
      )}
    </div>
  );
}

export default ProblemPage;

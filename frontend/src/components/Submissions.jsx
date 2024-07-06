import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Submission from "./Submission";
import "../css/Submissions.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const { get } = useAxiosPrivate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  useEffect(() => {
    const { makeRequest, cleanup } = get("/submissions");

    const fetchSubmissions = async () => {
      const data = await makeRequest();
      if (data) {
        setSubmissions(data);
      }
    };

    fetchSubmissions();

    return () => {
      cleanup();
    };
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

    setFilteredSubmissions(filtered);
  };

  return (
    <div className="submissions-list-container">
      <h2>Submission List</h2>
      <div className="options">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="all">All</option>
          <option value="javascript">JavaScript</option>
          <option value="c_cpp">C++</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="submissions-header">
        <div className="header-item">Problem</div>
        <div className="header-item">Language</div>
        <div className="header-item">Result</div>
        <div className="header-item">Submitted At</div>
        <div className="header-item">Code</div>
      </div>
      {filteredSubmissions.length ? (
        <ul className="submissions-list">
          {filteredSubmissions.map((submission, i) => (
            <Submission key={i} submission={submission} />
          ))}
        </ul>
      ) : (
        <p>No Submissions to display</p>
      )}
    </div>
  );
};

export default Submissions;

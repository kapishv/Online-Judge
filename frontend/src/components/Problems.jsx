import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Problem from "./Problem";
import "../css/Problems.css";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const { get } = useAxiosPrivate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [sortBy, setSortBy] = useState("title");

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Filtering problems based on search term
  const filterProblems = (term) => {
    let filtered = problems;

    if (term) {
      filtered = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Sort problems based on selected criteria
    filtered = sortProblems(filtered, sortBy);

    setFilteredProblems(filtered);
  };

  // Sorting problems based on selected criteria
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
    <div className="problems-list-container">
      <h2>Problem List</h2>
      <div className="options">
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="title">Sort by Title</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="codingScore">Sort by Coding Score</option>
        </select>
      </div>
      <div className="problems-header">
        <div className="header-item">Coding Score</div>
        <div className="header-item">Difficulty</div>
        <div className="header-item">Title</div>
        <div className="header-item">Tags</div>
      </div>
      {filteredProblems.length ? (
        <ul className="problems-list">
          {filteredProblems.map((p, i) => (
            <Problem key={i} p={p} />
          ))}
        </ul>
      ) : (
        <p>No problems to display</p>
      )}
    </div>
  );
};

export default Problems;

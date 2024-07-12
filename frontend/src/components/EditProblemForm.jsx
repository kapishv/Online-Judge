import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import { FaTimes } from "react-icons/fa";
import "../css/EditProblemForm.css";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const EditProblemForm = ({ p, sp }) => {
  const navigate = useNavigate();

  // Function to handle adding a new hidden testcase
  const addHiddenTestcase = () => {
    sp((prev) => ({
      ...prev,
      hiddenTestcases: [
        ...prev.hiddenTestcases,
        { input: "", output: "" }, // Initial empty values
      ],
    }));
  };

  // Function to handle deleting a hidden testcase by index
  const deleteHiddenTestcase = (index) => {
    sp((prev) => ({
      ...prev,
      hiddenTestcases: prev.hiddenTestcases.filter((_, i) => i !== index),
    }));
  };

  // Function to handle updating input or output of a hidden testcase by index
  const updateHiddenTestcase = (index, field, value) => {
    sp((prev) => ({
      ...prev,
      hiddenTestcases: prev.hiddenTestcases.map((testcase, i) =>
        i === index ? { ...testcase, [field]: value } : testcase
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.name;
    if (action === "update") {
      await axiosPrivate.put(`/problemset/${p.title}`, p);
    } else if (action === "delete") {
      await axiosPrivate.delete(`/problemset/${p.title}`);
    }
    navigate("/problemset");
  };

  return (
    <div className="EditProblem">
      <h2>Edit Problem</h2>
      <form className="editProblemForm" onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          required
          value={p?.title}
          onChange={(e) => sp((prev) => ({ ...prev, title: e.target.value }))}
        />
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          required
          value={p?.difficulty}
          onChange={(e) =>
            sp((prev) => ({ ...prev, difficulty: e.target.value }))
          }
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <label htmlFor="codingScore">Coding Score:</label>
        <input
          id="codingScore"
          type="number"
          required
          value={p?.codingScore}
          onChange={(e) =>
            sp((prev) => ({ ...prev, codingScore: e.target.value }))
          }
        />
        <label htmlFor="tags">Tags:</label>
        <TagsInput
          value={p?.tags}
          onChange={(t) => sp((prev) => ({ ...prev, tags: t }))}
          inputProps={{ id: "tags", placeholder: "Add a tag" }}
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          required
          value={p?.description}
          onChange={(e) =>
            sp((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <label htmlFor="inputFormat">Input Format:</label>
        <textarea
          id="inputFormat"
          required
          value={p?.inputFormat}
          onChange={(e) =>
            sp((prev) => ({ ...prev, inputFormat: e.target.value }))
          }
        />
        <label htmlFor="outputFormat">Output Format:</label>
        <textarea
          id="outputFormat"
          required
          value={p?.outputFormat}
          onChange={(e) =>
            sp((prev) => ({ ...prev, outputFormat: e.target.value }))
          }
        />
        <label htmlFor="constraints">Constraints:</label>
        <textarea
          id="constraints"
          required
          value={p?.constraints}
          onChange={(e) =>
            sp((prev) => ({ ...prev, constraints: e.target.value }))
          }
        />
        <label htmlFor="sampleInput">Sample Input:</label>
        <textarea
          id="sampleInput"
          required
          value={p?.sampleInput}
          onChange={(e) =>
            sp((prev) => ({ ...prev, sampleInput: e.target.value }))
          }
        />
        <label htmlFor="sampleOutput">Sample Output:</label>
        <textarea
          id="sampleOutput"
          required
          value={p?.sampleOutput}
          onChange={(e) =>
            sp((prev) => ({ ...prev, sampleOutput: e.target.value }))
          }
        />
        <label>Hidden Testcases:</label>
        {p.hiddenTestcases.map((testcase, index) => (
          <div className="new" key={index}>
            <div>
              <p>Hidden Testcase {index + 1}:</p>
              {p.hiddenTestcases.length > 1 && (
                <button
                  type="button"
                  className="deleteTestcase"
                  onClick={() => deleteHiddenTestcase(index)}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <textarea
              required
              value={testcase.input}
              placeholder="Input"
              onChange={(e) =>
                updateHiddenTestcase(index, "input", e.target.value)
              }
            />
            <textarea
              required
              value={testcase.output}
              placeholder="Output"
              onChange={(e) =>
                updateHiddenTestcase(index, "output", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="add-hidden-testcase"
          onClick={addHiddenTestcase}
        >
          Add Hidden Testcase
        </button>
        <label htmlFor="explanation">Explanation (Optional):</label>
        <textarea
          id="explanation"
          value={p?.explanation}
          onChange={(e) =>
            sp((prev) => ({ ...prev, explanation: e.target.value }))
          }
        />
        <div>
          <button type="submit" name="update" className="update-button">
            Update
          </button>
          <button type="submit" name="delete" className="delete-button">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProblemForm;

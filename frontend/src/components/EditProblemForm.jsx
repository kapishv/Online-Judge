import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/EditProblemForm.css";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const EditProblemForm = ({ p, sp }) => {
  const navigate = useNavigate();
  const { put, del } = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.name;

    if (action === "update") {
      const { makeRequest } = put(
        `/problemset/${location.pathname.split("/").pop()}`,
        p
      );
      const data = await makeRequest();
      if (data) {
        console.log("Edited Problem:", data);
      }
    } else if (action === "delete") {
      const { makeRequest } = del(
        `/problemset/${location.pathname.split("/").pop()}`
      );
      const data = await makeRequest();
      if (data) {
        console.log("Deleted Problem:", data);
      }
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
        {/* <label htmlFor="hiddenTestcasesInput">
          Hidden Testcases Input (Upload File):
        </label>
        <input
          id="hiddenTestcasesInput"
          type="file"
          onChange={(e) => sp((prev) => ({ ...prev, hiddenTestcasesInput: e.target.values[0] }))}
        />
        <label htmlFor="hiddenTestcasesOutput">
          Hidden Testcases Output (Upload File):
        </label>
        <input
          id="hiddenTestcasesOutput"
          type="file"
          onChange={(e) => sp((prev) => ({ ...prev, hiddenTestcasesOutput: e.target.values[0] }))}
        /> */}
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

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect } from "react";
import ProblemPage from "./ProblemPage";
import NewProblemForm from "./NewProblemForm";
import "../css/ResizeHandler.css";

function NewProblem() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [problem, setProblem] = useState({
    title: "Problem Title",
    difficulty: "Easy",
    codingScore: 2,
    tags: ["Add a tag"],
    description: "Description of the problem",
    inputFormat: "Input Format of the problem",
    outputFormat: "Output Format of the problem",
    constraints: "Constraints of the problem",
    solution: "Solution of the problem",
    sampleInput: "Sample Input of the problem",
    sampleOutput: "Sample Output of the problem",
    hiddenTestcases: [{ input: "Hidden Input", output: "Hidden Output" }],
    explanation: "Explanation of the problem",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isSmallScreen) {
    return (
      <div
        style={{
          padding: "10px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div>
          <ProblemPage p={problem} />
        </div>
        <div>
          <NewProblemForm p={problem} sp={setProblem} />
        </div>
      </div>
    );
  }
  return (
    <PanelGroup direction="horizontal" style={{ padding: "10px" }}>
      <Panel
        defaultSize={50}
        minSize={30}
        maxSize={70}
        style={{ overflow: "auto", height: `calc(100vh - 130px)` }}
      >
        <ProblemPage p={problem} />
      </Panel>
      <PanelResizeHandle>
        <div className="resize-handle" />
      </PanelResizeHandle>
      <Panel
        defaultSize={50}
        minSize={30}
        maxSize={70}
        style={{ overflow: "auto", height: `calc(100vh - 130px)` }}
      >
        <NewProblemForm p={problem} sp={setProblem} />
      </Panel>
    </PanelGroup>
  );
}

export default NewProblem;

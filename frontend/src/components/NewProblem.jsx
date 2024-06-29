import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";
import ProblemPage from "./ProblemPage";
import NewProblemForm from "./NewProblemForm";
import "../css/ResizeHandler.css"

function NewProblem() {
  const [problem, setProblem] = useState({
    title: "Problem Title",
    difficulty: "Easy",
    codingScore: 800,
    tags: ["Add a tag"],
    description: "Description of the problem",
    inputFormat: "Input Format of the problem",
    outputFormat: "Output Format of the problem",
    constraints: "Constraints of the problem",
    sampleInput: "Sample Input",
    sampleOutput: "Sample Output",
    // hiddenTestcasesInput: "",
    // hiddenTestcasesOutput: "",
    explanation: "Explanation of the problem"
  });

  return (
    <PanelGroup direction="horizontal">
      <Panel
        defaultSize={50}
        minSize={30}
        maxSize={70}
        style={{ overflow: "auto", height: `100%` }}
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
        style={{ overflow: "auto", height: `100%` }}
      >
        <NewProblemForm p={problem} sp={setProblem}/>
      </Panel>
    </PanelGroup>
  );
}

export default NewProblem;

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProblemPage from "./ProblemPage";
import CodeEditor from "./CodeEditor";
import Miss from "./Miss";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/ResizeHandler.css";

function Codespace() {
  const [problem, setProblem] = useState(null);
  const location = useLocation();
  const { get } = useAxiosPrivate();

  useEffect(() => {
    const { makeRequest, cleanup } = get(
      `/problemset/${location.pathname.split("/").pop()}`
    );

    const fetchProblems = async () => {
      const data = await makeRequest();
      if (data) {
        console.log("Problem:", data);
        setProblem(data);
      }
    };

    fetchProblems();

    return () => {
      cleanup();
    };
  }, []);

  if (problem) {
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
          <CodeEditor/>
        </Panel>
      </PanelGroup>
    );
  }
  return <Miss />;
}

export default Codespace;

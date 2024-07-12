import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProblemPage from "./ProblemPage";
import CodeEditor from "./CodeEditor";
import Miss from "./Miss";
import "../css/ResizeHandler.css";
import axios from "../api/axios";

function Codespace() {
  const { title } = useParams();
  const [problem, setProblem] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await axios.get(`/problemset/${title}`);
      const data = response.data;
      if (data) {
        setProblem(data);
      }
    };
    fetchProblems();
  }, [title]);

  if (problem) {
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
            <CodeEditor p={problem} />
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
          <CodeEditor p={problem} />
        </Panel>
      </PanelGroup>
    );
  }
  return <Miss />;
}

export default Codespace;

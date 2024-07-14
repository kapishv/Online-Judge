import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Rendering from "./Rendering";
import ProblemPage from "./ProblemPage";
import CodeEditor from "./CodeEditor";
import Miss from "./Miss";
import "../css/ResizeHandler.css";
import axios from "../api/axios";

function Codespace() {
  const { title } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const isMounted = useRef(false);

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
      if (isMounted.current) return;
      isMounted.current = true;

      try {
        const response = await axios.get(`/problemset/${title}`);
        const data = response.data;
        if (data) {
          setProblem(data);
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [title]);

  if (loading) {
    return <Rendering />;
  }

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

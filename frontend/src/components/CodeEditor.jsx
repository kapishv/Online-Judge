import { useState, useRef, useEffect, useContext } from "react";
import { axiosPrivate } from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  FaSpinner,
  FaSun,
  FaMoon,
  FaSync,
  FaPlayCircle,
  FaPaperPlane,
  FaTerminal,
} from "react-icons/fa";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "../css/CodeEditor.css";

const CodeEditor = ({ p }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [theme, setTheme] = useState("github");
  const [showConsole, setShowConsole] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState(<div></div>);
  const [verdictText, setVerdictText] = useState(<div></div>);
  const outputRef = useRef(null);
  const verdictRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.focus();
    }
  }, [outputText]);

  useEffect(() => {
    if (verdictRef.current) {
      verdictRef.current.focus();
    }
  }, [verdictText]);

  useEffect(() => {
    if (showConsole) {
      switch (activeTab) {
        case "input":
          if (inputRef.current) inputRef.current.focus();
          break;
        case "output":
          if (outputRef.current) outputRef.current.focus();
          break;
        case "verdict":
          if (verdictRef.current) verdictRef.current.focus();
          break;
        default:
          break;
      }
    }
  }, [showConsole, activeTab]);

  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "github" ? "monokai" : "github"));
  };

  const refreshCode = () => setCode("");

  const handleRun = async () => {
    if (auth.isAuthenticated) {
      setShowConsole(true);
      setActiveTab("output");
      setVerdictText(<div></div>);
      setOutputText(
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
        </div>
      );
      const response = await axiosPrivate.post("/run", {
        input: inputText,
        code: code,
        lang: language,
      });
      const data = response.data;
      if (data) {
        if (data.success) {
          setOutputText(
            <div className="output-div">
              <span className="info-text">Result:</span>
              <span className="result-success">Successful</span>
              <br />
              <span className="info-text">Output:</span>
              <br />
              <pre className="output-text">{data.output}</pre>
            </div>
          );
        } else {
          setOutputText(
            <div className="output-div">
              <span className="info-text">Result:</span>
              <span className="result-error">{data.error}</span>
              <br />
              <span className="info-text">Output:</span>
              <br />
              <pre className="output-text">{data.output}</pre>
            </div>
          );
        }
      }
    } else {
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const handleSubmit = async () => {
    if (auth.isAuthenticated) {
      setShowConsole(true);
      setActiveTab("verdict");
      setOutputText(<div></div>);
      setVerdictText(
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
        </div>
      );
      const response = await axiosPrivate.post(`/submit/${p.title}`, {
        code: code,
        lang: language,
      });
      const data = response.data;
      if (data) {
        if (data.success) {
          setVerdictText(
            <div className="verdict-div">
              <span className="info-text">Result:</span>
              <span className="result-success">Accepted</span>
              <br />
              <span className="info-text">Testcases:</span>
              <br />
              <span className="test-cases">
                {Array.from({ length: data.pass }, (_, i) => (
                  <span key={i} className="test-case-success">
                    Test case {i + 1}
                  </span>
                ))}
              </span>
            </div>
          );
        } else {
          setVerdictText(
            <div className="verdict-div">
              <span className="info-text">Result:</span>
              <span className="result-error">{data.error}</span>
              <br />
              <span className="info-text">Testcases:</span>
              <br />
              <span className="test-cases">
                {Array.from({ length: data.pass }, (_, i) => (
                  <span key={i} className="test-case-success">
                    Test case {i + 1}
                  </span>
                ))}
                <span className="test-case-failure">
                  Test case {data.pass + 1}
                </span>
              </span>
            </div>
          );
        }
      }
    } else {
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  return (
    <div className="code-editor-container">
      <div className="menu-bar">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c_cpp">C++</option>
        </select>
        <div className="buttons">
          <button onClick={switchTheme} className="theme-button">
            {theme == "github" ? <FaMoon /> : <FaSun />}
          </button>
          <button onClick={refreshCode} className="refresh-button">
            <FaSync />
          </button>
        </div>
      </div>
      <div className="editor-container">
        <AceEditor
          mode={language}
          theme={theme}
          value={code}
          onChange={(newCode) => setCode(newCode)}
          name="code-editor"
          className="code-editor"
          editorProps={{ $blockScrolling: true }}
          fontSize={16}
          showPrintMargin={false}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
      <div className="console-and-buttons-container">
        {showConsole && (
          <div className={`console ${showConsole ? "show" : ""}`}>
            <div className="tabs">
              <button
                onClick={() => setActiveTab("input")}
                className={activeTab === "input" ? "active" : ""}
              >
                Input
              </button>
              <button
                onClick={() => setActiveTab("output")}
                className={activeTab === "output" ? "active" : ""}
              >
                Output
              </button>
              <button
                onClick={() => setActiveTab("verdict")}
                className={activeTab === "verdict" ? "active" : ""}
              >
                Verdict
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "input" && (
                <div>
                  <textarea
                    id="input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    ref={inputRef}
                  ></textarea>
                </div>
              )}
              {activeTab === "output" && (
                <div ref={outputRef} tabIndex="0">
                  {outputText}
                </div>
              )}
              {activeTab === "verdict" && (
                <div ref={verdictRef} tabIndex="0">
                  {verdictText}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="main-buttons">
          <button
            className="console-button"
            onClick={() => setShowConsole(!showConsole)}
          >
            <FaTerminal /> Console
          </button>
          <button className="run-button" onClick={handleRun}>
            <FaPlayCircle /> Run
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            <FaPaperPlane /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

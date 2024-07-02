import { useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "../css/CodeEditor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("github");
  const [showConsole, setShowConsole] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [verdictText, setVerdictText] = useState("");
  const outputRef = useRef(null);

  const { post } = useAxiosPrivate();

  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "github" ? "monokai" : "github"));
  };

  const refreshCode = () => setCode("");

  const handleRun = async () => {
    const { makeRequest } = post("/run", {
      input: inputText,
      code: code,
      lang: language,
    });
    const data = await makeRequest();
    if (data) {
      console.log("Run Response:", data);
      setShowConsole(true);
      setActiveTab("output");
      if (outputRef.current) {
        outputRef.current.focus();
      }
      if (data.success) {
        setOutputText(data.output);
      } else {
        setOutputText(data.error);
      }
    }
  };

  const handleSubmit = () => {
    // Add your logic for submitting the code here
    console.log("Submitting code");
  };

  return (
    <div className="code-editor-container">
      <div className="menu-bar">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c_cpp">C++</option>
          {/* Add more languages as needed */}
        </select>
        <div className="buttons">
          <button onClick={switchTheme} className="theme-button">
            Switch Theme
          </button>
          <button onClick={refreshCode} className="refresh-button">
            Refresh Code
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
      <div>
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
                  ></textarea>
                </div>
              )}
              {activeTab === "output" && (
                <div>
                  <div className="output-div" ref={outputRef} tabIndex="0">
                    {outputText}
                  </div>
                </div>
              )}
              {activeTab === "verdict" && (
                <div>
                  <div className="verdict-div">{verdictText}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="main-buttons">
        <button
          className="console-button"
          onClick={() => setShowConsole(!showConsole)}
        >
          Console
        </button>
        <button className="run-button" onClick={handleRun}>
          Run
        </button>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;

import { useState } from "react";
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

  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "github" ? "monokai" : "github"));
  };

  const refreshCode = () => setCode("");

  const handleRun = () => {
    // Add your logic for running the code here
    console.log("Running code");
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
          <option value="c_cpp">C/C++</option>
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
                  <textarea id="input"></textarea>
                </div>
              )}
              {activeTab === "output" && (
                <div>
                  <textarea id="output"></textarea>
                </div>
              )}
              {activeTab === "verdict" && (
                <div>
                  <textarea id="verdict"></textarea>
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

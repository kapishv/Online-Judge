const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const codeDir = path.join(__dirname, "..", "py", "codes");
const inputDir = path.join(__dirname, "..", "py", "inputs");

[codeDir, inputDir].forEach(
  (dir) => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true })
);

const handlePythonRun = async (code, input) => {
  const cleanup = (files) => {
    files.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
  };

  let jobID, codeFilePath, inputFilePath;

  try {
    if (!code) throw new Error("Empty code!");

    jobID = uuid();
    codeFilePath = path.join(codeDir, `${jobID}.py`);
    inputFilePath = path.join(inputDir, `${jobID}.txt`);

    fs.writeFileSync(codeFilePath, code);
    fs.writeFileSync(inputFilePath, input || "");

    // Execute the Python script using spawn
    const execProcess = spawn("python3", [codeFilePath], {
      stdio: ["pipe", "pipe", "inherit"],
    });

    let stdout = "";
    let timeLimitExceeded = false;

    const timeout = setTimeout(() => {
      execProcess.kill();
      timeLimitExceeded = true;
    }, 2000); // 2 seconds timeout

    await new Promise((resolve, reject) => {
      execProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      execProcess.on("close", (code) => {
        clearTimeout(timeout);

        if (timeLimitExceeded) {
          return reject(new Error("Time Limit Exceeded"));
        } else if (code !== 0) {
          return reject(new Error("Runtime Error"));
        } else {
          resolve();
        }
      });

      execProcess.stdin.write(fs.readFileSync(inputFilePath));
      execProcess.stdin.end();
    });

    return { success: true, output: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    cleanup([codeFilePath, inputFilePath]);
  }
};

module.exports = { handlePythonRun };

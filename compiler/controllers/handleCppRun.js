const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const codeDir = path.join(__dirname, "..", "cpp", "codes");
const outputDir = path.join(__dirname, "..", "cpp", "outputs");
const inputDir = path.join(__dirname, "..", "cpp", "inputs");

[codeDir, outputDir, inputDir].forEach(
  (dir) => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true })
);

const handleCppRun = async (code, input) => {
  const cleanup = (files) => {
    files.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
  };

  let jobID, codeFilePath, inputFilePath, outputFilePath;

  try {
    if (!code) throw new Error("Empty code!");

    jobID = uuid();
    codeFilePath = path.join(codeDir, `${jobID}.cpp`);
    inputFilePath = path.join(inputDir, `${jobID}.txt`);
    outputFilePath = path.join(outputDir, `${jobID}.out`);

    fs.writeFileSync(codeFilePath, code);
    fs.writeFileSync(inputFilePath, input || "");

    // Compile the C++ code using spawn
    const compileProcess = spawn("g++", [codeFilePath, "-o", outputFilePath]);
    await new Promise((resolve, reject) => {
      compileProcess.on("close", (code) => {
        if (code !== 0) {
          return reject(new Error("Compilation Error"));
        }
        resolve();
      });
    });

    // Execute the compiled program with input, and handle time limit using spawn
    const execProcess = spawn(path.join(outputDir, `${jobID}.out`), [], {
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
    cleanup([codeFilePath, inputFilePath, outputFilePath]);
  }
};

module.exports = { handleCppRun };

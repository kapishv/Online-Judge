const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const codeDir = path.join(__dirname, "..", "java", "codes");
const outputDir = path.join(__dirname, "..", "java", "outputs");
const inputDir = path.join(__dirname, "..", "java", "inputs");

[codeDir, outputDir, inputDir].forEach(
  (dir) => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true })
);

const getClassName = (code) => {
  const classMatch = code.match(/public\s+class\s+(\w+)|class\s+(\w+)/);
  return classMatch ? classMatch[1] || classMatch[2] : null;
};

const handleJavaRun = async (code, input) => {
  const cleanup = (jobID, files) => {
    if (!jobID) {
      return; // If jobID is undefined or falsy, do nothing
    }
    files.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
    const jobCodeDir = path.join(codeDir, jobID);
    const jobOutputDir = path.join(outputDir, jobID);
    if (fs.existsSync(jobCodeDir)) {
      fs.rmSync(jobCodeDir, { recursive: true, force: true });
    }
    if (fs.existsSync(jobOutputDir)) {
      fs.rmSync(jobOutputDir, { recursive: true, force: true });
    }
  };

  let jobID, className, codeFilePath, classFilePath, inputFilePath;

  try {
    if (!code) {
      return {
        success: false,
        error: "Empty code!",
        output: "No Code provided",
      };
    }

    className = getClassName(code);
    if (!className) {
      return {
        success: false,
        error: "Class name not found!",
        output: "No valid class name found in the code.",
      };
    }

    jobID = uuid();
    codeFilePath = path.join(codeDir, jobID, `${className}.java`);
    classFilePath = path.join(outputDir, jobID, `${className}.class`);
    inputFilePath = path.join(inputDir, `${jobID}.txt`);

    fs.mkdirSync(path.join(codeDir, jobID), { recursive: true });
    fs.mkdirSync(path.join(outputDir, jobID), { recursive: true });

    fs.writeFileSync(codeFilePath, code);
    fs.writeFileSync(inputFilePath, input || "");

    // Compile the Java code using spawn
    const compileProcess = spawn("javac", [
      "-d",
      path.join(outputDir, jobID),
      codeFilePath,
    ]);
    let compileError = "";

    compileProcess.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    await new Promise((resolve, reject) => {
      compileProcess.on("close", (code) => {
        if (code !== 0) {
          compileError = compileError.replace(
            new RegExp(codeFilePath, "g"),
            "file"
          );
          return reject({ error: "Compilation Error", output: compileError });
        }
        resolve();
      });
    });

    // Execute the compiled program with input, and handle time limit using spawn
    const execProcess = spawn(
      "java",
      ["-cp", path.join(outputDir, jobID), className],
      {
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

    let stdout = "";
    let stderr = "";
    let timeLimitExceeded = false;
    let memoryLimitExceeded = false;

    const timeout = setTimeout(() => {
      execProcess.kill();
      timeLimitExceeded = true;
    }, 2000); // 2 seconds timeout

    const memoryCheckInterval = setInterval(() => {
      exec(`ps -o rss= -p ${execProcess.pid}`, (error, stdout) => {
        if (error) {
          clearInterval(memoryCheckInterval);
          return;
        }

        const memoryUsageKB = parseInt(stdout.trim(), 10);
        if (memoryUsageKB > 256 * 1024) {
          // 256 MB in KB
          execProcess.kill();
          memoryLimitExceeded = true;
          clearInterval(memoryCheckInterval);
        }
      });
    }, 100); // check memory usage every 100ms

    await new Promise((resolve, reject) => {
      execProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      execProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      execProcess.on("close", (code) => {
        clearTimeout(timeout);
        clearInterval(memoryCheckInterval);

        if (timeLimitExceeded) {
          return reject({
            error: "Time Limit Exceeded",
            output: "The program took too long to execute.",
          });
        } else if (memoryLimitExceeded) {
          return reject({
            error: "Memory Limit Exceeded",
            output: "The program used too much memory.",
          });
        } else if (code !== 0) {
          stderr = stderr.replace(new RegExp(codeFilePath, "g"), "file");
          return reject({ error: "Runtime Error", output: stderr });
        } else {
          resolve();
        }
      });

      execProcess.stdin.write(fs.readFileSync(inputFilePath));
      execProcess.stdin.end();
    });

    return { success: true, output: stdout };
  } catch (error) {
    return {
      success: false,
      error: error.error || error.message,
      output: error.output || "",
    };
  } finally {
    cleanup(jobID, [codeFilePath, inputFilePath, classFilePath]);
  }
};

module.exports = { handleJavaRun };

const { handleCppRun } = require("./handleCppRun.js");
const { handlePythonRun } = require("./handlePythonRun.js");
const { handleJavaRun } = require("./handleJavaRun.js");

const handleRun = async (req, res) => {
  const { lang = "c_cpp", code, input } = req.body;

  console.log("\x1b[33m%s\x1b[0m", "Received run request"); // Yellow for start info
  console.log("\x1b[36mLanguage:\x1b[0m", lang); // Cyan for specific details
  console.log("\x1b[36mCode:\x1b[0m", code); // Cyan for specific details
  console.log("\x1b[36mInput:\x1b[0m", input); // Cyan for specific details

  try {
    let result;
    if (lang === "c_cpp") {
      result = await handleCppRun(code, input);
    } else if (lang === "python") {
      result = await handlePythonRun(code, input);
    } else if (lang === "java") {
      result = await handleJavaRun(code, input);
    } else {
      console.log("\x1b[31m%s\x1b[0m", "Unsupported language"); // Red for errors
      return res
        .status(200)
        .json({ success: false, error: `Unsupported language: ${lang}` });
    }

    console.log("\x1b[32mCode execution result:\x1b[0m", result); // Green for success
    res.status(200).json(result);
  } catch (error) {
    console.log("\x1b[31mError during code execution:\x1b[0m", error); // Red for errors
    res.status(500).send(error.message);
  }
};

module.exports = { handleRun };

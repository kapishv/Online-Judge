const { handleCppRun } = require("./handleCppRun.js");
const { handlePythonRun } = require("./handlePythonRun.js");
const { handleJavaRun } = require("./handleJavaRun.js");

const handleRun = async (req, res) => {
  const { lang = "c_cpp", code, input } = req.body;

  console.log("Received run request");
  console.log("Language:", lang);
  console.log("Code:", code);
  console.log("Input:", input);

  try {
    let result;
    if (lang === "c_cpp") {
      result = await handleCppRun(code, input);
    } else if (lang === "python") {
      result = await handlePythonRun(code, input);
    } else if (lang === "java") {
      result = await handleJavaRun(code, input);
    } else {
      console.log("Unsupported language");
      return res
        .status(200)
        .json({ success: false, error: `Unsupported language: ${lang}` });
    }

    console.log("Code execution result:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during code execution:", error);
    res.status(500).send(error.message);
  }
};

module.exports = { handleRun };

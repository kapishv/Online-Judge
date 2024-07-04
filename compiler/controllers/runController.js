const { handleCppRun } = require("./handleCppRun.js");
const { handlePythonRun } = require("./handlePythonRun.js");
const { handleJSRun } = require("./handleJSRun.js");

const handleRun = async (req, res) => {
  const { lang = "c_cpp", code, input } = req.body;
  try {
    if (lang === "c_cpp") {
      const result = await handleCppRun(code, input);
      res.status(200).json(result);
    } else if (lang === "python") {
      const result = await handlePythonRun(code, input);
      res.status(200).json(result);
    } else if (lang === "javascript") {
      const result = await handleJSRun(code, input);
      res.status(200).json(result);
    } else {
      res
        .status(200)
        .json({ success: false, error: `Unsupported language: ${lang}` });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { handleRun };

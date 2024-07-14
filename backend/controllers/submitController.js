const axios = require("axios");
const Problem = require("../model/Problem");
const User = require("../model/User");
const Submission = require("../model/Submission");

const handleFail = async (username, title, pass, error, lang, code) => {
  console.log("\x1b[31m%s\x1b[0m", `Test case ${pass + 1} : Failed`); // Red for Test case Failed
  if (!code) {
    code = "No Code!";
  }
  await Submission.create({
    username,
    title,
    status: {
      success: false,
      pass,
      error,
    },
    lang,
    code,
  });
  console.log("\x1b[32m%s\x1b[0m", "Submission done"); // Green for Submission done
  return { success: false, pass, error };
};

const sanitizeString = (str) => {
  return str.replace(/\s+/g, " ").trim();
};

const handleSubmit = async (req, res) => {
  console.log("\x1b[33mReceived submit request\x1b[0m"); // Yellow for Received submit request

  if (!req?.params?.title)
    return res.status(400).json({ message: "Problem title required" });

  const { title } = req.params;
  const { lang, code } = req.body;
  const problem = await Problem.findOne({ title }).exec();
  const username = req.user;

  console.log("\x1b[36mUser:\x1b[0m", username); // Cyan for User
  console.log("\x1b[36mProblem:\x1b[0m", title); // Cyan for Problem
  console.log("\x1b[36mLanguage:\x1b[0m", lang); // Cyan for Language
  console.log("\x1b[36mCode:\x1b[0m", code); // Cyan for Code

  if (!problem) {
    console.log("\x1b[31m%s\x1b[0m", `Problem not found`); // Red for Problem not found
    return res
      .status(204)
      .json({ message: `Problem title ${title} not found` });
  }

  let pass = 0;
  const response = await axios.post(
    `http://${process.env.COMPILER_SOCKET}/run`,
    { lang, code, input: problem.sampleInput }
  );

  if (!response.data.success) {
    const failResult = await handleFail(
      username,
      title,
      pass,
      response.data.error,
      lang,
      code
    );
    return res.status(200).json(failResult);
  }

  const sanitizedExpectedOutput = sanitizeString(problem.sampleOutput);
  const sanitizedActualOutput = sanitizeString(response.data.output);

  if (sanitizedActualOutput !== sanitizedExpectedOutput) {
    const failResult = await handleFail(
      username,
      title,
      pass,
      "Wrong Answer",
      lang,
      code
    );
    return res.status(200).json(failResult);
  }

  pass++;
  console.log("\x1b[32m%s\x1b[0m", `Test case ${pass} : Passed`); // Green for Test case Passed
  for (const tc of problem.hiddenTestcases) {
    const response = await axios.post(
      `http://${process.env.COMPILER_SOCKET}/run`,
      { lang, code, input: tc.input }
    );

    if (!response.data.success) {
      const failResult = await handleFail(
        username,
        title,
        pass,
        response.data.error,
        lang,
        code
      );
      return res.status(200).json(failResult);
    }

    const sanitizedExpectedOutput = sanitizeString(tc.output);
    const sanitizedActualOutput = sanitizeString(response.data.output);

    if (sanitizedActualOutput !== sanitizedExpectedOutput) {
      const failResult = await handleFail(
        username,
        title,
        pass,
        "Wrong Answer",
        lang,
        code
      );
      return res.status(200).json(failResult);
    }

    pass++;
    console.log("\x1b[32m%s\x1b[0m", `Test case ${pass} : Passed`); // Green for Test case Passed
  }

  // Check if problem is already solved by the user
  const user = await User.findOne({ username }).exec();
  const alreadySolved = user.solved.some(
    (solvedProblem) => solvedProblem.title === title
  );

  if (!alreadySolved) {
    user.solved.push({
      title: problem.title,
      difficulty: problem.difficulty,
      codingScore: problem.codingScore,
    });
    await user.save();
    console.log("\x1b[36m%s\x1b[0m", "First time problem solved"); // Cyan for First time problem solved
  }

  await Submission.create({
    username,
    title,
    status: {
      success: true,
      pass,
      error: "None",
    },
    lang,
    code,
  });

  console.log("\x1b[32m%s\x1b[0m", "Submission done"); // Green for Submission done
  res.status(200).json({ success: true, pass });
};

module.exports = {
  handleSubmit,
};

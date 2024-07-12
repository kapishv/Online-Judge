const axios = require("axios");
const Problem = require("../model/Problem");
const User = require("../model/User");
const Submission = require("../model/Submission");

const handleFail = async (username, title, pass, error, lang, code) => {
  console.error(`Test case ${pass + 1} : Failed`);
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
  console.log("Submission failed");
  return { success: false, pass, error };
};

const sanitizeString = (str) => {
  return str.replace(/\s+/g, " ").trim();
};

const handleSubmit = async (req, res) => {
  console.log("Received submit request");

  if (!req?.params?.title)
    return res.status(400).json({ message: "Problem title required" });

  const { title } = req.params;
  const { lang, code } = req.body;
  const problem = await Problem.findOne({ title }).exec();
  const username = req.user;

  console.log("User:", username);
  console.log("Problem:", title);
  console.log("Language:", lang);
  console.log("Code:", code);

  if (!problem) {
    console.error(`Problem not found`);
    return res
      .status(204)
      .json({ message: `Problem title ${title} not found` });
  }

  let pass = 0;
  const response = await axios.post(
    `http://${process.env.COMPILER_IP}:${process.env.COMPILER_PORT}/run`,
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
  console.log("\x1b[32m%s\x1b[0m", `Test case ${pass} : Passed`);
  for (const tc of problem.hiddenTestcases) {
    const response = await axios.post(
      `http://${process.env.COMPILER_IP}:${process.env.COMPILER_PORT}/run`,
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
    console.log("\x1b[32m%s\x1b[0m", `Test case ${pass} : Passed`);
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
    console.log("First time problem solved");
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

  console.log("Submission successful");
  res.status(200).json({ success: true, pass });
};

module.exports = {
  handleSubmit,
};

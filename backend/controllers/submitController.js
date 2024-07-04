const axios = require("axios");
const Problem = require("../model/Problem");
const User = require("../model/User");
const Submission = require("../model/Submission");

const handleFail = async (username, title, pass, error, code) => {
  await Submission.create({
    username,
    title,
    status: {
      success: false,
      pass,
      error,
    },
    code,
  });
  return { success: false, pass, error };
};

const sanitizeString = (str) => {
  return str.replace(/\s+/g, " ").trim();
};

const handleSubmit = async (req, res, next) => {
  try {
    if (!req?.params?.title)
      return res.status(400).json({ message: "Problem title required" });

    const { title } = req.params;
    const { lang, code } = req.body;
    const problem = await Problem.findOne({ title }).exec();
    const username = req.user;

    if (!problem) {
      return res
        .status(204)
        .json({ message: `Problem title ${title} not found` });
    }

    let pass = 0;
    const response = await axios.post(
      `http://localhost:${process.env.COMPILER_PORT}/run`,
      { lang, code, input: problem.sampleInput }
    );

    if (!response.data.success) {
      const failResult = await handleFail(
        username,
        title,
        pass,
        response.data.error,
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
        code
      );
      return res.status(200).json(failResult);
    }

    pass++;
    for (const tc of problem.hiddenTestcases) {
      const response = await axios.post(
        `http://localhost:${process.env.COMPILER_PORT}/run`,
        { lang, code, input: tc.input }
      );

      if (!response.data.success) {
        const failResult = await handleFail(
          username,
          title,
          pass,
          response.data.error,
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
          code
        );
        return res.status(200).json(failResult);
      }

      pass++;
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
      user.codingScore += problem.codingScore;
      await user.save();
    }

    await Submission.create({
      username,
      title,
      status: {
        success: true,
        pass,
        error: "None",
      },
      code,
    });

    res.status(200).json({ success: true, pass });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

module.exports = {
  handleSubmit,
};

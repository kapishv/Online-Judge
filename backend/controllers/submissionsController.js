const Submission = require("../model/Submission");

const getAllSubmissions = async (req, res) => {
  const submissions = await Submission.find({ username: req.user });
  res.json(submissions);
};

module.exports = {
  getAllSubmissions,
};

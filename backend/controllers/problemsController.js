const Problem = require("../model/Problem");

const getAllProblems = async (req, res) => {
  const problems = await Problem.find({}, "title difficulty tags codingScore");
  res.json(problems);
};

const getProblem = async (req, res) => {
  console.log(req.params);
  if (!req?.params?.title)
    return res.status(400).json({ message: "Problem title required" });
  const problem = await Problem.findOne({ title: req.params.title })
    .select(
      "title difficulty codingScore tags description inputFormat outputFormat constraints sampleInput sampleOutput explanation"
    )
    .exec();
  if (!problem) {
    return res
      .status(204)
      .json({ message: `Problem title ${req.params.id} not found` });
  }
  res.json(problem);
};

const getFullProblem = async (req, res) => {
  console.log(req.params);
  if (!req?.params?.title)
    return res.status(400).json({ message: "Problem title required" });
  const problem = await Problem.findOne({ title: req.params.title }).exec();
  if (!problem) {
    return res
      .status(204)
      .json({ message: `Problem title ${req.params.id} not found` });
  }
  res.json(problem);
};

const addProblem = async (req, res) => {
  console.log(req.body);
  const {
    title,
    difficulty,
    codingScore,
    tags,
    description,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    hiddenTestcases,
    explanation,
  } = req.body;

  if (
    !title ||
    !difficulty ||
    !codingScore ||
    !tags ||
    !description ||
    !inputFormat ||
    !outputFormat ||
    !constraints ||
    !sampleInput ||
    !sampleOutput ||
    !hiddenTestcases
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const duplicate = await Problem.findOne({ title: title }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  const newProblem = new Problem({
    title,
    difficulty,
    codingScore,
    tags,
    description,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    hiddenTestcases,
    explanation,
  });

  const result = await newProblem.save();
  res.status(201).json({
    title: result.title,
    difficulty: result.difficulty,
    tags: result.tags,
    codingScore: result.codingScore,
  });
};

const updateProblem = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  if (!req?.params?.title)
    return res.status(400).json({ message: "Problem title required" });
  const { title } = req.params;
  const updateData = req.body;
  const problem = await Problem.findOne({ title }).exec();
  if (!problem) {
    return res
      .status(204)
      .json({ message: `Problem title ${title} not found` });
  }
  const updatedProblem = await Problem.findOneAndUpdate(
    { title },
    { $set: updateData },
    { new: true }
  ).exec();
  if (!updatedProblem) {
    return res.status(500).json({ message: "Failed to update problem" });
  }
  res.json(updatedProblem);
};

const deleteProblem = async (req, res) => {
  console.log(req.params);
  if (!req?.params?.title)
    return res.status(400).json({ message: "Problem title required" });
  const problem = await Problem.findOne({ title: req.params.title }).exec();
  if (!problem) {
    return res
      .status(204)
      .json({ message: `Problem title ${req.params.id} not found` });
  }
  const result = await Problem.deleteOne({ title: req.params.title });
  res.json(result);
};

module.exports = {
  getAllProblems,
  getProblem,
  getFullProblem,
  addProblem,
  updateProblem,
  deleteProblem,
};

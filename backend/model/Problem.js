const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the problem
const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  codingScore: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  sampleInput: {
    type: String,
    required: true,
  },
  sampleOutput: {
    type: String,
    required: true,
  },
  hiddenTestcases: {
    type: [{
      input: String,
      output: String,
    }],
    default: [],
  },
  explanation: {
    type: String,
  },
});

// Create a model based on the schema
const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = Problem;

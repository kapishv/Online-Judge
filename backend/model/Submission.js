const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the problem
const SubmissionSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    success: {
      type: Boolean,
      required: true,
    },
    pass: {
      type: Number,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
  },
  lang: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = Submission;

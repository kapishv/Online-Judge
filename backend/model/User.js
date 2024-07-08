const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const solvedSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  codingScore: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  roles: {
    User: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [String],
  solved: {
    type: [solvedSchema],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

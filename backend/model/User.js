const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
});

module.exports = mongoose.model("User", userSchema);

const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Received register request");
  console.log("Username:", username);
  console.log("Email:", email);

  // Check if username, email, and password are provided
  if (!username || !email || !password) {
    console.error("Missing username, email, or password.");
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  // Check for duplicate username in the database
  const duplicateUser = await User.findOne({ username }).exec();
  if (duplicateUser) {
    console.error("Duplicate username found in the database");
    return res.sendStatus(409); // Conflict
  }

  // Encrypt the password
  const hashedPwd = await bcrypt.hash(password, 10);

  // Create and store the new user
  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const result = await User.create({
    username,
    email,
    password: hashedPwd,
    roles: {
      User: 2001, // Example role
    },
    refreshToken: [refreshToken],
  });
  console.log("New user created successfully");

  // Generate access token
  const roles = Object.values(result.roles).filter(Boolean);
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: result.username,
        roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );

  // Set refresh token as a cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // Respond with access token
  res.json({ accessToken });
};

module.exports = { handleNewUser };

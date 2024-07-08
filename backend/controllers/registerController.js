const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if username, email, and password are provided
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    // Check for duplicate username in the database
    const duplicateUser = await User.findOne({ username }).exec();
    if (duplicateUser) {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };

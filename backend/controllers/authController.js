const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  console.log("Received login request");
  console.log("Username:", username);

  if (!username || !password) {
    console.error("Username or password missing");
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = await User.findOne({ username: username }).exec();

  if (!foundUser) {
    console.error("User not found");
    return res.sendStatus(401); // Unauthorized
  }

  console.log("User found");

  // Evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    console.log("Password match");

    const roles = Object.values(foundUser.roles).filter(Boolean);
    console.log("Roles:", roles);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Push the new refresh token to the refreshToken array
    foundUser.refreshToken.push(refreshToken);
    await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ accessToken });
  } else {
    console.error("Password does not match");
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };

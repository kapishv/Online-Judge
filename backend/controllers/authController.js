const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  console.log("\x1b[33mReceived login request\x1b[0m"); // Yellow for Received
  console.log("\x1b[36mUsername:\x1b[0m", username); // Cyan for Username

  if (!username || !password) {
    console.error("\x1b[31mUsername or password missing\x1b[0m"); // Red for username or password missing
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = await User.findOne({ username: username }).exec();

  if (!foundUser) {
    console.error("\x1b[31mUser not found\x1b[0m"); // Red for username not found
    return res.sendStatus(401); // Unauthorized
  }

  console.log("\x1b[32mUser found\x1b[0m"); // Green for user found

  // Evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    console.log("\x1b[32mPassword match\x1b[0m"); // Green for password match

    const roles = Object.values(foundUser.roles).filter(Boolean);
    console.log("\x1b[36mRoles:\x1b[0m", roles); // Cyan for roles

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
    console.error("\x1b[31mPassword does not match\x1b[0m"); // Red for password does not match
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };

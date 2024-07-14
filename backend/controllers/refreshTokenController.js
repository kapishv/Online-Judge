const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("\x1b[33mReceived refresh request\x1b[0m"); // Yellow for Received refresh request
  if (!cookies?.jwt) {
    console.error("\x1b[31mNo JWT found\x1b[0m"); // Red for No JWT found
    return res.sendStatus(401);
  }

  const oldRefreshToken = cookies.jwt;

  const foundUser = await User.findOne({
    refreshToken: oldRefreshToken,
  }).exec();

  if (!foundUser) {
    console.error("\x1b[31mUser not found\x1b[0m"); // Red for User not found
    return res.sendStatus(403); // Forbidden
  }

  console.log("\x1b[32mFound User:\x1b[0m", foundUser.username); // Green for Found User
  const roles = Object.values(foundUser.roles).filter(Boolean);
  console.log("\x1b[36mRoles:\x1b[0m", roles); // Cyan for Roles

  const newRefreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  foundUser.refreshToken = foundUser.refreshToken.map((rt) =>
    rt === oldRefreshToken ? newRefreshToken : rt
  );
  await foundUser.save();
  console.log("\x1b[32mSuccessfully updated user's refresh tokens.\x1b[0m"); // Green for Successfully updated user's refresh tokens

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

  // Creates Secure Cookie with new refresh token
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

module.exports = { handleRefreshToken };

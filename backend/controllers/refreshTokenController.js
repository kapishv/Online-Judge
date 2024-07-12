const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("Received refresh request");
  if (!cookies?.jwt) {
    console.error("No JWT found");
    return res.sendStatus(401);
  }

  const oldRefreshToken = cookies.jwt;

  const foundUser = await User.findOne({
    refreshToken: oldRefreshToken,
  }).exec();

  if (!foundUser) {
    console.error("User not found");
    return res.sendStatus(403); // Forbidden
  }

  console.log("Found User:", foundUser.username); // Logging found user
  const roles = Object.values(foundUser.roles).filter(Boolean);
  console.log("Roles:", roles); // Logging user roles

  const newRefreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  foundUser.refreshToken = foundUser.refreshToken.map((rt) =>
    rt === oldRefreshToken ? newRefreshToken : rt
  );
  await foundUser.save();
  console.log("Successfully updated user's refresh tokens.");

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

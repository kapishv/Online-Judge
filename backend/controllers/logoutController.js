const User = require("../model/User");

const handleLogout = async (req, res) => {
  console.log("\x1b[33mReceived logout request\x1b[0m"); // Yellow for Received logout request
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    console.error("\x1b[31mNo jwt cookie found\x1b[0m"); // Red for No jwt cookie found
    return res.sendStatus(204); // No content
  }

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    console.error("\x1b[31mUser not found\x1b[0m"); // Red for User not found
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  console.log("\x1b[32mUser found\x1b[0m"); // Green for User found

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  await foundUser.save();

  console.log(
    "\x1b[32mRefresh token successfully deleted from database\x1b[0m"
  ); // Green for Refresh token successfully deleted from database

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(200);
};

module.exports = { handleLogout };

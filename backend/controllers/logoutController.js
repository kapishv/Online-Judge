const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  console.log("Received logout request");
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    console.error("No jwt cookie found");
    return res.sendStatus(204); // No content
  }

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  
  if (!foundUser) {
    console.error("User not found");
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  console.log("User found"); // Log found user for debugging

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  await foundUser.save();

  console.log("Refresh token successfully deleted from database");

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(200);
};

module.exports = { handleLogout };

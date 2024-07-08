const User = require("../model/User");

const getUserDetails = async (req, res) => {
  console.log(req.params);
  if (!req?.params?.user)
    return res.status(400).json({ message: "Username required" });
  const user = await User.findOne({ username: req.params.user })
    .select("username email solved")
    .exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ${req.params.user} not found` });
  }
  res.json(user);
};

module.exports = {
  getUserDetails,
};

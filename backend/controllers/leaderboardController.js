const User = require("../model/User");

const getLeaderboard = async (req, res) => {
  const users = await User.find(
    { "roles.User": { $exists: true } },
    "username solved"
  ).exec();
  res.json(users);
};

module.exports={
    getLeaderboard,
}
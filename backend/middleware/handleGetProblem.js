const jwt = require("jsonwebtoken");
const ROLES_LIST = require("../config/roles_list");
const problemsController = require("../controllers/problemsController");

const handleGetProblem = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("\x1b[33mPublic request received for problem\x1b[0m"); // Yellow for Public request
    return problemsController.getProblem(req, res, next);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("\x1b[31mJWT Error:\x1b[0m", err.message); // Red for JWT Error
      return res.sendStatus(403); // invalid token
    }

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    console.log("\x1b[32mJWT Verified\x1b[0m"); // Green for JWT Verified
    console.log("\x1b[36mUser:\x1b[0m", req.user); // Cyan for User
    console.log("\x1b[36mRoles:\x1b[0m", req.roles); // Cyan for Roles

    // Check if user has admin role
    if (req.roles.includes(ROLES_LIST.Admin)) {
      return problemsController.getFullProblem(req, res, next);
    } else {
      return problemsController.getProblem(req, res, next);
    }
  });
};

module.exports = handleGetProblem;

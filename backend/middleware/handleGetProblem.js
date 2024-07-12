const jwt = require("jsonwebtoken");
const ROLES_LIST = require("../config/roles_list");
const problemsController = require("../controllers/problemsController");

const handleGetProblem = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return problemsController.getProblem(req, res, next);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return problemsController.getProblem(req, res, next);
    }

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    console.log("JWT Verified");
    console.log("User:", req.user);
    console.log("Roles:", req.roles);

    // Check if user has admin role
    if (req.roles.includes(ROLES_LIST.Admin)) {
      return problemsController.getFullProblem(req, res, next);
    } else {
      return problemsController.getProblem(req, res, next);
    }
  });
};

module.exports = handleGetProblem;

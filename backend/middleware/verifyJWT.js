const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.error("JWT Error: Authorization header missing or invalid format");
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err.message);
      return res.sendStatus(403); // invalid token
    }

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    console.log("JWT Verified");
    console.log("User:", req.user);
    console.log("Roles:", req.roles);

    next();
  });
};

module.exports = verifyJWT;

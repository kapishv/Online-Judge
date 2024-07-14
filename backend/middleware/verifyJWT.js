const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log(
      "\x1b[31mJWT Error:\x1b[0m Authorization header missing or invalid format"
    ); // Red for JWT Error
    return res.sendStatus(401);
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

    next();
  });
};

module.exports = verifyJWT;

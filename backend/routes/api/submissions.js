const express = require("express");
const router = express.Router();
const submissionsController = require("../../controllers/submissionsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .get(verifyJWT, verifyRoles(ROLES_LIST.User), submissionsController.getAllSubmissions);

module.exports = router;

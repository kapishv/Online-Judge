const express = require("express");
const router = express.Router();
const runController = require("../../controllers/runController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(verifyJWT, verifyRoles(ROLES_LIST.User), runController.handleRun);

module.exports = router;




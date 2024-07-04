const express = require("express");
const router = express.Router();
const submitController = require("../../controllers/submitController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/:title")
  .post(verifyJWT, verifyRoles(ROLES_LIST.User), submitController.handleSubmit);

module.exports = router;




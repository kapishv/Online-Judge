const express = require("express");
const router = express.Router();
const problemsController = require("../../controllers/problemsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User), problemsController.getAllProblems);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.User), problemsController.getProblem)
  .delete(verifyRoles(ROLES_LIST.Admin), problemsController.deleteProblem);

module.exports = router;

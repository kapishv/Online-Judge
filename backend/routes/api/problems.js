const express = require("express");
const router = express.Router();
const problemsController = require("../../controllers/problemsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");
const handleGetProblem = require("../../middleware/handleGetProblem");

router
  .route("/")
  .get(problemsController.getAllProblems)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), problemsController.addProblem);

router
  .route("/:title")
  .get(handleGetProblem)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), problemsController.updateProblem)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), problemsController.deleteProblem);

module.exports = router;

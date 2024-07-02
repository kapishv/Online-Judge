const express = require("express");
const router = express.Router();
const runController = require("../controllers/runController");

router
  .route("/")
  .post(runController.handleRun)

module.exports = router;




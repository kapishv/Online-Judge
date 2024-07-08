const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router
  .route("/:user")
  .get(userController.getUserDetails);

module.exports = router;

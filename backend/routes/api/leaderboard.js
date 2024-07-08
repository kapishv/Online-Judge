const express = require("express");
const router = express.Router();
const leaderboardController = require("../../controllers/leaderboardController");

router
  .route("/")
  .get(leaderboardController.getLeaderboard)

module.exports = router;

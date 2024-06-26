const express = require("express");
const router = express.Router();
const { getTrends } = require("../controllers/trendsController");

router.get("/", getTrends);

module.exports = router;

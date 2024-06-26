const express = require("express");
const router = express.Router();
const { downloadVideo } = require("../controllers/downloadController");
const { rateLimiter } = require("../utils/rateLimiter");

router.get("/", rateLimiter, downloadVideo);

module.exports = router;

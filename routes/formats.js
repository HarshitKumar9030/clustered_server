const express = require("express");
const router = express.Router();
const { getFormats } = require("../controllers/formatsController");

router.get("/", getFormats);

module.exports = router;

const mongoose = require("mongoose");

const downloadLogSchema = new mongoose.Schema({
  ip: String,
  count: Number,
  firstDownload: Date,
});

const DownloadLog = mongoose.model("DownloadLog", downloadLogSchema);

module.exports = { DownloadLog };

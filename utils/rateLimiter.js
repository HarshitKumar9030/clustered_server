const { DownloadLog } = require("../models/DownloadLog");

const rateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const currentTimestamp = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  let userLog = await DownloadLog.findOne({ ip });

  if (userLog) {
    if (userLog.count >= 5) {
      const timeSinceFirstDownload = currentTimestamp - userLog.firstDownload.getTime();
      if (timeSinceFirstDownload < oneDayInMs) {
        return res.status(429).send("Download limit exceeded. Please try again later.");
      } else {
        userLog.count = 0;
        userLog.firstDownload = currentTimestamp;
      }
    }
    userLog.count += 1;
  } else {
    userLog = new DownloadLog({
      ip,
      count: 1,
      firstDownload: currentTimestamp,
    });
  }

  await userLog.save();
  next();
};

module.exports = { rateLimiter };

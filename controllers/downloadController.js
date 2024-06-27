const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const { formatExtensions, stopWords } = require("../utils/constants");
const { TrendingWord } = require("../models/TrendingWord");
const { DownloadLog } = require("../models/DownloadLog");
const stram = require('stream');

const downloadVideo = async (req, res) => {
  const videoURL = req.query.url;
  const format = req.query.format;
  const quality = req.query.quality;

  if (!videoURL || !format) {
    return res.status(400).send("No video URL or format provided");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, ""); // Sanitize title
    const videoFormats = ytdl.filterFormats(info.formats, "video");
    const audioFormat = ytdl.filterFormats(info.formats, "audioonly")[0];

    let chosenFormat;
    if (quality === "highest") {
      chosenFormat = ytdl.chooseFormat(videoFormats, {
        quality: "highestvideo",
      });
    } else {
      chosenFormat =
        quality === "wav"
          ? audioFormat
          : ytdl.chooseFormat(info.formats, {
              quality: quality || "highestaudio",
            });
    }

    const fileExtension = formatExtensions[format] || "mp3";
    const sanitizedTitle = title.replace(/[^\w\s\-_.]/g, ''); // Sanitize title for filename

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${sanitizedTitle}.${fileExtension}"`
    );

    const stream = ytdl.downloadFromInfo(info, { format: chosenFormat });
    const passThrough = new stram.PassThrough();

    if (format === "wav") {
      ffmpeg(stream)
        .audioCodec("pcm_s16le")
        .format("wav")
        .on("error", (err) => {
          console.error("Error processing video:", err);
          if (!res.headersSent) {
            res.status(500).send("Error processing video");
          }
        })
        .pipe(passThrough)
        .pipe(res, { end: true });
    } else if (format === "flac") {
      ffmpeg(stream)
        .audioCodec("flac")
        .format("flac")
        .on("error", (err) => {
          console.error("Error processing video:", err);
          if (!res.headersSent) {
            res.status(500).send("Error processing video");
          }
        })
        .pipe(passThrough)
        .pipe(res, { end: true });
    } else if (format === "mp4" || format === "webm") {
      ffmpeg(stream)
        .videoCodec("copy")
        .format(format)
        .on("error", (err) => {
          console.error("Error processing video:", err);
          if (!res.headersSent) {
            res.status(500).send("Error processing video");
          }
        })
        .pipe(passThrough)
        .pipe(res, { end: true });
    } else {
      ffmpeg(stream)
        .audioCodec("libmp3lame")
        .audioBitrate(quality === "highest" ? 320 : 128)
        .format("mp3")
        .on("error", (err) => {
          console.error("Error processing video:", err);
          if (!res.headersSent) {
            res.status(500).send("Error processing video");
          }
        })
        .pipe(passThrough)
        .pipe(res, { end: true });
    }

    // Record the video title for trending topics
    const words = title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter((word) => !stopWords.includes(word) && word.length > 2);

    for (const word of words) {
      await TrendingWord.updateOne(
        { word },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error("Error downloading video:", err);
    if (!res.headersSent) {
      res.status(500).send("Error downloading video");
    }
  }
};

module.exports = { downloadVideo };

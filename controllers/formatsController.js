const ytdl = require("ytdl-core");
const { formatExtensions } = require("../utils/constants");

const getFormats = async (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).send("No valid video URL provided");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const videoFormats = ytdl.filterFormats(info.formats, "video");
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");

    const formatDetails = videoFormats.map((format) => ({
      quality: format.qualityLabel || "Unknown",
      container: format.container,
      audioBitrate: format.audioBitrate,
      itag: format.itag,
      extension: formatExtensions[format.container] || format.container,
    }));

    res.json({ title: info.videoDetails.title, formats: formatDetails });
  } catch (err) {
    console.error("Error fetching video info:", err);
    res.status(500).send("Error fetching video info");
  }
};

module.exports = { getFormats };

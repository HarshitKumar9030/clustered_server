const { TrendingWord } = require("../models/TrendingWord");

const getTrends = async (req, res) => {
  try {
    const trends = await TrendingWord.find().sort({ count: -1 }).limit(10);
    res.json(trends);
  } catch (err) {
    console.error("Error fetching trends:", err);
    res.status(500).send("Error fetching trends");
  }
};

module.exports = { getTrends };

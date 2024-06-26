const mongoose = require("mongoose");

const trendingWordSchema = new mongoose.Schema({
  word: String,
  count: Number,
});

const TrendingWord = mongoose.model("TrendingWord", trendingWordSchema);

module.exports = { TrendingWord };

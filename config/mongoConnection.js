const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://192.168.1.101:27017,192.168.1.102:27017/ytdl-server", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      replicaSet: "rs0"
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };

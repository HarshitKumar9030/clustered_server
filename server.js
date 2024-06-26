const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { options } = require("./config/options");
const { connectDB } = require("./config/mongoConnection");

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Load routes
const downloadRoutes = require("./routes/download");
const formatsRoutes = require("./routes/formats");
const trendsRoutes = require("./routes/trends");

// Use routes
app.use("/api/download", downloadRoutes);
app.use("/api/formats", formatsRoutes);
app.use("/api/trends", trendsRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

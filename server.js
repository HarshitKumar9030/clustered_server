const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { options } = require("./config/options");
const { connectDB } = require("./config/mongoConnection");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://hogwart.tech",
  ], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* 

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}

*/
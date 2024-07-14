require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Increase the limit for JSON payloads
app.use(express.json({ limit: "10mb" }));

// Increase the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ online: "judge" });
});
// routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/logout", require("./routes/logout"));
app.use("/refresh", require("./routes/refresh"));

app.use("/user", require("./routes/api/user"));
app.use("/leaderboard", require("./routes/api/leaderboard"));
app.use("/submissions", require("./routes/api/submissions"));
app.use("/problemset", require("./routes/api/problems"));
app.use("/run", require("./routes/api/run"));
app.use("/submit", require("./routes/api/submit"));

app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

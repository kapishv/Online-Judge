const express = require("express");
const app = express();
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

// custom middleware logger
app.use(logger);

// built-in middleware to handle urlencoded form data with increased limit
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// built-in middleware for json with increased limit
app.use(express.json({ limit: "10mb" }));

// routes
app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.use("/run", require("./routes/run"));

// routes after jwt verification

app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});

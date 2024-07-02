const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
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

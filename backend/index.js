const express = require("express");
const { DBConnection } = require("./database/db.js");
const User = require("./models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
PORT = process.env.PORT || 8080;
const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(cookieParser());

DBConnection();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);

    //get all the data from the request body
    const { username, email, password } = req.body;

    //check that all the data should exist
    if (!(username && email && password)) {
      return res
        .status(400)
        .json({ message: "Please enter all the information!" });
    }

    //check if username already exists
    const existingUserForUsername = await User.findOne({ username });
    if (existingUserForUsername) {
      return res.status(409).json({ message: "Username already taken!" });
    }

    //check if user already exists
    const existingUserForEmail = await User.findOne({ email });
    if (existingUserForEmail) {
      return res.status(409).json({ message: "Email already taken!" });
    }

    //encrypt password
    const hashPassword = await bcrypt.hashSync(password, 10);

    //save the user to the database
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    // Generate a token for the user and send it
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Create a response object without the password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.status(201).json({
      message: "You have successfully registered!",
      success: true,
      user: userResponse,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body);

    const { username, password } = req.body;

    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Please enter all the information!" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const enteredPassword = await bcrypt.compare(password, user.password);
    if (!enteredPassword) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Create a response object without the password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      succes: true,
      user: userResponse,
      accessToken: token,
      roles: user.roles,
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

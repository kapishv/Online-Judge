const express = require('express');
const {DBConnection} = require('./database/db.js');
const User = require('./models/Users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(cookieParser());

DBConnection();

app.get("/", (req, res)=>{
    res.send("Hello, World!");
});

app.get("/home", (req, res)=>{
    res.send("Welcome to home");
});

app.post("/register", async (req, res)=>{
    try {
        //get all the data from the request body
        const {username, email, password} = req.body;
        
        //check that all the data should exist
        if(!(username && email && password)) {
            return res.status(400).send("Please enter all the information!")
        }

        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(200).send("User already exists!");
        }

        //encrypt password
        const hashPassword =await bcrypt.hashSync(password, 10);

        //save the user to the database
        const user = await User.create({
            username,
            email,
            password: hashPassword,
        })

        //generate a token for user and send it
        const token = jwt.sign({id:user._id, email}, process.env.SECRET_KEY, {
            expiresIn:"1h"
        });
        user.token = token
        user.password = undefined
        res.status(200).json({
            message: "You have successfully registered!",
            success: true,
            user
        });

    } catch (error) {
        console.error("Error occured during registeration:" + error);
    }
});

app.post("/login",async (req, res)=>{
    try {
        const {email, password} = req.body;

        if(!(email && password)) {
            return res.status(400).send("Please enter all the information!")
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).send("User not found!");
        }

        const enteredPassword = await bcrypt.compare(password, user.password);
        if(!enteredPassword) {
            return res.status(401).send("Email or password is incorrect");
        }

        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {
            expiresIn: '1d',
        });
        user.token = token
        user.password = undefined

        const options = {
            expires: new Date(Date.now()+ 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            succes: true,
            token,
        });

    } catch (error) {
        console.error("Error during login:" + error);
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
});
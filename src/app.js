const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try{
        // validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instanceof the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User added successfully!");
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }    
});

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credential!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            // create JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@Tender$790", {expiresIn: "7d"});

            // add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 178 * 3600000)});
            res.send("Login successfully!");
        } else {
            throw new Error("Invalid credential!");
        }

    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    } 
});


app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    } 
    
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent the connection request!");
})


connectDB()
    .then(() => {
        console.log("Database connection established...!")
        app.listen("7777", () => {
            console.log("Server successfully started...");
        });
    })
    .catch((err) => {
        console.error("Database connection is not established...!")
    });




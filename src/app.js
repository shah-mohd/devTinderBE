const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    // creating a new instanceof the user model
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added successfully!");
    } catch(err){
        res.status(400).send("Error saving the user: " + err.message);
    }    
});

// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const users = await User.findOne({emailId: userEmail});
        if(!users){
           res.status(404).send("User not found!"); 
        } else {
            res.send(users);
        }
        
    // try{
    //     const users = await User.find({emailId: userEmail});
    //     if(users.length === 0){
    //         res.status(404).send("User not found!");
    //     } else {
    //         res.send(users);
    //     }
        
    } catch(err){
        res.status(400).send("Something went wrong!")
    }
    
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(404).send("Something went wrong!");
    }   
});



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




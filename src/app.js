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




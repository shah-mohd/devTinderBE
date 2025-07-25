const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

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
            res.send("Login successfully!");
        } else {
            throw new Error("Invalid credential!");
        }

    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    } 
})

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

// delete a user from the database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);
    try{
        const user = await User.findByIdAndDelete({_id: userId});
        // console.log(user);
        res.send("User deleted successfully!");
    } catch(err){
        res.status(404).send("Something went wrong!");
    }
});

// update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Update not allowed!");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10!");
        }
        
        await User.findByIdAndUpdate({_id: userId}, data, {runValidators: true});
        res.send("User updated successflly");
    } catch(err){
        res.status(404).send("Update failed! " + err.message);
    }
});

// update data of the user by emailId
// app.patch("/user", async (req, res) => {
//     const emailId = req.body.emailId;
//     const data = req.body;

//     try{
//         await User.findOneAndUpdate({emailId: emailId}, data, {runValidators:true});
//         res.send("User updated successflly");
//     } catch(err){
//         res.status(404).send("Update failed! " + err.message);
//     }
// });


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




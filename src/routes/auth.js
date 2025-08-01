const express = require("express");
const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");


authRouter.post("/signup", async (req, res) => {
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
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 178 * 3600000)});
        res.json({message: "User added successfully!", data: savedUser});
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }    
});


authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credential!");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // create JWT token
            const token = await user.getJWT();

            // add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 178 * 3600000)});
            res.send(user);
        } else {
            throw new Error("Invalid credential!");
        }

    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    } 
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.send("Logout successfull!");
});


module.exports = authRouter;
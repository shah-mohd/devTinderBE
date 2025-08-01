const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid!");
            // res.status(401).send("Please Login!");
        }
        const decodeObj = await jwt.verify(token, "DEV@Tender$790");
        const {_id} = decodeObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found!");
        }
        req.user = user;
        next();
    } catch(err){
        res.status(401).send("ERROR : " + err.message);
    }
}

module.exports = {
    userAuth,
}
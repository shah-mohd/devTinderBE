const express = require("express");

const app = express();

// we can use multiple handler, with the help if next()
app.use("/user", (req, res, next) => {
    console.log("route handler 1");
    next();
},
(req, res, next) => {
    console.log("route handler 2");
    next();
},
(req, res, next) => {
    console.log("route handler 3");
    res.send("Response 3");
}
);


app.listen("7777", () => {
    console.log("Server successfully started...");
})
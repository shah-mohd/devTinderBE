const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth");

const app = express();

// app.use("/admin", adminAuth);

// app.post("/user/login", (req, res) => {
//     res.send("login user");
// });

// app.use("/user", userAuth);

// app.get("/user/data", (req, res) => {
//     res.send("user data");
// });

// app.get("/user/profile", (req, res) => {
//     res.send("profile data");
// });

// app.get("/admin/getAllUsers", (req, res) => {
//     res.send("All data sent!");
// });

// app.get("/admin/deleteUser", (req, res) => {
//     res.send("Deleted a user!");
// });


app.use("/", (req, res) => {
    throw new Error("there are error!");
});

app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("error from err");
    }
});


app.listen("7777", () => {
    console.log("Server successfully started...");
})
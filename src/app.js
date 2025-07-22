const express = require("express");

const app = express();

// this will match hndle GET call to /user
app.get("/user", (req, res) => {
    res.send({firstName: "Shah", lastName: "Mohd"});
});

app.post("/user", (req, res) => {
    // saving data to DB
    res.send("data successfully saved to the database");
});

app.delete("/user", (req, res) => {
    res.send("deleted successfully");
});

// this will match all the http API calls to /test
app.use("/test", (req, res) => {
    res.send("test from the server");
});


app.listen("7777", () => {
    console.log("Server successfully started...");
})
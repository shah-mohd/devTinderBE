const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.send("Hello, Shah!");
})

app.use("/hello", (req, res) => {
    res.send("Hello from the server");
})

app.use("/test", (req, res) => {
    res.send("test from the server");
})


app.listen("7777", () => {
    console.log("Server successfully started...");
})
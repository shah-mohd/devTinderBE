const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cros = require("cors");

const app = express();

app.use(cros({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
    .then(() => {
        console.log("Database connection established...!");
        app.listen("7777", () => {
            console.log("Server successfully started...");
        });
    })
    .catch((err) => {
        console.error("Database connection is not established...! " + err.message);
    });




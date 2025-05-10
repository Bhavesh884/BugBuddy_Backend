const express = require('express');
const connectDB = require('./config/database');
const app = express();

const User = require('./models/user');


app.post("/signup", async (req, res) => {
    const userObj = {
        profilePic: "xyz.png",
        firstName: "bhavesh",
        lastName: "bhanusali",
        email: "HvH9h@example.com",
        password: "123456",
        age: 20,
        gender: "male",
        mobileNo: "1234567890"
    }

    try {
        const user = new User(userObj);
        await user.save();
        res.send("user created successfully");
    } catch (error) {
        res.status(400).send("Error while saving user", error.message);
    }
});

connectDB().then(() => {
    console.log("connected to database");
    app.listen(3000, () => {
        console.log("server is listening now");
    });
}).catch((err) => {
    console.log(err);
});


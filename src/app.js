const express = require('express');
const connectDB = require('./config/database');
const app = express();

const User = require('./models/user');

app.use(express.json());

app.get("/user", async (req, res) => {
    const email = req.body.email;
    try {
        const users = await User.findOne({ email: email }).exec();
        console.log(users)
        if (users) {
            res.send(users);
        }
        else {
            res.status(404).send("user not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("user deleted successfully")
    } catch (error) {
        res.status(400).send(error.message);
    }
})
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const allowedUpdates = ["firstName", "lastName", "mobileNo", "skills", "description", "profilePic"];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            // return res.status(400).send({ error: "Invalid updates!" });
            throw new Error("Invalid updates!");
        }

        const userObj = req.body;
        await User.findByIdAndUpdate(userId, userObj, {
            returnDocument: "after",
            runValidators: true
        });
        res.send("user updated successfully")
    } catch (error) {
        res.status(400).send(error.message);
    }
})
app.post("/signup", async (req, res) => {

    try {
        console.log(req.body);
        const userObj = req.body;

        const user = new User(userObj);
        await user.save();
        res.send("user created successfully");
    } catch (error) {
        res.status(400).send("Error while saving user " + error);
    }
});
app.use("/", () => {
    console.log("something went wrong");
})

connectDB().then(() => {
    console.log("connected to database");
    app.listen(3000, () => {
        console.log("server is listening now");
    });
}).catch((err) => {
    console.log(err);
});


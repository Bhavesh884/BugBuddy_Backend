const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const app = express();

const User = require('./models/user');
const { validateSignup, checkAllowedData, validateEmail } = require('./helpers/validation');

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
        // check of allowed updates
        if (!checkAllowedData(["firstName", "lastName", "mobileNo", "skills", "description"], Object.keys(req.body))) {
            throw new Error("Invalid entries passed!");
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
        if (!checkAllowedData(["firstName", "lastName", "mobileNo", "skills", "description", "profilePic", "email", "password", "age", "gender"], Object.keys(req.body))) {
            throw new Error("Please provide valid data");
        }
        //check if data is valid
        validateSignup(req);

        //ecrypt data
        const { firstName, lastName, mobileNo, skills, description, profilePic, email, password, age, gender } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        const userObj = { firstName, lastName, mobileNo, skills, description, profilePic, email, password: encryptedPassword, age, gender };

        const user = new User(userObj);
        await user.save();
        res.send("user created successfully");
    } catch (error) {
        res.status(400).send("Error while saving user " + error);
    }
});
app.post("/login", async (req, res) => {
    try {
        if (!checkAllowedData(["email", "password"], Object.keys(req.body))) {
            throw new Error("Please provide valid data");
        }

        const { email, password } = req.body;
        validateEmail(email);

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        }
        res.send("user logged in successfully");
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})
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


const validator = require('validator');

const checkAllowedData = (allowedUpdates, updates) => {
    return updates.every((update) => allowedUpdates.includes(update));
}
const validateSignup = (req) => {
    const { firstName, lastName, mobileNo, skills, description, profilePic, email, password, age, gender } = req.body;
    if (!firstName || !lastName || !mobileNo || !description || !email || !password || !age || !gender) {
        throw new Error("All fields are required");
    }
    if (!validator.isEmail(email.trim())) {
        throw new Error("Invalid email");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

const validateEmail = (email) => {
    if (!validator.isEmail(email.trim())) {
        throw new Error("Invalid email");
    }
}
module.exports = { checkAllowedData, validateSignup, validateEmail }
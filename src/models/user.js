const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    profilePic: {
        type: String,
        trim: true,
        default: "https://static.everypixel.com/ep-pixabay/0329/8099/0858/84037/3298099085884037069-head.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("invalid url" + value)
            }
        }
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 20,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email" + value)
            }
        }
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("password cannot contain password")
            }

            if (!validator.isStrongPassword(value)) {
                throw new Error("password should be strong, it should contain at least one lowercase letter, one uppercase letter, one number and one special character")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("invalid gender")
            }

        }
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (value.length !== 10) {
                throw new Error("invalid mobile number")
            }
        },

    },
    skills: {
        type: [String],
        required: true,
        trim: true,
        minlength: 1,
        validate(value) {
            if (value.length > 12) {
                throw new Error("too many skills")
            }
            // now lowercase every skill and check if we have duplicate skills
            const lowerCaseSkills = value.map((skill) => skill.toLowerCase());
            const uniqueSkills = new Set(lowerCaseSkills);
            if (uniqueSkills.size !== value.length) {
                throw new Error("duplicate skills")
            }
        }

    },
    description: {
        type: String,
        trim: true,
        default: "I am a developer",
        minlength: 3
    },
}, {
    timestamps: true,
    versionKey: false,

});
const User = mongoose.model("User", userSchema);
module.exports = User
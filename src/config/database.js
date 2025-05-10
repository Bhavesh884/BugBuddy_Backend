const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://bhaveshbhanusali2:GqDs0emeu6KGAinX@cluster0.juvu1rj.mongodb.net/BugBuddy");
}

module.exports = connectDB;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isVerified:{
        type: Boolean,
        default: false
    },
    verificationToken: String,
    completed: [{
    problemId: String
    }]
});

module.exports = mongoose.model("User",userSchema);
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Email: {
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    UserName: {
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    Password: String,
    Role: String,
    Subject: String,
    AppRejUser: Number
});
const User = mongoose.model("users",userSchema);

module.exports = User;
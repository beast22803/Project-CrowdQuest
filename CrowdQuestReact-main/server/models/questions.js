const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
    Subject: String,
    Question: String,
    Type: String,
    Difficulty: String,
    UserID: mongoose.Schema.Types.ObjectId,
    AppRej: Number
});
const Question = mongoose.model("question",questSchema);

module.exports = Question;
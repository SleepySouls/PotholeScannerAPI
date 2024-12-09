const mongoose = require("mongoose");
const { reset } = require("nodemon");

const feedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    satisfy:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Feedback', feedbackSchema);
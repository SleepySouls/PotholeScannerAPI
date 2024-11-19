const mongoose = require("mongoose");
const { reset } = require("nodemon");

const resetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    resetCode: {
        type: String,
        required: true
    },
    resetCodeExpiry: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('ResetCode', resetSchema);
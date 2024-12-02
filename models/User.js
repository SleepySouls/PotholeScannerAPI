const mongoose = require("mongoose");
const { reset } = require("nodemon");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema);

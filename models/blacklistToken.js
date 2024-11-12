const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d' // Automatically delete documents after 1 day
  }
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
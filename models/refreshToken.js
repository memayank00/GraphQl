const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);

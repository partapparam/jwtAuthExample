const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    hash: String
});
const User = mongoose.model('User', usersSchema);
module.exports = User;
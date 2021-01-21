const mongoose = require('mongoose');
const { credentials } = require('./../config');
const { connectionString } = credentials.mongo;
const User = require('./models/user');
if (!connectionString) return console.log('error with the db')

mongoose.connect(connectionString, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('error with the db', err.message);
    process.exit(1)
});
db.once('open', () => console.log('Mongo is working'));

module.exports = {
    getUsers: async () => User.find(),
    newUser: async (data) => {
        return new User(data).save();
    },
    findUser: async (email) => User.findOne({email})
}
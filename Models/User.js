const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        reguired: true,
        min: 6
    },
    email: {
        type: String,
        reguired: true,
        max: 255
    },
    password: {
        type: String,
        reguired: true,
        min: 6,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now
    }


});
module.exports = mongoose.model('Auth', userSchema);
let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    created: { type: String },
    name: { type: String, index: true },
    email: { type: String, unique: true},
    password: { type: String },
    isLogged: { type: String, default: true },
    role: { type: String, default: true }
});


module.exports = mongoose.model('User', userSchema)
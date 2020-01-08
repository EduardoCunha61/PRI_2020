const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    ultimoacesso: String
});

module.exports = mongoose.model('users', userSchema)
const mongoose = require('mongoose')

var utilizadoresSchema = new mongoose.Schema({
    nome: String,
    email: String,
    password: String,
    ultimoacesso: String
});

module.exports = mongoose.model('utilizadores', utilizadorSchema)
const mongoose = require('mongoose')

var testSchema = new mongoose.Schema({
    type: {type: String, enum: ['Teste', 'Exame'], required: true},
    uc: {type: String, required: true},
    date: {type: String, required: true},
    local: {type: String, required: true},
    file: {type: Buffer, contentType: String}, //Ficheiros com tamanho inferior a 16MB
    users: Array
});

module.exports = mongoose.model('tests', testSchema)
const mongoose = require('mongoose')

var evaluationSchema = new mongoose.Schema({
    tipo: {type: String, enum: ['Teste', 'Exame','Trabalho'], required: true},
    uc: {type: String, required: true},
    data: {type: String, required: true},
    local: {type: String, required: true},
    file: {type: Buffer, contentType: String}, //Ficheiros com tamanho inferior a 16MB
    users: Array
});

module.exports = mongoose.model('evaluations', evaluationSchema)
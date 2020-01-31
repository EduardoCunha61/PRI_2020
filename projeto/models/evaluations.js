const mongoose = require('mongoose')

var evaluationSchema = new mongoose.Schema({
    user: String,
    tipo: {type: String, enum: ['Teste', 'Exame','Trabalho'], required: true},
    uc: {type: String, required: true},
    data: {type: String, required: true},
    hinicio: {type: String, required: true},
    hfim: {type: String, required: true},

    local: {type: String, required: true},
    file: String, //Ficheiros com tamanho inferior a 16MB
    users: Array
},{
    timestamps:true

});

module.exports = mongoose.model('evaluations', evaluationSchema)
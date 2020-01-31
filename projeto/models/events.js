const mongoose = require('mongoose')

var eventSchema = new mongoose.Schema({
    user:String,
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    data: {type: String, required: true},
    local: {type: String, required: true},
    hinicio: String,
    hfim: String,
    description: String,
    file:String, //Ficheiros com tamanho inferior a 16MB
    users: []
},{
    timestamps: true
});

module.exports = mongoose.model('events', eventSchema)
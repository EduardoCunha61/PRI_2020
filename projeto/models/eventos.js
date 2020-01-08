const mongoose = require('mongoose')

var eventoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    data: {type: String, required: true},
    hinicio: String,
    hfim: String,
    desc: String,
    utilizadores: Array
});

module.exports = mongoose.model('eventos', eventoSchema)
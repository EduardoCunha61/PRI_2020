const mongoose = require('mongoose')

var pubSchema = new mongoose.Schema({
    data: {type: String, required: true}, //Tipo String ou Date, qual usar?
    description: String,
    file:String, //Ficheiros com tamanho inferior a 16MB
    user: String,
    likes:[]
},{
    timestamps:true
});

module.exports = mongoose.model('pubs', pubSchema)
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var BlackListSchema = new Schema({
    token: {type :String, required:true},
});

module.exports = mongoose.model('BlackListSchema', BlackListSchema, 'BlackLists');
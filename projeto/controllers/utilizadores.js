var Utilizador = require('../models/utilizadores')

module.exports.listar = () => {
    return Utilizador
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Utilizador
        .findOne({email: id})
        .exec()
}

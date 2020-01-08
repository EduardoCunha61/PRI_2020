var User = require('../models/users')

module.exports.listar = () => {
    return User
        .find()
        .exec()
}

module.exports.consultar = id => { // Procura por email
    return User
        .findOne({email: id})
        .exec()
}

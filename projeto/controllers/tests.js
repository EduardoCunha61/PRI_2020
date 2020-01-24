var Test = require('../models/tests')

module.exports.listar = () => {
    return Test
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Event
        .findOne({titulo:id})
        .exec()
}
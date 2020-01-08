var Evento = require('../models/eventos')

module.exports.listar = () => {
    return Evento
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Evento
        .findOne({: id})
        .exec()
}

module.exports.filtrarUtilizador = uid => {
    return Evento
        .aggregate([{$unwind:"$utilizadores"}, {$match:{utilizadores:uid}}])
        .exec()
}
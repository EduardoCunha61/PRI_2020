var Evento = require('../models/events')

// Lista de eventos

module.exports.listar = () => {
    return Evento
        .find()
        .sort({data: -1})
        .exec()
}

// Lista os eventos do tipo T
module.exports.listarTipo = tipo => {
    return Evento
        .find({tipo: tipo})
        .sort({data: -1})
        .exec()
}

// Lista os eventos depois da data D
module.exports.listarData = data => {
    return Evento
        .find({data: {$gte: data}})
        .sort({data: -1})
        .exec()
}

// Lista os eventos na data D
module.exports.listarDataExact = data => {
    return Evento
        .find({data: data})
        .sort({data: -1})
        .exec()
}

// Devolve a informacao do evento com id
module.exports.consultar = eid => {
    return Evento
        .findOne({_id: eid})
        .exec()
}

module.exports.inserir = evento => {
    return Evento.create(evento)
}

module.exports.participar = (id,user) => {
    return Evento
        .update({_id: id},
        { $addToSet: {users: user}})
         
}
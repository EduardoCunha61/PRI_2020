var Pub = require('../models/pubs')

// Lista de Pubs

module.exports.listar = () => {
    return Pub
        .find()
        .sort({data: -1})
        .exec()
}

// Lista os Pubs depois da data D
module.exports.listarData = data => {
    return Pub
        .find({data: {$gte: data}})
        .sort({data: -1})
        .exec()
}

// Lista os Pubs na data D
module.exports.listarDataExact = data => {
    return Pub
        .find({data: data})
        .sort({data: -1})
        .exec()
}

// Lista as avaliacoes do tipo T
module.exports.pubsbyUser = username => {
    return Pub
        .find({user: username})
        .sort({data: -1})
        .exec()
}

// Devolve a informacao do Pub com id
module.exports.consultar = eid => {
    return Pub
        .findOne({_id: eid})
        .exec()
}

module.exports.inserir = pub => {
    return Pub.create(pub)
}
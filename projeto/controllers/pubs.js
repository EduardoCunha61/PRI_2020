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

module.exports.consultarlike = (pubid,userid) => {
    return Pub
        .findOne({_id: pubid})
        .exec()
}

module.exports.removelike = (pubid,userid) => {
    return Pub
        .update({_id: pubid}, {$pull: {likes:userid}})
        .exec()
}

module.exports.addlike = (pubid,userid) => {
    return Pub
        .update({_id: pubid}, {$push: {likes: userid}})
        .exec()
}

module.exports.inserir = pub => {
    return Pub.create(pub)
}
module.exports.save = pub => {
    return Pub.create(pub)
}
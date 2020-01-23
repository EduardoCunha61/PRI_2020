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

// Devolve a informacao do Pub com id
module.exports.consultar = eid => {
    return Pub
        .findOne({_id: eid})
        .exec()
}

// Insere um Pub na agenda
/* module.exports.inserir = Pub => {
    var novo = new Pub(Pub)
    return new Promise(function (fulfill, reject){
        novo.save(erro => {
            if(erro) reject({erro: "Erro no envio à BD."})
            else fulfill({ok: "Registo inserido na BD."})
    })
})} */

module.exports.inserir = Pub => {
    return Pub.create(Pub)
}
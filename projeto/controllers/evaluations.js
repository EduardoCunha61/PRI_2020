var Evaluation = require('../models/evaluations')

module.exports.listar = () => {
    return Evaluation
        .find()
        .sort({data: -1})
        .exec()
}

// Lista as avaliacoes do tipo T
module.exports.listarTipo = tipo => {
    return Evaluation
        .find({tipo: tipo})
        .sort({data: -1})
        .exec()
}

// Lista as avaliacoes depois da data D
module.exports.listarData = data => {
    return Evaluation
        .find({data: {$gte: data}})
        .sort({data: -1})
        .exec()
}

// Lista as avaliacoes na data D
module.exports.listarDataExact = data => {
    return Evaluation
        .find({data: data})
        .sort({data: -1})
        .exec()
}

// Devolve a informacao do evento com id
module.exports.consultar = eid => {
    return Evaluation
        .findOne({_id: eid})
        .exec()
}

module.exports.inserir = evaluation => {
    return Evaluation.create(evaluation)
}

module.exports.participar = (id,user) => {
    return Evaluation
        .update({_id: id},
        { $addToSet: {users: user}})
         
}
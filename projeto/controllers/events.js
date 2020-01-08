var Event = require('../models/events')

module.exports.listar = () => {
    return Event
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Event
        .findOne({titulo:id})
        .exec()
}

module.exports.filtrarUser = uid => {
    return Event
        .aggregate([{$unwind:"$users"}, {$match:{users:uid}}])
        .exec()
}
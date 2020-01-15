var BlackList = require("../models/blacklist");

module.exports.addToken = token =>{
  return BlackList.create(token)
}

module.exports.getToken = (token) => {
  return BlackList
    .findOne({token:token})
    .exec()
}

module.exports.list = () =>{
  return BlackList
    .find()
    //.sort{}
    .exec()
}
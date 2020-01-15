var User = require("../models/users");
const { body } = require('express-validator/check')


module.exports.register = user => {
	return User.create(user)
}

module.exports.getUser = (email) => {
	return User
		.findOne({ email: email })
		.exec()
}

module.exports.getUserByUsername = (username) => {
	return User
		.findOne({ username: username })
		.exec()
}

module.exports.getUserById = (id) => {
	return User
		.findById(id)
		.exec()
}

module.exports.list = () => {
	return User
		.find()
		//.sort{}
		.exec()
}

module.exports.listByRole = role => {
	return User
		.find({ role: role })
		//.sort({})
		.exec()
}

// module.exports.edit = users =>{
//  return User.create(user)
// }

module.exports.removeByID = (id) =>{
	return User
		.deleteOne({_id: id})
		.exec()
}

module.exports.validate = (method) => {
	switch (method) {
		case 'createUser': {
			return [
				body('username', "username doesn't exists").exists(),
				body('email', 'Email inválido').exists().isEmail(),
				body('name').exists(),
				body('password').exists(),
				body('role').custom(value => {
					if (value !== 'user') {
						throw new Error('Wrong role');
					} else return true;
				})
			]
		}
		case 'createAdmin': {
			return [
				body('username', "username doesn't exists").exists(),
				body('email', 'Email inválido').exists().isEmail(),
				body('name').exists(),
				body('password').exists(),
				body('role').custom(value => {
					if (value !== 'admin') {
						throw new Error('Wrong role');
					} else return true;
				})
			]
		}
	}
}
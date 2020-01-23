const mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt= require('bcrypt')


var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
	role: { type: String, required: true },
	img: {data: Buffer, contentType: String },
    ultimoacesso: String
});


UserSchema.pre('save', async function (next) {
	var self = this;
	var User = mongoose.model('UserSchema', UserSchema, 'users');
	await User.findOne({ email: self.email }, async function (err, results) {
		if (err) next(err);
		else if (results) {
			self.invalidate("email", "E-mail já registado");
			return next(new Error("E-mail já registado"));
		}
	});
	await User.findOne({ username: self.username }, async function (err, results) {
		if (err) next(err);
		else if (results) {
			self.invalidate("email", "Username já existe");
			return next(new Error("Username já existe"));
		}
	});
	var hash = await bcrypt.hash(self.password, 10)
	self.password = hash
	next()
})

UserSchema.methods.isValidPassword = async function (password) {
	var user = this
	var compare = await bcrypt.compare(password, user.password)
	console.log("valida: " + JSON.stringify(compare))
	return compare
}


module.exports = mongoose.model('UserSchema', UserSchema, 'users');

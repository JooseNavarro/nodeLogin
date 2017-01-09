//mongoose
var mongoose = require('mongoose');

//bcrypt library
var bcrypt = require('bcrypt-nodejs');

//model User
var userSchema = mongoose.Schema({
	local: 	{
		email: 		String,
		password: 	String
	}
});

//bcrypt hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);	
};

//validar hash, verifica si la contraseña digitada por el usuario es correcta o no
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
}


//exports
module.exports = mongoose.model('User', userSchema);

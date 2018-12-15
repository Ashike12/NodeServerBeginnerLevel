var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userScheme = mongoose.Schema({
    local: {
        username: String,
        password: String,
        email: String
    }
});

userScheme.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userScheme.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('Users', userScheme);
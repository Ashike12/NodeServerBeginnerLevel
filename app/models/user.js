var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
    local: {
        username: String,
        password: String,
        email: String
    }
});

module.exports = mongoose.model('Users', userScheme);
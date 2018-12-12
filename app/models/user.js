var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
    local: {
        username: String,
        password: String
    }
});

module.exports = mongoose.model('Users', userScheme);
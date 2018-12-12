var express = require('express');
var app = express();
var port = process.env.PORT || 8081;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useNewUrlParser: true });

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret: 'a1b2c3e5',
                saveUninitialized: true,
                resave: true}));

// app.use('/', function(req, res){
//     res.send('First express program');
//     console.log(req.cookies);
//     console.log("==============");
//     console.log(req.session);
// });

require('./app/route.js')(app);

app.listen(port);
console.log('server running on port ' + port);
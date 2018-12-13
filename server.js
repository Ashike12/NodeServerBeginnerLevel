var express = require('express');
var app = express();
var port = process.env.PORT || 8081;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useNewUrlParser: true });
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystring',
                saveUninitialized: true,
                resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // need to be initialized after express session.
app.use(flash());

app.set('view engine', 'ejs');

// app.use('/', function(req, res){
//     res.send('First express program');
//     console.log(req.cookies);
//     console.log("==============");
//     console.log(req.session);
// });

require('./app/route.js')(app, passport);

app.listen(port);
console.log('server running on port ' + port);
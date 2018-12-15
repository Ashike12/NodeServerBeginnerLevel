var User = require('./models/user.js')

module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        // res.send("Hello world");
        res.render('index.ejs');
    });

    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        // res.render('signup.ejs', { message: 'Victory' });
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // app.post('/signup', function(req, res){
    // 	var newUser = new User();
    // 	newUser.local.email = req.body.email || "";
    //     newUser.local.password = req.body.password || "";
    //     newUser.local.username = req.body.username || "";
    // 	newUser.save(function(err){
    // 		if(err)
    // 			throw err;
    // 	});

    // 	res.redirect('/');
    // });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', { user: req.user });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));


    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // app.get('/:userInfo', function(req, res){
    //     var newUser = new User();
    //     var userInfo = JSON.parse(req.params.userInfo);
    //     newUser.local.username = userInfo.username; 
    //     newUser.local.password = userInfo.password; 

    //     console.log(newUser.local.username + ' ' + newUser.local.password);
    //     newUser.save(function(err){
    //         if(err){
    //             throw err;
    //         }
    //     });
    //     res.send("success");
    // });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}
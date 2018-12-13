var User = require('./models/user.js')

module.exports = function(app, passport){
    app.get('/', function(req, res){
        // res.send("Hello world");
        res.render('index.ejs');
    });

    app.get('/signup', function(req, res){
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

    app.get('/:userInfo', function(req, res){
        var newUser = new User();
        var userInfo = JSON.parse(req.params.userInfo);
        newUser.local.username = userInfo.username; 
        newUser.local.password = userInfo.password; 

        console.log(newUser.local.username + ' ' + newUser.local.password);
        newUser.save(function(err){
            if(err){
                throw err;
            }
        });
        res.send("success");
    });
}
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function (passport) {


	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, email, password, done) {
			process.nextTick(function () {
				User.findOne({ 'local.email': email }, function (err, user) {
					if (err)
						return done(err);
					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email already taken'));
					}
					if (!req.user) {
						var newUser = new User();
						newUser.local.email = email || "";
						newUser.local.password = newUser.generateHash(password) || "";

						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
					else {
						var user = req.user;
						user.local.email = email || "";
						user.local.password = user.generateHash(password) || "";

						user.save(function (err) {
							if (err)
								throw err;
							return done(null, user);
						});
					}
				});

			});
		}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, email, password, done) {
			process.nextTick(function () {
				User.findOne({ 'local.email': email }, function (err, user) {
					if (err)
						return done(err);
					if (!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if (!user.validPassword(password)) {
						return done(null, false, req.flash('loginMessage', 'inavalid password'));
					}
					return done(null, user);

				});
			});
		}
	));

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientId,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'displayName', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link'],
		passReqToCallback: true
	},
		function (req, accessToken, refreshToken, profile, done) {
			process.nextTick(function () {
				if (!req.user) {
					User.findOne({ 'facebook.id': profile.id }, function (err, user) {
						if (err) {
							return done(err);
						}
						if (user) {
							return done(null, user);
						} else {
							var newUser = new User();
							newUser.facebook.id = profile.id;
							newUser.facebook.token = accessToken;
							newUser.facebook.name = profile.displayName;
							newUser.facebook.email = profile.emails[0].value;

							newUser.save(function (err) {
								if (err) {
									return err;
								}
								return done(null, newUser);
							});
						}

					});
				} else {
					var user = req.user;
					user.facebook.id = profile.id;
					user.facebook.token = accessToken;
					user.facebook.name = profile.displayName;
					user.facebook.email = profile.emails[0].value;

					user.save(function (err) {
						if (err) {
							return err;
						}
						return done(null, user);
					});
				}

			});
		}
	));
	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientId,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL,
		passReqToCallback: true
	},
		function (req, accessToken, refreshToken, profile, done) {
			process.nextTick(function () {
				if (!req.user) {
					User.findOne({ 'google.id': profile.id }, function (err, user) {
						if (err) {
							return done(err);
						}
						if (user) {
							return done(null, user);
						} else {
							var newUser = new User();
							newUser.google.id = profile.id;
							newUser.google.token = accessToken;
							newUser.google.name = profile.displayName;
							newUser.google.email = profile.emails[0].value;

							newUser.save(function (err) {
								if (err) {
									return err;
								}
								return done(null, newUser);
							});
							// console.log(profile);
						}

					});
				} else {
					var user = new User();
					user.google.id = profile.id;
					user.google.token = accessToken;
					user.google.name = profile.displayName;
					user.google.email = profile.emails[0].value;

					user.save(function (err) {
						if (err) {
							return err;
						}
						return done(null, user);
					});
					// console.log(profile);
				}

			});
		}
	));

}
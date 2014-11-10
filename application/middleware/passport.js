var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google').OAuth2Strategy,
    Person = require('../model/person'),
    Auth = require('../hra/bo/auth');


module.exports = function (passport, config) {

  passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Person.findUserForAuth([id], function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      Person.isValidUserPassword({userEmail : email, password: password}, done);
    })
  );

  passport.use(new FacebookStrategy({
    clientID: config.Facebook.clientID,
    clientSecret: config.Facebook.clientSecret,
    callbackURL: config.Facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      Person.getFBoAuthUser(profile, function (err, user) {
        return done(err, user);
      });
    }));

  passport.use(new GoogleStrategy({
      clientID: config.Google.clientID,
      clientSecret: config.Google.clientSecret,
      callbackURL: config.Google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      profile.authOrigin = 'google';
      User.findOrCreateOAuthUser(profile, function (err, user) {
        return done(err, user);
      });
    }
  ));

}

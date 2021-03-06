var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    Db = require('../models/'),
    Person = require('../bo/person'),
    console = require("console-plus");


module.exports = function (passport, config) {

  passport.serializeUser(function(Person, done) {
    if (Person.email)
      done(null, Person)
    else
      done(null, false, {'error' : "Can't serialize user"})
  });

  passport.deserializeUser(function(user, done) {
    if (user.id) {
      Person.getOne(user.id).then(function (User) {
        done(null, User)
      }).catch(function (err) {
        return done(err, false, {'error' : "Can't deserialize user"}); 
      })
    }
  });

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      var profile = {
        email : email,
        password : password
      }
      Person.authFindOrCreate(profile, done);
    })
  );

  passport.use(new FacebookStrategy({
    clientID: config.Facebook.clientID,
    clientSecret: config.Facebook.clientSecret,
    callbackURL: config.Facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      profile.authOrigin = 'facebook';
      Person.authFindOrCreate(profile, done);
    }));

  passport.use(new GoogleStrategy({
      clientID: config.Google.clientID,
      clientSecret: config.Google.clientSecret,
      callbackURL: config.Google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      profile.authOrigin = 'google';
      Person.authFindOrCreate(profile, done);
    }
  ));

}


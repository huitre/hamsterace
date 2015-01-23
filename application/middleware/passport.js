var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    Db = require('../models/'),
    Auth = require('../hra/bo/auth'),
    console = require("console-plus");


module.exports = function (passport, config) {

  passport.serializeUser(function(Person, done) {
    done(null, Person)
  });

  passport.deserializeUser(function(User, done) {
    console.log(User)
    if (User.id) {
      User.find({ 
        where : {
          id : User.id
        },
        include : [ Db.PersonDetails ]
      }).then( function (user) {
        done(null, user);
      })
    }
    done({'Error' : 'Unable to deserialize User'});
  });

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      Db.Person.find({ 
          where : {
            email: email,
            password : password
          },
          include : [ Db.PersonDetails ]
      }).then(done)  
    })
  );

  passport.use(new FacebookStrategy({
    clientID: config.Facebook.clientID,
    clientSecret: config.Facebook.clientSecret,
    callbackURL: config.Facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      Db.findOrCreate({
        where : {
          email : profile.emails[0].value
        }
      }).spread(function (User) {
        return done(User.toPassport());
      });
    }));

  passport.use(new GoogleStrategy({
      clientID: config.Google.clientID,
      clientSecret: config.Google.clientSecret,
      callbackURL: config.Google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      profile.authOrigin = 'google';
      Db.Person.findOrCreate({
        where : {
          email : profile.emails[0].value,
          gid : profile.id
        }
      }).spread(function (User) {
        return done(null, User);
      }).catch(function (err) {
        console.log(err.errors);
        done(err);
      });
    }
  ));

}


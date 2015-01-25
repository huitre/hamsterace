var console = require('console-plus'),
    Passport = require('passport'),
    Db = require('../models');

var AuthController = (function () {

  /*
   * Endpoint for local signup
   * @params req express request
   */
  this.signIn = function (req, res) {
    
  }

  this.login = function (req, res, next) {
    if (!req.body.password || req.body.password.trim() == "" 
      || !req.body.email || req.body.email.trim() == "") {
      throw new Error('Email or password cannot be empty');
    }
    Passport.authenticate('local',{
      successRedirect : "/me/feed",
      failureRedirect : "/",
    })(req, res, next)
  }

  this.login.google = function (req, res, next) {
    Passport.authenticate(
      'google',
      {
        scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
        ]
      })(req, res, next)
  }

  this.login.google.ok = function (req, res, next) {
    Passport.authenticate('google', { 
      successRedirect : "/me",
      failureRedirect : "/"
    })(req, res, next)
  }

  this.login.fb = function (req, res, next) {
    Passport.authenticate('facebook', { 
      successRedirect : "/me",
      failureRedirect : "/"
    })(req, res, next)
  }

  this.login.fb.ok = function (req, res, next) {
    Passport.authenticate('facebook', { 
      successRedirect : "/me",
      failureRedirect : "/"
    })(req, res, next)
  }
  
  return this;

})();

if (typeof module !== 'undefined') {
  module.exports = AuthController;
}
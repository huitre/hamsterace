var AuthController = (function () {
  var bo = require('../hra/bo/auth.js'),
      Passport = require('passport'),
      // config
      Config = require('config');


  /*
   * Endpoint for local login
   * @params req express request
   */
  function login (req, res) {
    res.send('this is index');
  }

  /*
   * Endpoint for local signup
   * @params req express request
   */
  var signup = function (req, res) {
    if (req.body.email.length && req.body.password.length) {
      bo.signup(req.body.email, req.body.password, req.body.name,
        function(err, user){
          if(err) throw err;
          req.login(user, function(err){
            if(err) return next(err);
            return res.redirect("/me");
          });
        });
    }
    return onFail(res, new Error('missing.parameters'));
  }

  /*
   * Endpoint for facebook signup
   * @params req express request
   */
  signup.fb = function (req, res) {

  }

  /*
   * Endpoint for google signup
   * @params req express request
   */
  signup.google = function (req, res) {

  }


  /*
   * Generic success call back
   * @param res express response object
   * @param success obj
   */
  function onSuccess (res, success) {
    res.status(200).send(success);
  }


  /*
   * Generic error call back
   * @param obj express response object
   * @param obj error
   */
  function onFail (res, err) {
    res.status(500).send(err);
  }

  return {
    "login" : login,
    "signup" : signup,
  }
})();

if (typeof module !== 'undefined') {
  module.exports = AuthController;
}
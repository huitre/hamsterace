var console = require('console-plus'),
    Promise = require("bluebird"),
    Db = require('../models');

var DeviceModel = (function () {
  /*
   * Requirements
   */
  var bo = require('../models').Device,
      crypto = require('crypto'),
      Mandrill = require('mandrill-api/mandrill'),
      Utils = require('../hra/lib/utils'),
      // config
      Config = require('config'),
      self = this;

  /*
   * First we check if with can find a device with the
   * user key and public key, then we insert the user email 
   * into a temporary table to future activation
   *
   * @params req        Express request object containing :
   *  @params userKey
   *  @params apiKey
   *  @params userEmail
   * @params onSuccess  Callback when everything went as planned
   * @params onFail     Callback when everything is fucked up
   */
  this.register = function (req, done) {
    var uKey = req.param('userKey'),
        privateKey = req.param('privateKey'),
        apiKey = req.param('apiKey'),
        email = req.param('userEmail'),
        token = createToken(uKey, apiKey);
 
      bo.getDeviceUserKey([uKey, privateKey, apiKey], function (err, rows, result) {
        if (err) return ({'error': err, 'message': 'user.key.invalid'});
        if (rows && rows.length > 0) {
          bo.registerUserDevice([token, email], function (err, rows, result) {
            if (err) return done({'error': err, 'message': 'user.registered.fail'});
//            sendRegistrationMail(token, email, done, done)
          });
        }
      });
  }

  /*
   * Return a token based on the user secret key and the device secret key
   * This token is used for activation when the user is registered
   */
  this.createToken = function (uKey, apiKey) {
    return crypto.createHash('md5').update(uKey).update(apiKey).update(new Date().getTime() + '').digest('hex');
  }


  /*
   * @params req        Express request object containing :
   *  @params userKey
   *  @params apiKey
   *  @params userEmail
   * @params res        Express response object
   * @params onSuccess  Callback when everything went as planned
   * @params onFail     Callback when everything is fucked up
   */
  this.activate = function (req, onActivated) {
    var token = req.param('token'),
        email = req.param('email');

      bo.getRegisteredUser([token, email], 
        function (err, rows, result) {
          if (err) return onActivated(new Error({'error': err, 'message': 'user.key.invalid'}));
          var when = new Date().getTime();
          bo.activateUserDevice([email, when, when], onRegisterDevice);
        }
      );

      var onRegisterDevice = function (err, rows, result) {
        if (err) return onActivated(err);
        bo.deleteOldToken([token, email], 
          function (err, rows, result) {
            if (err) return onActivated(new Error({'error': err, 'message': 'user.registered.fail'}));
  //          sendActivationMail(email, onActivated, onActivated);
          }
        );
      };
  }

  this.find = function (User, done) {
    Db.RegisteredDevice.find({
      where: {
        PersonId : User
      }
    }).then(function (Device) {
      return done(null, Device)
    }).catch(function (e) {
      return done(e)
    })
  }
  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceModel;
}
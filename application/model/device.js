var DeviceModel = (function () {
  /*
   * Requirements
   */
  var pg = require('../hra/database')(),
      bo = require('../hra/bo/device.js'),
      crypto = require('crypto');

  /*
   * First we check if with can find a device with the
   * user key and public key, then we insert the user email 
   * into a temporary table to future activation
   *
   * @params req        Express request object containing :
   *  @params userKey
   *  @params apiKey
   *  @params userEmail
   * @params res        Express response object
   * @params onSuccess  Callback when everything went as planned
   * @params onFail     Callback when everything is fucked up
   */
  var register = function (req, res, onSuccess, onFail) {
    var uKey = req.param('userKey'),
        privateKey = req.param('privateKey'),
        apiKey = req.param('apiKey'),
        email = req.param('userEmail'),
 
      onKeyExists = function (row) {
        bo.registerUserDevice([createToken(uKey, apiKey), email], onRegisterDevice, onError);
      },

      onRegisterDevice = function (row) {
        onSuccess(res, {content: row, 'message' : 'user.register.success'});
      },

      onNull = function () {
        onFail(res, {'message': 'user.key.invalid'});
      },

      onError = function (err) {
        onFail(res, {'error': err, 'message': 'user.registered.fail'});
      };

      bo.getDeviceUserKey([uKey, privateKey, apiKey], onKeyExists, onNull);
  }

  var createToken = function (uKey, apiKey) {
    return crypto.createHash('md5').update(uKey).update(apiKey).digest('hex');
  }

  return {
    register : register
  }
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceModel;
}
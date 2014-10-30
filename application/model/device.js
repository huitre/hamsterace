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
   * @params userKey
   * @params apiKey
   * @params userEmail
   */
  var register = function (req, onSuccess, onFail) {
    var uKey = req.param('userKey'),
        apiKey = req.param('serialNumber'),
        email = req.param('userEmail'),
 
      onKeyExists = function (row) {
        console.log(row);
        bo.registerUserDevice(row, onRegisterDevice, onError);
      },

      onRegisterDevice = function (row) {
        onSuccess({content: row, 'message' : 'user.register.success'});
      },

      onNull = function () {
        onFail({'message': 'user.key.invalid'});
      },

      onError = function () {
        onFail({'message': 'user.registered.fail'});
      };

      bo.getDeviceUserKey([uKey, apiKey], onKeyExists, onNull);
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
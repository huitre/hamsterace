var DeviceModel = (function () {
  /*
   * Requirements
   */
  var pg = require('../hra/database')(),
      bo = require('../hra/bo/device.js');

  var register = function (req, res) {
    var uKey = req.param('userKey'),
        apiKey = req.param('serialNumber'),
        email = req.param('userEmail');

    bo.getDeviceUserKey([uKey, apiKey], onKeyExists, onNull);
    
    var onKeyExists = function (row) {
        console.log(row)
        bo.registerUserDevice(row, onRegisterDevice, onError);
      },

      onNull = function () {
        res.status(500).send({'message': 'user.key.invalid'})
      },

      onRegisterDevice = function () {

      },

      onError = function () {

      };
  }
  return {
    register : register
  }
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceModel;
}
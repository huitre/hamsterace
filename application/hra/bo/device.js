var DeviceBO = (function () {
  /*
   * Requirements
   */
  var pg = require('../database')(),

  getDeviceUserKey = function (params, onRows, onNull) {
    pg("SELECT * FROM DEVICE WHERE PRIVATE_KEY = $2 AND USER_KEY = $1 AND SERIAL_NUMBER = $3", params,
        function(err, rows, result) {
          if (rows && rows.length > 0) {
            return onRows(rows);
          } 
          return onNull(err);
        }
      )
  },

  registerUserDevice = function (params, onInsert, onError) {
    console.log(params);
    var pg = require('../database')()
    pg("INSERT INTO PERSON_REGISTERED (id, token, email) VALUES(DEFAULT, $1, $2) RETURNING ID", params, 
        function(err, rows, result) {
          if (rows && rows.length > 0) {
            onInsert(rows);
          } 
          return onError(err);
        }
      )
  }
  return {
    getDeviceUserKey : getDeviceUserKey,
    registerUserDevice: registerUserDevice
  }
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceBO;
}
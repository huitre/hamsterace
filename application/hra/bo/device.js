var DeviceBO = (function () {
  /*
   * Requirements
   */
  var pg = require('../database')(),

  getDeviceUserKey = function (params, onRows, onNull) {
    pg("SELECT * FROM DEVICE WHERE PRIVATE_KEY = $1", params,
        function(err, rows, result) {
          if (rows && rows.length > 0) {
            return onRows(rows);
          } 
          return onNull(err);
        }
      )
  },

  registerUserDevice = function (params, onInsert, onError) {
    pg("SELECT * FROM DEVICE WHERE SERIAL_NUMBER = $1", [params], 
        function(err, rows, result) {
          if (rows && rows.length > 0) {
            return onRows(rows);
          } 
          return onNull(err);
        }
      )
  }
  return {
    getDeviceUserKey : getDeviceUserKey
  }
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceBO;
}
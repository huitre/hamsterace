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
    pg("INSERT INTO PERSON_REGISTERED (id, token, email) VALUES(DEFAULT, $1, $2) RETURNING ID", params, 
      function(err, rows, result) {
        if (!err) return onInsert(rows);
        return onError(err);
      }
    )
  },

  activateUserDevice = function (params, onInsert, onError) {
    pg("INSERT INTO PERSON (id, email, created, updated) VALUES(DEFAULT, $1, to_timestamp($2), to_timestamp($3)) RETURNING ID", params, 
      function(err, rows, result) {
        if (!err) return onInsert(rows);
        return onError(err);
      }
    )
  },

  deleteOldToken = function (params, onDelete, onError) {
    pg("DELETE FROM PERSON_REGISTERED WHERE TOKEN = $1 AND EMAIL = $2", params, 
      function(err, rows, result) {
        if (!err) return onDelete(result);
        return onError(err);
      }
    )
  },

  getRegisteredUser = function (params, onRows, onNull) {
    pg("SELECT * FROM PERSON_REGISTERED WHERE TOKEN = $1 AND EMAIL = $2", params,
      function(err, rows, result) {
        if (!err) return onRows(rows);
        return onNull(err);
      }
    )
  }

  return {
    getDeviceUserKey : getDeviceUserKey,
    registerUserDevice: registerUserDevice,
    activateUserDevice: activateUserDevice,
    getRegisteredUser: getRegisteredUser,
    deleteOldToken: deleteOldToken
  }
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceBO;
}
var DeviceBO = (function () {
  /*
   * Requirements
   */
  var pg = require('../database')(),

  getDeviceUserKey = function (params, done) {
    pg("SELECT * FROM DEVICE WHERE PRIVATE_KEY = $2 AND USER_KEY = $1 AND SERIAL_NUMBER = $3", 
      params, 
      done
    );
  },

  registerUserDevice = function (params, done) {
    pg("INSERT INTO PERSON_REGISTERED (id, token, email) VALUES(DEFAULT, $1, $2) RETURNING ID", 
      params, 
      done
    );
  },

  activateUserDevice = function (params, done) {
    pg("INSERT INTO PERSON (id, email, created, updated) VALUES(DEFAULT, $1, to_timestamp($2), to_timestamp($3)) RETURNING ID", params, 
      done
    );
  },

  deleteOldToken = function (params, done) {
    pg("DELETE FROM PERSON_REGISTERED WHERE TOKEN = $1 AND EMAIL = $2", params, done);
  },

  getRegisteredUser = function (params, done) {
    pg("SELECT * FROM PERSON_REGISTERED WHERE TOKEN = $1 AND EMAIL = $2", params, done);
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
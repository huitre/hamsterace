"use strict";

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Device', {
    apiKey : { type : DataTypes.INTEGER }, // public key
    userKey : { type : DataTypes.STRING(32) },
    privateKey: { type : DataTypes.STRING(32) }
  }, {
    classMethods : {
      register : function () {},
      createToken : function (uKey, apikey) {
        return crypto.createHash('md5').update(uKey).update(apiKey).update(new Date().getTime() + '').digest('hex');
      },
      activate : function () {}
    }
  });
};


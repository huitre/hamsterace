"use strict";

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Device', {
    apiKey : { type : DataTypes.INTEGER }, // public key
    userKey : { type : DataTypes.STRING(32) },
    privateKey: { type : DataTypes.STRING(32) }
  }, 
  {
    associate: function (models) {
      models.Device.hasMany(models.RegisteredDevice);
      models.Device.hasMany(models.EventWeekly) 
    }
  });
};


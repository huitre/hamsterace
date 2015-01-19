"use strict"

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RegisteredDevice', {
    hash : { type: DataTypes.STRING }
  }, {
    classMethods : {
      associate: function (models) {
        RegisteredDevice.hasMany(models.RegisteredPerson);
      }
    }
  });
};
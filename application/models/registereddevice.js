"use strict"

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RegisteredDevice', {
    hash : { type: DataTypes.STRING }
  }, 
  {
    associate: function (models) {
      models.RegisteredDevice.belongsTo(models.RegisteredPerson);
      models.RegisteredPerson.belongsTo(models.Person);
    }  
  });
};
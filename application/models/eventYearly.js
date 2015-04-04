"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("EventYearly", {
    timeval : {type : DataTypes.JSON},
    activity : {type : DataTypes.STRING(3)},
    summary : {type : DataTypes.JSON}
  },
  {
    associate: function (models) {
     models.Device.hasMany(models.EventYearly) 
    }
  });
}

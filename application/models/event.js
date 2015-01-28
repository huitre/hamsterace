"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Event", {
    content : { type : DataTypes.STRING(50) },
    type : { type : DataTypes.ENUM('laps', 'lapsStart', 'lapsStop')}
  },
  {
   associate: function (models) {
      models.Event.belongsTo(models.Device);
    }
  });
}
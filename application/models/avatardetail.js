"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("AvatarDetail", {
    resource : { type : DataTypes.STRING(50) },
    pos : { type : DataTypes.JSON },
    scale : { type : DataTypes.JSON },
    opacity : { type : DataTypes.STRING(1) },
  },
  {
   associate: function (models) {
      models.AvatarDetail.belongsTo(models.Avatar);
    }
  });
}
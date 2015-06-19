"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Avatar", {
    length : { type : DataTypes.STRING(1) },
  },
  {
    associate: function (models) {
     models.Avatar.hasMany(models.AvatarDetail) 
     models.Avatar.belongsTo(models.Image);
    }
  });
}

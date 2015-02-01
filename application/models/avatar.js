"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Avatar", {
    email : { type : DataTypes.STRING(50), unique: true},
    hash: { type : DataTypes.STRING(32) }
  },
  {
    associate: function (models) {
     models.Avatar.hasMany(models.AvatarDetail) 
    }
  });
}

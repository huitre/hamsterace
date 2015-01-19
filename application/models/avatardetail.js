"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("AvatarDetail", {
    content : { type : DataTypes.BLOB, unique: true}
  },
  {
   associate: function (models) {
      models.AvatarDetail.belongsTo(models.Avatar);
    }
  });
}
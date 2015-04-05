"use strict"

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Image', {
    resource : { type : DataTypes.STRING(256) },
    size : { type : DataTypes.JSON },
    type : { type : DataTypes.ENUM('image/jpeg', 'image/png', 'image/gif')}
  }, {
    classMethods : {
      associate: function(models) {
        models.Image.belongsTo(models.AvatarDetail);
        models.Image.belongsTo(models.Person);
      }
    }
  });
};

"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Post", {
    content : { type : DataTypes.JSON }
  },
  {
   associate: function (models) {
      models.Post.belongsTo(models.Person)
      models.Post.hasMany(models.Comment)
    }
  });
}
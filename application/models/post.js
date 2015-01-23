"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Post", {
    content : { type : DataTypes.JSON }
  },
  {
   associate: function (models) {
      models.Post.hasMany(models.Person);
    }
  });
}
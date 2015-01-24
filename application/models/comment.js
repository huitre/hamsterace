"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Comment", {
    content : { type : DataTypes.JSON }
  },
  {
   associate: function (models) {
      models.Comment.belongsTo(models.Post);
      models.Comment.belongsTo(models.Person);
    }
  });
}
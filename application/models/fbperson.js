"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('FBPerson', 
  {
    email: { type : DataTypes.STRING(50), unique: true },
    fbid: { type : DataTypes.STRING(50), unique: true }
  },
  {
    associate: function (models) {
      models.FBPerson.belongsTo(models.Person);
    }
  });
}


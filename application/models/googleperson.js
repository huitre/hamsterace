"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('GooglePerson', 
  {
    email: { type : DataTypes.STRING(50), unique: true},
    gid: { type : DataTypes.STRING(50), unique: true}
  },
  {
    associate: function (models) {
      models.GooglePerson.belongsTo(models.Person);
    }
  });
}


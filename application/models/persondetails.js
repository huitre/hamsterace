"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('PersonDetails', 
  {
    type: { type : DataTypes.ENUM('hamster', 'owner', 'apps', 'page', 'guild') },
    name: { type : DataTypes.STRING(50) },
    firstname: { type : DataTypes.STRING(50) },
    gender: { type : DataTypes.ENUM('male', 'female') },
    age: { type : DataTypes.DATE }
  },
  {
    associate: function (models) {
      models.PersonDetails.belongsTo(models.Person);
    }
  });
}

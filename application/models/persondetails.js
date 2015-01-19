"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('PersonDetails', 
  {
    type: { type : DataTypes.ENUM('hamster', 'owner', 'apps', 'page', 'guild') },
    name: { type : DataTypes.STRING(50) },
    firstname : { type : DataTypes.STRING(50) }
  },
  {
    associate: function (models) {
      models.PersonDetails.belongsTo(models.Person);
    }
  });
}

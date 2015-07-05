"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('PeopleFriend', 
  {
    type: { type : DataTypes.ENUM('hamster', 'owner', 'apps', 'page', 'guild') },
    confirmed : { type : DataTypes.BOOLEAN },
    refused : { type : DataTypes.BOOLEAN }
  },
  {
    associate: function (models) {
      models.PeopleFriend.belongsTo(models.Person);
      models.PeopleFriend.belongsTo(models.Person, {as: 'Friend'});
    }
  });
}

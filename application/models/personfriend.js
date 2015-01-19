"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('PersonFriend', 
  {
    type: { type : DataTypes.ENUM('hamster', 'owner', 'apps', 'page', 'guild') }
  },
  {
    associate: function (models) {
      models.PersonFriend.belongsToMany(models.Person);
    }
  });
}

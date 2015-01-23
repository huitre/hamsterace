"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('Friend', 
  {
    type: { type : DataTypes.ENUM('hamster', 'owner', 'apps', 'page', 'guild') }
  },
  {
    associate: function (models) {
      models.Friend.belongsToMany(models.Person, {as : 'Friends', through: 'PeopleFriend'});
    }
  });
}

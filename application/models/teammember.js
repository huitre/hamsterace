"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('TeamMember', 
  {
    confirmed : { type : DataTypes.BOOLEAN },
    status : { type : DataTypes.ENUM('owner', 'admin', 'member')},
    xp : { type : DataTypes.INTEGER, defaultValue: 0 }
  },
  {
    associate: function (models) {
      models.TeamMember.belongsTo(models.Person);
    }
  });
}

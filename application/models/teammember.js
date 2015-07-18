"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('TeamMember', 
  {
    confirmed : { type : DataTypes.BOOLEAN },
    status : { type : DataTypes.ENUM('owner', 'admin', 'member')}
  },
  {
    associate: function (models) {
      models.TeamMember.belongsTo(models.Person);
    }
  });
}

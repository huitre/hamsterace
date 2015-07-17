"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('TeamMember', 
  {
    confirmed : { type : DataTypes.BOOLEAN }
  },
  {
    associate: function (models) {
      models.TeamMember.belongsTo(models.Team);
    }
  });
}

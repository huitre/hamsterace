"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Team", {
    name: { 
      type : DataTypes.STRING(60),
      unique : true
    },
    slogan: { type : DataTypes.STRING(60) },
    level: { type : DataTypes.INTEGER },
    exp: { type : DataTypes.INTEGER },
    maxmember: { type : DataTypes.INTEGER },
    recruit: { type : DataTypes.BOOLEAN},
    hidden: { type : DataTypes.BOOLEAN}
  },
  {
   associate: function (models) {
      models.Person.belongsToMany(models.Team, {through: models.TeamMember});
      models.Team.hasOne(models.Avatar);
      models.Team.hasMany(models.TeamMember);
    }
  });
}
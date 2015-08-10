"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Team", {
    name: { 
      type : DataTypes.STRING(60),
      unique : true
    },
    slogan: { type : DataTypes.STRING(150) },
    level: { type : DataTypes.INTEGER, defaultValue: 1 },
    xp: { type : DataTypes.INTEGER, defaultValue: 0 },
    maxmember: { type : DataTypes.INTEGER },
    recruit: { type : DataTypes.BOOLEAN, defaultValue: true},
    visible: { type : DataTypes.BOOLEAN, defaultValue: true}
  },
  {
   associate: function (models) {
      models.Person.belongsToMany(models.Team, {through: models.TeamMember});
      models.Team.hasOne(models.Avatar);
      models.Team.hasMany(models.TeamMember);
    }
  });
}
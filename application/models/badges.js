"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define("Badge", {
  	name : { type : DataTypes.STRING(30) },
    description : { type : DataTypes.STRING(100) },
    state : { type : DataTypes.ENUM('hidden', 'revealed', 'unlocked') },
    incremental : { type : DataTypes.BOOLEAN },
    points : { type : DataTypes.STRING(30) }
  },
  {
    associate: function (models) {
     models.Person.hasMany(models.Badge)
     models.Badge.hasOne(models.Image)
    }
  });
}

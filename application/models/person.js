"use strict"

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('Person', {
    email : { type : DataTypes.STRING(50), unique: true},
    hash: { type : DataTypes.STRING(32) }
  },
  {
    associate: function (models) {
      models.Person.hasMany(models.PersonDetails);
      models.Person.hasMany(models.PersonFriend);
      models.Person.hasMany(models.FBPerson);
      models.Person.hasMany(models.GooglePerson);
    },
    classMethods : {
      findUserForAuth : function () {},
      findOrCreateGPoAuthUser : function () {},
      findOrCreateFBoAuthUser : function () {},
      isValidUserPassword : function () {},
    }
  });
}


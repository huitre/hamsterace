"use strict"

var crypto = require('crypto');

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('Person', {
    email : { type : DataTypes.STRING(50), unique: true},
    password : { type : DataTypes.STRING(32),
      set:  function(v) {
          var md5 = crypto.createHash('md5'),
              hash = md5.update(v).digest('hex');

          this.setDataValue('password', hash);
      }
    }
  },
  {
    associate: function (models) {
      models.Person.hasMany(models.PersonDetails);
      models.Person.hasMany(models.PersonFriend);
      models.Person.hasMany(models.FBPerson);
      models.Person.hasMany(models.GooglePerson);
      models.Person.belongsTo(models.Post);
    }
  });
}


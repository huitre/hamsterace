"use strict"

var crypto = require('crypto'),
    console = require("console-plus");

module.exports = function(Sequelize, DataTypes) {
  return Sequelize.define('Person', {
    email : { 
      type : DataTypes.STRING(50), 
      unique: true,
      validate : {
        isEmail : true
      },
      allowNull: false
    },
    password : { type : DataTypes.STRING(32),
      set:  function(v) {
        var md5 = crypto.createHash('md5'),
            hash = md5.update(v).digest('hex');

        this.setDataValue('password', hash);
      }/*,
      get:  function(v) {
        var md5 = crypto.createHash('md5'),
            hash = md5.update(v).digest('hex');

        return hash
      }*/
    },
    gid: { type : DataTypes.STRING(50), unique: true},
    fbid: { type : DataTypes.STRING(50), unique: true}
  },
  {
    associate: function (models) {
      models.Person.hasOne(models.PersonDetails);
      models.Person.hasOne(models.RegisteredDevice);
      models.Person.hasOne(models.Avatar);
      models.Person.hasMany(models.Post);
      models.Person.hasMany(models.PeopleFriend);
      models.Person.hasMany(models.PeopleFriend, {as : 'Friend'});
    }
  });
}

"use strict"

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RegisteredPerson', {
    token : { type : DataTypes.STRING(32) },
    email : { type : DataTypes.STRING(50) }
  }, {
    classMethods : {
    }
  });
};

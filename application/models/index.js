"use strict";

var fs        = require("fs"),
    path      = require("path"),
    Sequelize = require("sequelize"),
    basename  = path.basename(module.filename),
    env       = process.env.NODE_ENV || "Development",
    Config = require('config');
    Config = Config[Config.env].dbConfig;
    
var sequelize = new Sequelize(Config.dbName, Config.user, Config.password, {
      dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
      port:    Config.port, // or 5432 (for postgres)
    }),
    db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    console.log(modelName + ' associating' + "\n");
    db[modelName].options.associate(db)
  }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

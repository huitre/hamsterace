var Config = require('config');
var PgQuery = require('pg-query');

module.exports = function () {
  var dbConfig = Config.get('Developpment.dbConfig');
  PgQuery.connectionParameters = 'postgres://' + dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbName;
  return PgQuery;
}
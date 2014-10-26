module.exports = function () {
  var query = require('pg-query');
  query.connectionParameters = 'postgres://huitre:password@localhost:5432/hamsterdbdev';
  return query;
}
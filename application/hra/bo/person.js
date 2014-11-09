var PersonBO = (function () {
  /*
   * Requirements
   */
  var pg = require('../database')();

  this.findQuery = function (where, params, done) {
    if (where)
      where = "WHERE " + where;
    pg("SELECT p.*, d.* FROM PERSON p, PERSON_DETAILS d " + where, params, done)
  }

  this.findForAuth = function (params, done) {
    pg("SELECT \
        p.id, p.email, p.hash, p.created, p.updated, \
        d.type, d.name, d.first_name \
      FROM \
        PERSON p, PERSON_DETAILS d\
      WHERE\
        p.email = $1 AND p.hash = $2 \
      AND \
        d.id = p.id   \
      ", params, done);
  }

  this.findOne = function (params, done) {
    pg("SELECT \
        p.id, p.email, p.hash, p.created, p.updated \
      FROM \
        PERSON p, PERSON_DETAILS d \
      LEFT JOIN \
        AVATAR a ON (a.id = p.id) \
      WHERE \
        d.id = p.id \
      ", params, done);
  }

  this.findForFB = function (params, done) {
    pg("SELECT \
        p.id, p.email, p.hash, p.created, p.updated \
      FROM \
        PERSON p, PERSON_DETAILS d, FB_PERSON fb \
      WHERE \
        p.email = $1 AND p.hash = $2 \
      AND \
        d.id = p.id \
      ", params, done);
  }

  this.count = function (params, done) {
    pg("SELECT count(p.id) FROM PERSON WHERE email = $1", params, done);
  }

  this.deleteOne = function (params, done) {

  }

  return this;

})()

if (typeof module !== 'undefined') {
  module.exports = PersonBO;
}
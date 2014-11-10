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
        PERSON p \
      INNER JOIN \
        PERSON_DETAILS d\
      LEFT JOIN \
        FB_PERSON f on (f.id_person = p.id) \
      LEFT JOIN \
        GOOGLE_PERSON g on (g.id_person = p.id) \
      WHERE \
        p.id = $1 \
      AND \
        d.id_person = p.id   \
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
        p.id, fb.email, p.hash, p.created, p.updated, d.name, d.first_name, d.type \
      FROM \
        PERSON p, PERSON_DETAILS d, FB_PERSON fb \
      WHERE \
        fb.email = $1 \
      AND \
        d.id_person = p.id \
      ", params, done);
  }

  /*
   * TODO : utiliser une procedure stockee
   */
  this.insertFBoAuthUser = function (params, done) {
    var p = [
      params.emails[0].value,
      "12345678901234567890123456789012"
    ]
    pg("INSERT INTO PERSON (ID, EMAIL, HASH, CREATED) VALUES(DEFAULT, $1, $2, CURRENT_TIMESTAMP) RETURNING ID;", p,
      function (err, rows, result) {
        if (err || !rows) {
          err.file = 'insertFBoAuthUser';
          done(err);
        }
        var p1 = [rows[0].id, p[0], params.id];
        pg("INSERT INTO FB_PERSON (ID_PERSON, EMAIL, FBID) VALUES($1, $2, $3);", p1, 
          function (err, rows, result) {
            var p2 = [p1[0], 'owner', params.name.familyName, params.name.givenName]
            pg("INSERT INTO PERSON_DETAILS (ID_PERSON, TYPE, NAME, FIRST_NAME) VALUES($1, $2, $3, $4);", p2, done);
          })
      });
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
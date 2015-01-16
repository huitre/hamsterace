var PersonBO = (function () {
  /*
   * Requirements
   */
  var pg = require('../database')();
  var Utils = require('../lib/utils');

  this.findQuery = function (where, params, done) {
    if (where)
      where = "" + where;
    pg("SELECT \
        p.id, p.email, p.hash, p.created, p.updated, \
        d.type, d.name, d.first_name \
      FROM \
        PERSON p \
      CROSS JOIN \
        PERSON_DETAILS d\
      LEFT JOIN \
        FB_PERSON f on (f.id_person = p.id) \
      LEFT JOIN \
        GOOGLE_PERSON g on (g.id_person = p.id) \
      WHERE \
        d.id_person = p.id \
      AND " + where, params, done)
  }

  this.findForAuth = function (params, done) {
    pg("SELECT \
        p.id, p.email, p.hash, p.created, p.updated, \
        d.type, d.name, d.first_name \
      FROM \
        PERSON p \
      CROSS JOIN \
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
      AND \
        p.id = fb.id_person \
      ", params, done);
  }

  this.findForGP = function (params, done) {
    pg("SELECT \
        p.id, fb.email, p.hash, p.created, p.updated, d.name, d.first_name, d.type \
      FROM \
        PERSON p, PERSON_DETAILS d, GOOGLE_PERSON fb \
      WHERE \
        fb.email = $1 \
      AND \
        d.id_person = p.id \
      AND \
        p.id = fb.id_person \
      ", params, done);
  }

  /*
   * TODO : utiliser une procedure stockee
   */
  this.insertFBoAuthUser = function (params, done) {
    var p = [
      params.emails[0].value,
      Utils.RandomUtils.hash()
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
            this.insertNewPersonDetails(p2, done);
          })
      });
  }

  this.insertGPoAuthUser = function (params, done) {
    var p = [
      params.emails[0].value,
      Utils.RandomUtils.hash()
    ]
    this.insertNewPerson(p,
      function (err, rows, result) {
        if (err || !rows[0]) {
          err.file = 'insertFBoAuthUser';
          done(err);
        }
        var p1 = [rows[0].id, p[0], params.id];
        pg("INSERT INTO GOOGLE_PERSON (ID_PERSON, EMAIL, GOOGLE_ID) VALUES($1, $2, $3);", p1, 
          function (err, rows, result) {
            var p2 = [p1[0], 'owner', params.name.familyName, params.name.givenName]
            this.insertNewPersonDetails(p2, done);
          })
      });
  }


  this.insertNewPersonDetails = function (params, done) {
    pg("INSERT INTO PERSON_DETAILS (ID_PERSON, TYPE, NAME, FIRST_NAME) VALUES($1, $2, $3, $4);", params, done);
  }

  this.insertNewPerson = function (params, done) {
    pg("INSERT INTO PERSON (ID, EMAIL, HASH, CREATED) VALUES(DEFAULT, $1, $2, CURRENT_TIMESTAMP) RETURNING ID;", params,
      function (err, rows, result) {
        done(err, rows);
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
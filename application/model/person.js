var PersonModel = (function () {
  /*
   * Requirements
   */
  var pg = require('../hra/database')(),
      crypto = require('crypto'),
      Utils = require('../hra/lib/utils'),
      bo = require('../hra/bo/person'),
      // config
      Config = require('config'),
      self = this;
/*
  var person = {
    id : null,
    type : null,
    email : null,
    created : null,
    updated : null,
    firstName : null,
    name : null,
    avatar : {},
    fb : null,
    google : null
  }
*/

  this.populate = function (params) {
    if (!params)
      return null;
    if (params.length && params.length == 1)
      params = params[0];

    var person = {};

    person.id = params.id;
    person.type = params.type;
    person.email = params.email;
    person.created = params.created;
    person.created = params.updated;
    person.firstName = params.first_name;
    person.name = params.name;
    person.fb = params.fb || false;
    person.google = params.google || false;
    person.avatar = params.avatar || {};
        
    return person;
  }

  this.find = function (params, done) {
    var where = [], i = 1, p = [];

    for (var o in params) {
      where.push(o + " = $" + i);
      p.push(params[o]);
      i++;
    }
    
    bo.findQuery(where.join(' AND '), p, function (err, result) {
      if (err) return done(err)
        done(null, populate(result));
    })
  }

  this.findUserForAuth = function (params, done) {
    bo.findForAuth(params, function (err, rows) {
      if (err) return done(err);
      done(null, populate(rows));
    })
  }

  this.findOrCreateFBoAuthUser = function (params, done) {
    bo.findForFB([params.emails[0].value], function (err, rows) {
      if (err) return done(err);
      if (rows.length === 0 || !rows) {
        bo.insertFBoAuthUser(params, function (err, rows, result) {
          if (err) return done(err);
          rows[0].fb = true;
          return done(null, self.populate(rows));
        });
      } else {
        rows[0].fb = true;
        done(null, self.populate(rows));
      }
    });
  }

  this.findOrCreateGPoAuthUser = function (params, done) {
    bo.findForGP([params.emails[0].value], function (err, rows) {
      if (err) return done(err);
      if (rows.length === 0 || !rows[0].length == 0 || !rows) {
        bo.insertGPoAuthUser(params, function (err, rows, result) {
          if (err) return done(err);
          rows[0].google = true;
          return done(null, self.populate(rows));
        });
      } else {
        rows[0].google = true;
        done(null, self.populate(rows));
      }
    });
  }

  this.insert = function (params, done) {
    bo.insertNewPerson(params, done);
  }

  this.isValidUserPassword = function (params, done) {
    var md5 = crypto.createHash('md5');

    params.password = md5.update(params.password).digest('hex');
    bo.findQuery(" p.hash = $1 and p.email = $2", [params.password, params.userEmail], 
      function (err, row, result) {
        console.log(err, row, result);
        if (err) return done(new Error(err));
        if (row.length < 0) return done(new Error({'message': 'user.not.found'}));
        return done(null,populate(row[0]));
      });
  }

  return this
})()

if (typeof module !== 'undefined') {
  module.exports = PersonModel;
}

/*
 * Requirements
 */
var Db = require('../models'),
    crypto = require('crypto'),
    console = require('console-plus');

var PersonModel = (function () {

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

  this.authFindOrCreate = function (profile, done) {
    console.log(profile);
    var where = {}
    
    where.email = profile.emails[0].value || profile.email;
    where.password = profile.password || null;

    if (profile.authOrign == 'google')
      where.gid = profile.id;
    if (profile.authOrign == 'facebook')
      where.fbid = profile.id;

    Db.Person.findOrCreate({
      where : where
    }).spread(function (User) {
      if (!User.PersonDetails || User.PersonDetails.length < 1) {
        var details = Db.PersonDetails.build({
          type : 'owner',
          name : profile.family_name || profile.lastName,
          firstname : profile.given_name || profile.firstName
        })
        User.addPersonDetails(details);
      }
      return done(null, User);
    }).catch(function (err) {
      return done(err, false);
    });
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = PersonModel;
}
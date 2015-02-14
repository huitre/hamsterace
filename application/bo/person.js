
/*
 * Requirements
 */
var Db = require('../models'),
    crypto = require('crypto'),
    console = require('console-plus');

var PersonModel = (function () {

  // not used anymore ?
  /*this.isValidUserPassword = function (params, done) {
    var md5 = crypto.createHash('md5');

    params.password = md5.update(params.password).digest('hex');
    bo.findQuery(" p.hash = $1 and p.email = $2", [params.password, params.userEmail], 
      function (err, row, result) {
        console.log(err, row, result);
        if (err) return done(new Error(err));
        if (row.length < 0) return done(new Error({'message': 'user.not.found'}));
        return done(null,populate(row[0]));
      });
  }*/

  this.authFindOrCreate = function (profile, done) {
    var where = {},
        md5 = crypto.createHash('md5');
    
    try {
      where.email = profile.emails[0].value
    } catch (e) {
      where.email = profile.email || null;
    }
    where.password = profile.password || null;
    where.password = md5.update(where.password).digest('hex');

    if (profile.authOrign == 'google')
      where.gid = profile.id;
    if (profile.authOrign == 'facebook')
      where.fbid = profile.id;

    Db.Person.findOrCreate({
      where : where,
      include : [{
        model: Db.PersonDetails 
      }]
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
      console.log(err);
      return done(err, false);
    });
  }

  this.getOne = function (id, done) {
    Db.Person.find({ 
      where : {
        id : id
      },
      attributes : ['email', 'id'],
      include : [{
        model: Db.PersonDetails 
      }]
    }).then( function (user) {
      done(null, user)
    }).catch(function (err) {
      done(err)
    })
  }

  this.getFriends = function (UserId, done) {
    Db.PeopleFriend.findAll({
      where : {PersonId: UserId, confirmed: true},
      include : [{
        model: Db.Person,
        attributes : ['email'],
        include : [Db.PersonDetails]
      }]
    }).then(function (friends) {
      done(friends);
    })
  }

  this.getFriendsIdList = function (UserId, done) {
    Db.PeopleFriend.findAll({
      where : {PersonId: UserId, confirmed: true},
    }).then(function (friends) {
      done(friends);
    })
  }
  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = PersonModel;
}

/*
 * Requirements
 */
var Db = require('../models'),
    crypto = require('crypto'),
    Promise = require("bluebird"),
    console = require('console-plus');

var PersonModel = (function () {

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
      return done(err, false);
    });
  }

  /*
   * @return Promise
   */
  this.getOne = function (id, done) {
    return Db.Person.find({ 
      where : {
        id : id
      },
      attributes : ['email', 'id'],
      include : [{
        model: Db.PersonDetails 
      }]
    })
  }

  /*
   * @return Promise
   */
  this.getFriends = function (UserId, done) {
    return Db.PeopleFriend.findAll({
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

  /*
   * @return Promise
   */
  this.getFriendsIdList = function (UserId) {
    return Db.PeopleFriend.findAll({
      where : {PersonId: UserId, confirmed: true},
    })
  }

  /*
   * @return Promise
   */
  this.findByName = function (name) {
    return Db.PersonDetails.findAll({
      where : {
        $or : [
          {name : { ilike : '%' + name + '%' }},
          {firstname : { ilike : '%' + name + '%'}}
        ]
      }
    })
  }

  this.request = {}

  /*
   * @return Promise
   */
  this.request.get = function (userId) {
    return Db.PeopleFriend.findAll({
      where : {PersonId: userId, confirmed: false},
      include : [{
        model: Db.Person,
        attributes : ['email'],
        include : [Db.PersonDetails]
      }]
    })
  }

  /*
   * @return Promise
   */
  this.request.post = function (userId, friendId) {
    return Db.PeopleFriend.findOrCreate({
      where : {
        FriendId : friendId,
        PersonId : userId
      },
      defaults : {
        type : 'hamster',
        FriendId : friendId,
        PersonId : userId,
        confirmed : false
      }
    })
  }


  /*
   * @return Promise
   */
  this.accept = function (userId, friendId) {
    return new Promise(function (fulfill, reject) {
        Db.PeopleFriend.find({
        where : {
          FriendId : friendId,
          PersonId : userId
        }
      }).then(function (friend) {
        friend.confirmed = true;
        friend.save().then(function () {
          fulfill({confirmed : true})
        })
      }).catch(function (e) {
        reject(new Error({msg : 'not found'}))
      })
    })
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = PersonModel;
}
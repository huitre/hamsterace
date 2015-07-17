
/*
 * Requirements
 */
var Db = require('../models'),
    crypto = require('crypto'),
    Promise = require("bluebird"),
    console = require('console-plus');

var PersonModel = (function () {
  var self = this;

  this.populateFriends = function (rows) {
    var friends = [],
        populate = function (row) {
          friends.push({
            id : row.FriendId,
            type : row.type,
            gender : row.Friend.PersonDetails[0].gender,
            age : row.Friend.PersonDetails[0].age,
            updatedAt : row.updatedAt,
            firstname : row.Friend.PersonDetails[0].firstname,
            name : row.Friend.PersonDetails[0].name,
            avatar : row.Friend.Avatar.Image
          });
        }

    if (rows.hasOwnProperty('length')) 
      rows.map(populate)
    else 
      populate(rows)
    
    return friends;
  }

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
  this.getAll = function (id, done) {
    return Db.Person.findAll({
          attributes : ['Person.*', 'PeopleFriends.*', [Db.sequelize.fn('COUNT', 'PeopleFriends.id'), 'FriendsCount']],
          include : [Db.PeopleFriend],
          group : ['Person.id', 'PeopleFriends.id']
        })
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
        model : Db.PersonDetails 
      }]
    })
  }

  /*
   * @return Promise
   */
  this.getFriends = function (UserId, isFriend, refused) {
    refused = refused || false;
    return new Promise(function (fulfill, reject){
      Db.PeopleFriend.findAll({
        where : {PersonId: UserId, confirmed: isFriend, refused : refused},
        include : [{
          model: Db.Person,
          as : 'Friend',
          attributes : ['id'],
          include : [{
            model : Db.PersonDetails,
          }, {
            model : Db.Avatar,
            include : [{
              model: Db.Image
            }]
          }]
        }]
      }).then(function (rows) {
        var friends = self.populateFriends(rows)
        fulfill(friends)
      }).catch(function (e) {
        reject(e)
      })
    }) 
  }

  /*
   * @return Promise
   */
  this.getFriendsIdList = function (UserId) {
    return Db.PeopleFriend.findAll({
      where : {PersonId : UserId, confirmed : true},
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
    return self.getFriends(userId, false, false);
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
        confirmed : false,
        refused : false
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
        },
        include : [{
          model: Db.Person,
          as : 'Friend',
          attributes : ['id'],
          include : [{
            model : Db.PersonDetails,
          }, {
            model : Db.Avatar,
            include : [{
              model: Db.Image
            }]
          }]
        }]
      }).then(function (friend) {
        friend.confirmed = true;
        friend.save().then(function (row) {
          fulfill(self.populateFriends(row))
        })
      }).catch(function (e) {
        reject(new Error({msg : 'not found'}))
      })
    })
  }

  this.remove = function (userId, friendId) {
    return new Promise(function (fulfill, reject) {
      Db.PeopleFriend.find({
        where : {
          FriendId : friendId,
          PersonId : userId
        }
      }).then(function (friend) {
        friend.destroy().then(function () {
          fulfill({destroy : true})
        })
      }).catch(function (e) {
        reject(new Error({msg : 'not found'}))
      })
    })
  }

  this.refuse = function (userId, friendId) {
    return new Promise(function (fulfill, reject) {
      Db.PeopleFriend.find({
        where : {
          FriendId : friendId,
          PersonId : userId
        }
      }).then(function (friend) {
        friend.confirmed = false;
        friend.refused = true;
        friend.save().then(function () {
          fulfill({refused : true})
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
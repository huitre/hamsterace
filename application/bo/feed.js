
/*
 * Requirements
 */
var Db = require('../models'),
    Person = require('../bo/person'),
    crypto = require('crypto'),
    console = require('console-plus');

var FeedModel = (function () {

  /*
   * Return lastest posts and comments
   * of a user and his friends
   *
   *
   * @params User || id
   * @params callback
   */
  this.getFeed = function (User, done) {
    var publicy, UserId;
    
    if (typeof User == "object")
      publicy = false;
    
    UserId = User.id || User;

    Person.getFriendsIdList(UserId, function (friends) {
      var friendsId = []
      friends.map(function (friend) {
        friendsId.push(friend.FriendId);
      })
      friendsId.push(UserId)
      Db.Post.findAll({
        where : {
          PersonId: friendsId
        },
        order : '"Post"."updatedAt" DESC',
        limit: 15,
        include : [{
          model: Db.Comment
        }]
      }).then(function (posts) {
        result = {
          profile : User,
          post : posts
        }
        done(null, result);
      }).catch (function (e) {
        done(e)
      })
    })
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = FeedModel;
}
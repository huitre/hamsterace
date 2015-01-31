
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
   * @params User.id
   * @params callback
   */
  this.getFeed = function (User, done) {
    Person.getFriends(User.id, function (friends) {
      var friendsId = []
      friends.map(function (friend) {
        friendsId.push(friend.FriendId);
      })
      friendsId.push(User.id)
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
        done(result);
      }).catch (function () {
        throw new Error('No feed available');
      })
    })
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = FeedModel;
}
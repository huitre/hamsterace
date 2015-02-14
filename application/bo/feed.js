
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
          model: Db.Comment,
          include : {
            model: Db.Person,
            attributes : ['id'],
            include : [{
              model : Db.PersonDetails,
              attributes : ['name', 'firstname']
            }, {
              model : Db.Image
            }]
          }
        },{
          model: Db.Person,
          attributes : ['id'],
          include : [{
            model : Db.PersonDetails,
            attributes : ['name', 'firstname']
          },{
            model : Db.Image
          }]
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

  this.addPost = function (User, content, done) {
    var UserId;
    
    UserId = User.id || User;
    // TODO parse content toget pictures/links/video
    Db.Post.create({
      content : {text: content},
      PersonId: UserId
    }).then(function (post) {
      done(null, post);
    }).catch(done);
  }

  this.addComment = function (User, content, postId, done) {
    var publicy, UserId;
    
    if (typeof User == "object")
      publicy = false;
    
    UserId = User.id || User;

    Db.Comment.create({
      content: {text: content},
      PersonId: UserId,
      PostId: postId
    }).then(function (post) {
      done(null, post);
    }).catch(done);
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = FeedModel;
}
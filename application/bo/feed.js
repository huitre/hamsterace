
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
    
    if (typeof User == "object") {
      publicy = false;
      UserId = User.id
    } else {
      UserId = User;
    }

    Person.getFriendsIdList(UserId).then(function (friends) {
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
        limit: 30,
        include : [{
          model: Db.Comment,
          include : [{
            model: Db.Person,
            attributes : ['id'],
            include : [{
              model : Db.PersonDetails,
            }, {
              model : Db.Avatar,
              attributes : ['id'],
              include : [{
                model: Db.Image,
                attributes : ['resource']
              }]
            }]
          }]
        },{
          model: Db.Person,
          attributes : ['id'],
          include : [{
            model : Db.PersonDetails,
            attributes : ['name', 'firstname']
          },{
            model : Db.Avatar,
            attributes : ['id'],
            include : [{
              model: Db.Image,
              attributes : ['resource']
            }]
          }]
        }]
      }).then(function (posts) {
        result = {
          post : posts
        }
        if (!publicy)
          result.profile = User;
        done(null, result);
      }).catch (function (e) {
        done(e)
      })
    })
  }

  this.findOnePost = function (id, done) {
    Db.Post.find({
        where : {
          id: id
        },
        include : [{
          model: Db.Comment,
          include : {
            model: Db.Person,
            attributes : ['id'],
            include : [{
              model : Db.PersonDetails,
              attributes : ['name', 'firstname']
            }, {
              model : Db.Avatar,
              include : [{
                model: Db.Image
              }]
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
      }).then(function (post) {
        done(null, post)
      }).catch(done);
  }

  this.findOneComment = function (id, done) {
    Db.Comment.find({
      where : {
        id : id
      },  
      include : {
        model: Db.Person,
        attributes : ['id'],
        include : [{
          model : Db.PersonDetails,
          attributes : ['name', 'firstname']
        }, {
          model : Db.Avatar,
          include : [{
            model: Db.Image
          }]
        }]
      }
    }).then(function (post) {
      done(null, post)
    }).catch(done);
  }

  this.addPost = function (User, content, done) {
    var UserId, bo = this;
    
    UserId = User.id || User;
    // TODO parse content toget pictures/links/video
    Db.Post.create({
      content : {text: content},
      PersonId: UserId
    }).then(function (post) {
      bo.findOnePost(post.id, done);
    }).catch(done);
  }

  this.deletePost = function (User, postId, done) {
    var UserId, bo = this;
    
    UserId = User.id || User;
    
    Db.Post.destroy({
      PostId: postId,
      PersonId: UserId
    }).then(function (post) {
      done(null, true)
    }).catch(done);
  }

  this.addComment = function (User, content, postId, done) {
    var publicy, UserId, bo = this;
    
    if (typeof User == "object")
      publicy = false;
    
    UserId = User.id || User;

    Db.Comment.create({
      content: {text: content},
      PersonId: UserId,
      PostId: postId
    }).then(function (comment) {
      bo.findOneComment(comment.id, done);
    }).catch(done);
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = FeedModel;
}
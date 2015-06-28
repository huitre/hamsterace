var Feed = require('../bo/feed'),
    Stats = require('../bo/stats'),
    Person = require('../bo/person'),
    //Db = require('../models'),
    console = require('console-plus');

exports.index = function (req, res) {
    if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  var result = {};
  res.send(req.user);
}

exports.stats = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  var type = req.params.type || 'daily';
  console.log(req.params);
  Stats.get(req.user.id, type, 'wheel').then(function (stats) {
    var content = {};
    content.stats = stats;
    res.send(content);
  }).catch(function (e){
    res.status(500).send('Unable.to.get.statistics');
  });
}

exports.feed = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  
  var result = {};
  Feed.getFeed(req.user, function (err, feed) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    result.feed = feed.post;
    res.send(result);
  });
}

exports.post = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  Feed.addPost(req.user, req.body.content,
    function (err, post) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(post);
    });
}

exports.post.delete = function () {
 if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  Feed.deletePost(req.user, req.body.content,
    function (err, post) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(post);
    }); 
}

exports.comment = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  Feed.addComment(req.user, req.body.content, req.params.postid,
    function (err, post) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(post);
    });
}

exports.link = function (req, res) {
  res.send('this is link');
}

exports.devices = function (req, res) {
  res.send('this is devices');
}

exports.auth = function (req, res) {
  res.send(req);
}

exports.friends = function (req, res) {
  if (req.user.id) {
    Person.getFriends(req.user.id).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
  } else {
    res.status(500).send('Missing parameters id');
  }
}

exports.full = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  var result = req.user;
  Person.getFriends(req.user.id).then(function (friends) {
    result.friends = friends;
    res.send(result);
  }).catch(function (err) {
    return res.status(500).send(err)
  })
}

exports.request = function (req, res) {
  if (req.user.id) {
    Person.request.get(req.user.id, false).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
  } else {
    res.status(500).send('Missing parameters id');
  }
}
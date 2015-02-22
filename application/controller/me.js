var Feed = require('../bo/feed'),
    Stats = require('../bo/stats'),
    //Db = require('../models'),
    console = require('console-plus');

exports.index = function (req, res) {
    if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  var result = {};
}

exports.stats = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  var result = {};
  Stats.get(req.user.id, 'daily', 'wheel').then(function (stats) {
    result.stats = stats;
    res.send(result);
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

exports.full = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  var result = {};
  Feed.getFeed(req.user, function (err, feed) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    result.feed = feed.post;
    result.me = {
      user : feed.profile.datavalues,
      details : feed.profile.PersonDetails.datavalues
    };
    Stats.get(req.user.id, 'daily', 'wheel').then(function (stats) {
      result.stats = stats;
      res.send(result);
    }).catch(function (e){
      res.status(500).send('Unable.to.get.statistics');
    });
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
var Feed = require('../bo/feed'),
    Person = require('../bo/person'),
    console = require('console-plus');

exports.index = function (req, res) {
  if (req.params && req.params.id) {
    try {
      Person.getOne(req.params.id, function (result) {
          res.send(result);
      });
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(500).send('Missing parameters id');
  }
}

exports.friends = function (req, res) {
  if (req.params && req.params.id) {
  	try {
      Person.getFriends(req.params.id, function (result) {
          res.send(result);
      });
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(500).send('Missing parameters id');
  }
}

exports.followers = function (req, res) {
	res.send('this is followers');
}

exports.badges = function (req, res) {
	res.send('this is badges');
}

exports.wall = function (req, res) {
	if (req.params && req.params.id) {
    try {
      Feed.getFeed(req.params.id, function (result) {
          res.send(result);
      });
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(500).send('Missing parameters id');
  }
}
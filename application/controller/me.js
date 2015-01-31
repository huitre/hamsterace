var Bo = require('../bo/feed'),
    //Db = require('../models'),
    console = require('console-plus');

exports.index = function (req, res) {
  res.send(req.user);
}

exports.feed = function (req, res) {
  try {
    Bo.getFeed(req.user, function (result) {
        res.send(result);
    });
  } catch (e) {
    res.status(500).send(e)
  }
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
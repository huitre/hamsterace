var Bo = require('../bo/person'),
    //Db = require('../models'),
    console = require('console-plus');

exports.index = function (req, res) {
  res.send(req.user);
}

exports.feed = function (req, res) {
  if (req.user) {
    Bo.getFeed(req.user, function (err, result) {
      if (!err)
        res.send(result);
      else
        res.send(err);
    });
  } else
    res.redirect('/', req);
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
var Db = require('../models');

exports.index = function (req, res) {
  res.send(req.user);
}

exports.feed = function (req, res) {
  Db.Post.findAll({
    where : {
      PersonId: req.user.id
    }
  }).then(function (posts) {
    result = {
      profile : req.user,
      post : posts
    }
    res.send(result)
  })
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
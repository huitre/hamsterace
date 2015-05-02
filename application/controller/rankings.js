/* 
* @Author: huitre
* @Date:   2014-10-23 21:43:42
* @Last Modified by:   huitre
* @Last Modified time: 2015-05-01 18:31:03
*/

var Promise = require("bluebird"),
    Ranking = require('../bo/ranking'),
    console = require('console-plus'),
    RankingController = {};

exports.friends = function (req, res) {
  Ranking.friendsDistance(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.friends.max = function (req, res) {
  Ranking.friendsMax(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.friends.average = function (req, res) {
  Ranking.friendsAverage(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.friends.activity = function (req, res) {
  Ranking.friendsActivity(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.distance = function (req, res) {
  req.user = req.user || {}
  req.user.id = req.user.id || null;
  Ranking.distance(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.distance.max = function (req, res) {
  req.user = req.user || {}
  req.user.id = req.user.id || null;
  Ranking.max(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.distance.average = function (req, res) {
  req.user = req.user || {}
  req.user.id = req.user.id || null;
  Ranking.average(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}

exports.activity = function (req, res) {
  req.user = req.user || {}
  req.user.id = req.user.id || null;
  Ranking.activity(req.user.id).then(function (datas) {
    res.send(datas)
  }).catch(function (e) {
    console.log(e)
    res.status(500).send(e)
  })
}


exports.speed = function (req, res) {
  res.send(req);
}


exports.find = function (req, res) {
	res.send(req);
}


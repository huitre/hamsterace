/* 
* @Author: huitre
* @Date:   2014-10-23 21:43:42
* @Last Modified by:   huitre
* @Last Modified time: 2015-04-25 19:25:38
*/

var Promise = require("bluebird"),
    Ranking = require('../bo/ranking'),
    console = require('console-plus'),
    RankingController = {};

exports.friends = function (req, res) {
  if (!req.user) 
    return res.status(403).send('user.not.logged.in');
  req.user = req.user || {}
  req.user.id = req.user.id;
  Ranking.friends(req.user.id).then(function (datas) {
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

exports.activity = function (req, res) {
  res.send(req);
}

exports.find = function (req, res) {
	res.send(req);
}


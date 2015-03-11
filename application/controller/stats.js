var Promise = require("bluebird"),
    Stats = require('../bo/stats'),
    console = require('console-plus'),
    Stats = {};

Stats.getStats = function (req, res, time) {
  if (req.params.id && Stats.isValidType(req.params.type)) {
    Stats.get(req.params.id, 'daily', req.params.type).then(function (datas) {
      res.send(datas)
    }).catch(function (e) {
      res.status(500).send(e)
    })
  } else {
    res.send({error: 'missing or wrong parameters '})
  }
}

exports.find = function (req, res) {
  res.send(req);
}

exports.daily = function (req, res) {
  Stats.getStats(req, res, 'daily');
}

exports.monthly = function (req, res) {
  Stats.getStats(req, res, 'monthly');
}


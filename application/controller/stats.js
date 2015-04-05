var Promise = require("bluebird"),
    Stats = require('../bo/stats'),
    console = require('console-plus'),
    StatsController = {};

StatsController.getStats = function (req, res, time) {
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

StatsController.summary = function (req, res) {
  if (req.params.id && Stats.isValidType(req.params.type)) {
    Stats.getTotalSummary(req.params.id, req.params.type).then(function (datas) {
      res.send(datas)
    }).catch(function (e) {
      res.status(500).send(e)
    })
  } else {
    res.send({error: 'missing or wrong parameters '})
  }
}

exports.summary = function (req, res) {

}

exports.find = function (req, res) {
  res.send(req);
}

exports.daily = function (req, res) {
  StatsController.getStats(req, res, 'daily');
}

exports.monthly = function (req, res) {
  StatsController.getStats(req, res, 'monthly');
}


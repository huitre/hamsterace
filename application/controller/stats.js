var Promise = require("bluebird"),
    Stats = require('../bo/stats'),
    console = require('console-plus'),
    StatsController = {};

StatsController.getStats = function (req, res, time) {
  if (req.params.id && Stats.isValidType(req.params.type)) {
    Stats.get(req.params.id, time, req.params.type).then(function (datas) {
      res.send(datas)
    }).catch(function (e) {
      console.log(e)
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
  StatsController.summary(req, res)
}

exports.find = function (req, res) {
  res.send(req);
}

exports.hourly = function (req, res) {
  StatsController.getStats(req, res, 'hourly');
}

exports.daily = function (req, res) {
  StatsController.getStats(req, res, 'daily');
}

exports.weekly = function (req, res) {
  StatsController.getStats(req, res, 'weekly');
}

exports.monthly = function (req, res) {
  StatsController.getStats(req, res, 'monthly');
}

exports.archive = function (req, res) {
  Stats.archive().then(function () {
    res.send(arguments)
  }).catch(function () {
    res.status(500).send(arguments)
  })
}

exports.archive.monthly = function (req, res) {
  Stats.archiveMonthly().then(function () {
    res.send(arguments)
  }).catch(function () {
    res.status(500).send(arguments)
  })
}

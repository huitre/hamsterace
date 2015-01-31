
/*
 * Requirements
 */
var crypto = require('crypto'),
    Moment = require('moment'),
    Promise = require("bluebird"),
    //console = require('console-plus'),
    Device = require('../bo/device'),
    _ = require('underscore'),
    Db = require('../models');

var StatsModel = function () {};

StatsModel.prototype.get = function (User, time, type) {

  var getEventStartAndStop = function (type) {
    // TODO : add different events type
    return [
      'lapsStart',
      'laps',
      'lapsStop'
    ]
  },
  /*
   * No more usable for the moment
   *
  checkEventIntegrity = function (datas) {
    var e = getEventStartAndStop(),
        prev = e.start,
        safe = [];

    if (datas.length > 2) {
      for(var i = 0, m = datas.length - 2, j = datas[i].dataValues; i < m;) {
        if (j.type == e.normal) {
          safe.push(j);
          i++;
        }
        else if (j.type == e.start && datas[i+1].dataValues.type == e.stop) {
          safe.push(j);
          safe.push(datas[i+1].dataValues);
          i += 2
        } else
          i++;
      }
    } else if (datas.length == 2){
      if (datas[0].dataValues.type == e.start && datas[1].dataValues.type == e.stop) {
        safe.push(datas[0].dataValues);
        safe.push(datas[1].dataValues);
      }
    }    
    return safe;
  },*/

  computeDatas = function (datas) {
    //datas = checkEventIntegrity(datas);
    return new Promise(function (fulfill, reject){
      var result = {}

      switch (type) {
        case 'wheel':
          result.distance = getDistance(datas);
          result.averageDistance = getAverageDistance(result.distance);
          result.maxDistance = getMaxDistance(result.distance);
          result.speed = getSpeed(result.distance);
          result.maxSpeed = getMaxSpeed(result.speed);
          result.averageSpeed = getAverageSpeed(result.speed);
        break;
      }
      fulfill(result);
    })
  },

  getDistance = function (datas) {
    var distance = [], a, vm;
    for(var i = 0, m = datas.length - 2; i < m; i++) {
      a = datas[i];
      if (a.content) {
        vm = (a.content * 2 * 3.1415926 * (17/100/1000));
        distance.push({
          createdAt: new Date(a.createdAt),
          distance : vm
        });
      }
    }
    return distance;
  },
  getAverageDistance = function (datas) {
    var sum = 0;
    datas.map(function (vm) {
      sum += vm.distance;
    });
    return sum / (datas.length - 1);
  },
  getMaxDistance = function (datas) {
    var max = 0;
    for(var i = 0, m = datas.length - 1; i < m; i++) {
      if (datas[i].distance > max)
        max = datas[i].distance;
    }
    return max;
  },
  getSpeed = function (datas) {
    var a, t1, t2, d1, d2, vm, vmList = [], j;
    for(var i = 0, m = datas.length - 2; i < m; i++) {
      j = datas[i];
      a = datas[i + 1];
      t1 = j.createdAt;
      t2 = a.createdAt;
      vm = a.distance / ((t2 - t1) / (60 * 60 * 1000));
      if (vm > 1.0)
        vmList.push({speed : vm, time : t2});
    }
    return vmList;
  },

  getMaxSpeed = function (datas) {
    var max = 0;
    for(var i = 0, m = datas.length - 1; i < m; i++) {
      if (datas[i].speed > max)
        max = datas[i].speed;
    }
    return max;
  },

  getAverageSpeed = function (datas) {
    var sum = 0;
    datas.map(function (vm) {
      sum += vm.speed;
    });
    return sum / (datas.length - 1);
  },
  getRotation = function () {

  },
  getAverageRotation = function () {

  },
  getMaxRotation = function () {

  }

  switch (time) {
    case 'daily':
      time = {}
      time.start = Moment().substract(1, 'days').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'days').format();
    break;

    case 'monthly':
      time = {}
      time.start = Moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'days').format();
    break;
    
    case 'daily':
    break;
  }

  // get device for userID
  return new Promise(function (fulfill, reject){
        Device.find(User, function (err, res){
          if (err)
            reject(err);
          else {
            Db.Event.findAll({
              attributes: ['createdAt', 'type', 'content'],
              where : {
                createdAt : { 
                  gt : time.start,
                  lt : time.end
                },
                type : getEventStartAndStop()
              },
              order: '"createdAt" ASC',
              limit: 1000
            }, {raw: true}).spread(function () {
              return computeDatas(arguments).then(function (result) {
                fulfill(result)
              })
            }).catch(function (e) {
              console.log(e)
              reject(e)
            })
          }
        });
      });
        
}

StatsModel.prototype.isValidType = function (type) {
  return ['wheel'].indexOf(type) != -1;
}

if (typeof module !== 'undefined') {
  module.exports = new StatsModel();
}
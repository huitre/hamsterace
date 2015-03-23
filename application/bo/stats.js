
/*
 * Requirements
 */
var crypto = require('crypto'),
    Moment = require('moment'),
    Promise = require("bluebird"),
    console = require('console-plus'),
    Device = require('../bo/device')
    Db = require('../models');

var StatsModel = function () {};

StatsModel.prototype.getDistance = function (data) {
    var distance = [], a, b, vm, last = null;
    for(var i = 0, m = data.length; i < m; ++i) {
      a = data[i];
      if (!a.content) {
        a.content = 0;
      }
      vm = (a.content * 2 * 3.1415926 * 17);
      b = {
        createdAt: new Date(a.createdAt),
        distance : vm
      }
      /*if (last && b.createdAt.getTime() - last.createdAt.getTime() > 2000 * 60) {
        distance.push({
          createdAt: new Date(last.createdAt.getTime() + (1000 * 60)),
          distance: 0
        })
        distance.push({
          createdAt: new Date(last.createdAt.getTime() + (1000 * 60) + 1),
          distance: 0
        })
        distance.push({
          createdAt: new Date(b.createdAt.getTime() - (1000 * 60)),
          distance: 0
        })
        distance.push({
          createdAt: new Date(b.createdAt.getTime() - (1000 * 60) + 1),
          distance: 0
        })
      }*/
      distance.push(b);
      last = a;
    }
    return distance;
  }

StatsModel.prototype.getAverageDistance = function (data) {
  var sum = 0;
  data.map(function (vm) {
    sum += vm.distance;
  });
  return sum / (data.length - 1);
}

StatsModel.prototype.getMaxDistance = function (data) {
  var max = 0;
  for(var i = 0, m = data.length - 1; i < m; ++i) {
    if (data[i].distance > max)
      max = data[i].distance;
  }
  return max;
}

StatsModel.prototype.getSpeed = function (data) {
  var a, t1, t2, d1, d2, vm = 1.0, vmList = [], j;
  for(var i = 0, m = data.length - 2; i < m; ++i) {
    j = data[i];
    a = data[i + 1];
    t1 = j.createdAt;
    t2 = a.createdAt;
    vm = a.distance / ((t2 - t1) / (60 * 60 * 1000));
    if (vm > 1.0)
      vmList.push({speed : vm, time : t2});
  }
  return vmList;
}

StatsModel.prototype.getMaxSpeed = function (data) {
  var max = 0;
  for(var i = 0, m = data.length - 1; i < m; ++i) {
    if (data[i].speed > max)
      max = data[i].speed;
  }
  return max;
}

StatsModel.prototype.getAverageSpeed = function (data) {
  var sum = 0;
  data.map(function (vm) {
    sum += vm.speed;
  });
  return sum / (data.length - 1);
}


StatsModel.prototype.get = function (User, time, type) {
  var self = this,
  
  compute = null,
  
  getEventStartAndStop = function (type) {
    // TODO : add different events type
    return [
      'lapsStart',
      'laps',
      'lapsStop'
    ]
  },

  aggregateByTimestamp = function (data, time) {
    var aggregated = {}, a = null, t, c, x;
    
    switch (time) {
      case 'monthly':
        c = function (a) {
          return new Date(a.createdAt).getDate();
        }
      break;

      case 'weekly':
        c = function (a) {
          x = new Date(a.createdAt);
          return x.getHours() + x.getDate();
        }
      break;

      case 'daily': 
        c = function (a) {
          x = new Date(a.createdAt);
          return x.getTime() % (120 * 1000);
        }
      break;
    }
    
    for(var i = 0, m = data.length - 1; i < m; ++i) {
      a = data[i];
      t = c(a);
      if (!aggregated[t])
        aggregated[t] = [];
      aggregated[t].push(a);
    }
    return aggregated;
  },

  calculate = function (data) {
    var result = {}
    switch (type) {
      case 'wheel':
        result.distance = {}
        result.distance.data = self.getDistance(data);
        /*result.distance.averageDistance = self.getAverageDistance(result.distance.data);
        result.distance.maxDistance = self.getMaxDistance(result.distance.data);*/
        result.distance.units = 'km';
        result.speed = {}
        result.speed.data = self.getSpeed(result.distance.data);
        /*result.speed.maxSpeed = self.getMaxSpeed(result.speed.data);
        result.speed.averageSpeed = self.getAverageSpeed(result.speed.data);*/
        result.speed.units = 'km/h';
      break;
    }
    return result;
  }

  computeGroups = function (data, units, ticks) {
      var stats = {}

      stats.distance = {}
      stats.distance.data = [];
      stats.distance.units = units;
      stats.distance.ticks = ticks;
      

      for(var i in data) {
        stats.distance.data.push({
          createdAt : data[i][0].createdAt,
          content : self.getAverageDistance(self.getDistance(data[i]))
        });
      }
      
      stats.distance.data.sort(function (a, b) {
        if (a.createdAt > b.createdAt)
          return 1;
        else if (a.createdAt < b.createdAt)
          return -1;
        return 0;
      })      

      return stats
  },

  computeHourly = function (data, type) {
    return new Promise(function (fulfill, reject){
      //data = aggregateByTimestamp(data, 'daily');
      fulfill(calculate(data));
    })
  },

  computeDaily = function (data, type) {
    return new Promise(function (fulfill, reject){
      data = aggregateByTimestamp(data, 'daily');
      fulfill(computeGroups(data, 'km', 'minutes'));
    })
  },

  computeMonthly = function (data, type) {
    return new Promise(function (fulfill, reject){
      data = aggregateByTimestamp(data, 'monthly');
      fulfill(computeGroups(data, 'km', 'days'));
    })
  },

  computeWeekly = function (data, type) {
    return new Promise(function (fulfill, reject){
      data = aggregateByTimestamp(data, 'weekly');
      fulfill(computeGroups(data, 'km', 'days'));
    })
  };



  switch (time) {
    case 'hourly':
      time = {}
      time.start = Moment().subtract(12, 'hours').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'hours').format();
      compute = computeHourly;
    break;

    case 'daily':
      time = {}
      time.start = Moment().subtract(1, 'days').format();
      time.end = Moment().add(1, 'days').format();
      compute = computeDaily;
    break;

    case 'weekly':
      time = {}
      time.start = Moment().subtract(7, 'days').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'days').format();
      compute = computeWeekly;
    break;

    case 'monthly':
      time = {}
      time.start = Moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'days').format();
      compute = computeMonthly;
    break;
    
    case 'daily':
    break;
  }

  return new Promise(function (fulfill, reject){
        // get device for userID  
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
                type : getEventStartAndStop(),
                DeviceId : res.id
              },
              order: '"createdAt" ASC',
              limit: 1000
            }, {raw: true}).spread(function (data) {
              return compute(arguments).then(function (result) {
                fulfill(result)
              })
            }).catch(function (e) {
              console.log(e, e.stack);
              reject(e.stack)
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

/*
 * Requirements
 */
var crypto = require('crypto'),
    Moment = require('moment'),
    Promise = require("bluebird"),
    console = require('console-plus'),
    Device = require('../bo/device')
    Db = require('../models');

var StatsModel = function () {
  this.ticks = { // in milliseconds
      'hourly' : 60 * 15 * 1000, // 15mn
      'daily' : 60 * 60 * 1000, // 1h
      'weekly' : 24 * 60 * 60 * 1000, // 1day
      'monthly' : 24 * 60 * 60 * 1000, // 1day
      'yearly' : 30 * 24 * 60 * 60 * 1000 // 1month
    }
};

StatsModel.prototype.getDistance = function (data, ticks) {
    var distance = [], a, b, vm, last = null;
    for(var i = 0, m = data.length; i < m; ++i) {
      a = data[i];
      if (!a.content) {
        a.content = 0;
      }
      vm = (a.content * 2 * 3.1415926 * 17);
      b = {
        createdAt: new Date(a.createdAt),
        content : vm
      }
      
      if (last && b.createdAt.getTime() - last.createdAt.getTime() > ticks) {
        distance.push({
          createdAt: new Date(last.createdAt.getTime() + ticks),
          distance: 0
        })
        distance.push({
          createdAt: new Date(last.createdAt.getTime() + ticks + 1),
          distance: 0
        })
        distance.push({
          createdAt: new Date(b.createdAt.getTime() - ticks),
          distance: 0
        })
        distance.push({
          createdAt: new Date(b.createdAt.getTime() - ticks + 1),
          distance: 0
        })
      }
      distance.push(b);
      last = a;
    }
    return distance;
  }

StatsModel.prototype.getSummary = function (data) {
  var sum = 0,
      max = 0;

  data.map(function (vm) {
    if (vm.content > max)
      max = vm.content
    sum += vm.content;
  });
  return {average : sum / (data.length - 1), sum : sum, max: max};
}

StatsModel.prototype.getAverage = function (data) {
  var max = 0;
  for(var i = 0, m = data.length - 1; i < m; ++i) {
    max += data[i].content;
  }
  return max / m;
}

StatsModel.prototype.getMax = function (data) {
  var max = 0;
  for(var i = 0, m = data.length - 1; i < m; ++i) {
    if (data[i].content > max)
      max = data[i].content;
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


StatsModel.prototype.calculate = function (data) {
  var result = {}
  switch (type) {
    case 'wheel':
      result.speed = {}
      result.summary = {}
      result.distance = {}
      
      result.distance.data = this.getDistance(data);
      result.distance.units = 'km';
      
      result.summary.distance = this.getSummary(result.distance.data);
      result.summary.speed = this.getSummary(result.speed.data);
      
      result.speed.data = this.getSpeed(result.distance.data);
      result.speed.units = 'km/h';
      
    break;
  }
  return result;
}

StatsModel.prototype.computeGroups = function (data, units, ticks) {
    var stats = {}

    stats.distance = {}
    stats.distance.data = [];
    stats.distance.units = units;
    stats.distance.ticks = ticks;
    

    for(var i in data) {
      stats.distance.data.push({
        createdAt : data[i][0].createdAt,
        content : this.getAverage(this.getDistance(data[i])) || 0
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

StatsModel.prototype.aggregateByTimestamp = function (data, time) {
  var aggregated = {}, 
      a = null, 
      t, 
      groupKey = {}, 
      x, 
      self = this;
  
  groupKey = function (a) {
    var date = new Date(a.createdAt).getTime();
    return date - (date % self.ticks[time])
  }
  
  for(var i = 0, m = data.length - 1; i < m; ++i) {
    a = data[i];
    t = groupKey(a);
    if (!aggregated[t])
      aggregated[t] = [];
    aggregated[t].push(a);
  }
  return aggregated;
},

StatsModel.prototype.get = function (User, timeval, type) {
  var self = this,
      compute = null
  
  getEventStartAndStop = function (type) {
    // TODO : add different events type
    return [
      'lapsStart',
      'laps',
      'lapsStop'
    ]
  }

  switch (timeval) {
    case 'hourly':
      time = {}
      time.start = Moment().subtract(12, 'hours').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'hours').format();
    break;

    case 'daily':
      time = {}
      time.start = Moment().subtract(1, 'days').format();
      time.end = Moment().add(1, 'days').format();
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
    break;
  }

  compute = function (raw, type) {
    return new Promise(function (fulfill, reject){
      data = self.aggregateByTimestamp(raw, timeval);
      fulfill(self.computeGroups(data, 'km', timeval, self.ticks[timeval]));
    })
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
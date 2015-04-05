
/*
 * Requirements
 */
var crypto = require('crypto'),
    Moment = require('moment'),
    Promise = require("bluebird"),
    console = require('console-plus'),
    Device = require('../bo/device'),
    _ = require('underscore'),
    Db = require('../models');

var StatsModel = function () {
  this.ticks = { // in milliseconds
      'hourly' : 60 * 15 * 1000, // 15mn
      'daily' : 60 * 60 * 1000, // 1h
      'weekly' : 24 * 60 * 60 * 1000, // 1day
      'monthly' : 24 * 60 * 60 * 1000, // 1day
      'yearly' : 30 * 24 * 60 * 60 * 1000 // 1month
    }

  this.perimeter = 2 * 3.1415926 * 17;
};

/*
 * This method returns for the last hour, day, week, month :
 * - total running distance
 * - total activity time
 * - % of activy
 * - max speed
 *
 * @params object or int
 * @return object
 */
StatsModel.prototype.getTotalSummary = function (UserOrId) {
  var self = this;

  return new Promise(function (fulfill, reject){
      var queryTotalSummary = function (id) {
        Db.Event.sum('content', {
          where : {
            type : self.getEventStartAndStop().toArray(),
            DeviceId : id
          }
        }, {raw: true})
        .then(function (res) {
          fulfill(res * self.perimeter)
        }).catch(function (e) {
          console.log(e, e.stack);
          reject(e.stack)
        })
      }
      if (typeof UserOrId == "object") {
       Device.find(User, function (err, res){
        console.log(err, res)
          if (err)
            return reject(err);
          queryTotalSummary(res.id)
        });
     } else
      queryTotalSummary(UserOrId)
    });
}


StatsModel.prototype.getTotalActivityTime = function (data) {
  var start = 0,
      stop = 0,
      time = 0,
      events = this.getEventStartAndStop().toObject(),
      a;

  for(var i = 0, m = data.length; i < m; ++i) {
    a = data[i];
    if (a.type == events.start) {
      start = a.createdAt;
    }
    else if (a.type == events.stop) {
      stop = a.createdAt;
      if (start)
        time = time + (stop - start)
    }
  }
  return time;
}

StatsModel.prototype.getActivity = function (data, timeval) {
  var time = this.getTimeVal(timeval),
      activityTime = this.getTotalActivityTime(data);

  return {
      time : activityTime,
      percent : (activityTime / (new Date(time.end) - new Date(time.start)) * 100)
    }
}

/*
 * 
 * @return int
 */
StatsModel.prototype.getDistance = function (data, ticks) {
    var distance = [], a, b, vm, last = null;
    for(var i = 0, m = data.length; i < m; ++i) {
      a = data[i];
      if (!a.content) {
        a.content = 0;
      }
      vm = (a.content * this.perimeter);
      b = {
        createdAt : new Date(a.createdAt),
        content : vm
      }
      
      if (last && b.createdAt.getTime() - last.createdAt.getTime() > ticks) {
        distance.push({
          createdAt : new Date(last.createdAt.getTime() + ticks),
          distance : 0
        })
        distance.push({
          createdAt : new Date(last.createdAt.getTime() + ticks + 1),
          distance : 0
        })
        distance.push({
          createdAt : new Date(b.createdAt.getTime() - ticks),
          distance : 0
        })
        distance.push({
          createdAt : new Date(b.createdAt.getTime() - ticks + 1),
          distance : 0
        })
      }
      distance.push(b);
      last = a;
    }
    return distance;
  }

StatsModel.prototype.getSummary = function (data) {
  var sum = 0,
      max = 0,
      activity = 0;

  data.map(function (vm) {
    if (vm.content > max)
      max = vm.content
    sum += vm.content;
  });
  return {average : Math.round(sum / (data.length - 1)), sum : Math.round(sum), max: Math.round(max)};
}

StatsModel.prototype.getAverage = function (data) {
  var max = 0;
  for(var i = 0, m = data.length - 1; i < m; ++i) {
    max += data[i].content;
  }
  return Math.round(max / m);
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
      
      result.summary.distance = this.getSummary(result.distance.data);
      result.summary.speed = this.getSummary(result.speed.data);
      
      result.speed.data = this.getSpeed(result.distance.data);
      
    break;
  }
  return result;
}

StatsModel.prototype.computeGroups = function (data, ticks, sorted) {
    var stats = {}

    stats.distance = {}
    stats.distance.data = [];
    stats.distance.ticks = ticks;
    stats.activity = [];

    sorted = sorted || true;

    for(var i in data) {
      stats.distance.data.push({
        createdAt : data[i][0].createdAt,
        content : this.getAverage(this.getDistance(data[i])) || 0
      });
    }
    
    if (!sorted) {
      stats.distance.data.sort(function (a, b) {
        if (a.createdAt > b.createdAt)
          return 1;
        else if (a.createdAt < b.createdAt)
          return -1;
        return 0;
      })
    }

    stats.summary = this.getSummary(stats.distance.data);

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

StatsModel.prototype.getEventStartAndStop = function (type) {
  this.events = [
    'lapsStart',
    'laps',
    'lapsStop'
  ]
  this.toArray = function () {
    return this.events
  }

  this.toObject = function () {
    return {
      start : 'lapsStart',
      current : 'laps',
      stop : 'lapsStop'
    }
  }
  return this
},

StatsModel.prototype.getTimeVal = function (timeval) {
  var time = {}

  switch (timeval) {
    case 'hourly':
      time.start = Moment().subtract(12, 'hours').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'hours').format();
    break;

    case 'daily':
      time.start = Moment().subtract(1, 'days').format();
      time.end = Moment().add(1, 'days').format();
    break;

    case 'weekly':
      time.start = Moment().subtract(7, 'days').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'days').format();
    break;

    case 'monthly':
      time.start = Moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).format();
      time.end = Moment().add(1, 'days').format();
    break;
  }
  return time;
}

StatsModel.prototype.get = function (UserOrId, timeval, type) {
  var self = this,
      time = this.getTimeVal(timeval);
  
  return new Promise(function (fulfill, reject){
    var methodName = 'get' + timeval.substring(0,1).toUpperCase() + timeval.substring(1)

    if (typeof UserOrId == "object") {
     Device.find(User, function (err, res){
        if (err)
          return reject(err);
        self[methodName](fulfill, reject, res.id, time, timeval)
      });
    } else {
      self[methodName](fulfill, reject, UserOrId, time, timeval)
    }
  })
}

StatsModel.prototype.getHourly = function (fulfill, reject, deviceId, time, timeval) {
  var self = this,
      compute = function (raw, type) {
        return new Promise(function (fulfill, reject){
          var data = self.aggregateByTimestamp(raw, timeval),
              computeData = self.computeGroups(data, timeval, self.ticks[timeval]);
          computeData.activity = self.getActivity(raw, timeval)

          fulfill(computeData);
        })
      }

  return Db.Event.findAll({
              where : {
                createdAt : { 
                  gt : time.start,
                  lt : time.end
                },
                type : self.getEventStartAndStop().toArray(),
                DeviceId : deviceId
              },
              order: [['createdAt', 'ASC']],
              limit: 50000
            }, {raw: true}).spread(function (data) {
              return compute(arguments).then(function (result) {
                fulfill(result)
              })
            }).catch(function (e) {
              console.log(e, e.stack);
              reject(e.stack)
            })
}

StatsModel.prototype.getDaily = StatsModel.prototype.getHourly;

StatsModel.prototype.getWeekly = function (fulfill, reject, deviceId, time, timeval) {
  var self = this,
      TableName = 'Event' + timeval.substring(0,1).toUpperCase() + timeval.substring(1)

  return Db[TableName].findAll({
              where : {
                createdAt : { 
                  gt : time.start,
                  lt : time.end
                },
                DeviceId : deviceId
              },
              order: [['id', 'ASC']],
              limit: 5000
            }, {raw: true}).spread(function (data) {
              if (data) {
                var result = {
                  distance : data.timeval,
                  summary : data.summary,
                  activity : data.activity
                }
                fulfill(result);
              }
              fulfill({});
            }).catch(function (e) {
              console.log(e, e.stack);
              reject(e.stack)
            })
}
StatsModel.prototype.getMonthly = StatsModel.prototype.getWeekly
StatsModel.prototype.getYearly = StatsModel.prototype.getWeekly

StatsModel.prototype.isValidType = function (type) {
  return ['wheel'].indexOf(type) != -1;
}

StatsModel.prototype.archive = function () {
  var time = this.getTimeVal('daily'),
      self = this;

  return new Promise(function (fulfill, reject) {
          Db.Event.findAll({
              where : {
                createdAt : { 
                  gt : time.start,
                  lt : time.end
                },
                type : self.getEventStartAndStop().toArray()
              },
              order: [['id', 'ASC']],
              limit: 5000
            }, {raw: true}).spread(function () {
              var dataGroupedByDevice = _.groupBy(arguments, function (row) {
                    return row.DeviceId
                  }), sqlData = [];

              _.map(dataGroupedByDevice, function (el, deviceId) {
                el.sort(function (a, b) {
                  if (a.id < b.id)
                    return -1;
                  else if (a.id > b.id)
                    return 1;
                  else 
                    return 0;
                })
                el = self.computeGroups(self.aggregateByTimestamp(el, 'daily'), 'daily');
                sqlData.push({
                  timeval : JSON.stringify(el.distance.data),
                  activity : JSON.stringify(el.activity),
                  summary : JSON.stringify(el.summary),
                  DeviceId : deviceId
                })
              })
              Db.EventWeekly.bulkCreate(sqlData).then(function () {
                fulfill(sqlData)
              }).catch(function (e) {
                console.log(e, e.stack);
                reject(e.stack)
              })
            }).catch(function (e) {
              console.log(e, e.stack);
              reject(e.stack)
            })
          })
}

if (typeof module !== 'undefined') {
  module.exports = new StatsModel();
}
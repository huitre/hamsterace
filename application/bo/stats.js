
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
StatsModel.prototype.getTotalSummary = function (UserId) {
  var time = this.getTimeVal('daily'),
      self = this;

  return new Promise(function (fulfill, reject) {
          Device.find(UserId).then(function (device) {
            Db.Event.findAll({
                where : {
                  DeviceId : device.DeviceId,
                  createdAt : { 
                    gt : time.start,
                    lt : time.end
                  },
                  type : self.getEventStartAndStop().toArray()
                },
                order: [['id', 'ASC']],
                limit: 5000
              }, {raw: true}).spread(function () {
                fulfill(self.computeGroups(self.aggregateByTimestamp(arguments, 'daily'), 'daily'));
              }).catch(function (e) {
                console.log(e, e.stack);
                reject(e.stack)
              })
            })
          })
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
      
      /*if (last && b.createdAt.getTime() - last.createdAt.getTime() > ticks) {
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
      }*/
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

StatsModel.prototype.sum = function (data) {
  var sum = 0;

  data.map(function (vm) {
    sum += vm.content;
  });

  return sum;
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


StatsModel.prototype.calculate = function (data, calcDistance) {
  var result = {}
  
    calcDistance = calcDistance || false;

    result.speed = {}
    result.summary = {}
    result.distance = {}
    
    result.distance.data = calcDistance ? this.getDistance(data) : data;
    
    result.summary.distance = this.getSummary(result.distance.data);
    
    result.speed.data = this.getSpeed(result.distance.data);
    result.summary.speed = this.getSummary(result.speed.data);

  return result;
}

/*
 * Takes an array of object with two attributes (createdAt and content)
 * This array 
 */
StatsModel.prototype.computeGroups = function (data, ticks, hasDistance) {
    var stats = {}

    stats.distance = {}
    stats.distance.data = [];
    stats.distance.ticks = ticks;
    stats.activity = [];

    hasDistance = hasDistance || false;

    for(var i in data) {
      try {
        stats.distance.data.push({
          createdAt : data[i][Math.round(data[i].length / 2)].createdAt,
          content : Math.round(this.sum(hasDistance ? data[i] : this.getDistance(data[i]))) || 0
        });
      } catch (e) {
        console.log(e);
      }
    }
    /*
    if (!sorted) {
      stats.distance.data.sort(function (a, b) {
        if (a.createdAt > b.createdAt)
          return 1;
        else if (a.createdAt < b.createdAt)
          return -1;
        return 0;
      })
    }*/

    stats.summary = this.getSummary(stats.distance.data);

    return stats
},

StatsModel.prototype.aggregateActivityByTimestamp = function (data, time) {
  var aggregated = tmp = [];

  for(var i = 0, m = data.length - 1; i < m; ++i) {
    tmp = this.aggregateByTimestamp(data[i], time)
    for (var j in tmp)
      aggregated.push(_.flatten(tmp[j]))
  }
  return aggregated;
}

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

StatsModel.prototype.aggregateByActivity = function (raw) {
  var events = this.getEventStartAndStop().toObject(),
      iterator = {},
      data = [],
      j = 0,
      start = false, stop = false;

  data[j] = [];
  for(var i = 0, m = raw.length - 1; i < m; ++i) {
    iterator = raw[i];
    if (iterator.type == events.start) {
      start = true;
    } else if (iterator.type == events.stop) {
      stop = true;
    }
    data[j].push(iterator)
    if (start && stop) {
      j += 1;
      start = false;
      stop = false;
      data[j] = [];
    }
  }

  return data;
}

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
      time.start = Moment().subtract(1, 'hours').format();
    break;

    case 'daily':
      time.start = Moment().hours(0).minutes(0).seconds(0).format();
      //time.end = Moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).format();
    break;

    case 'weekly':
      time.start = Moment().subtract(7, 'days').hours(0).minutes(0).seconds(0).format();
    break;

    case 'monthly':
      time.start = Moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).format();
    break;
  }

  time.end = Moment().format();

  return time;
}

/*
 * @return Promise
 */
StatsModel.prototype.get = function (UserOrId, timeval, type) {
  var self = this,
      time = this.getTimeVal(timeval);
  
  return new Promise(function (fulfill, reject){
    var methodName = 'get' + timeval.substring(0,1).toUpperCase() + timeval.substring(1)

    if (typeof UserOrId == "object") {
     Device.find(User).then(function (err, res){
        self[methodName](fulfill, reject, res.id, time, timeval)
      }).catch(function (e) {
        return reject(err);
      });
    } else {
      self[methodName](fulfill, reject, UserOrId, time, timeval)
    }
  })
}


/*
 * @return Promise
 */
StatsModel.prototype.getHourly = function (fulfill, reject, deviceId, time, timeval) {
  var self = this,
      compute = function (raw, type) {
        return new Promise(function (fulfill, reject){
          var data = self.aggregateActivityByTimestamp(self.aggregateByActivity(raw), timeval),
              computeData = self.computeGroups(data, timeval, self.ticks[timeval]);
          computeData.activity = self.getActivity(raw, timeval);
          /*computeData.groupedActivity = self.aggregateByActivity(raw);
          computeData.grouped = data;*/

          fulfill(computeData);
        })
      }

  return Db.Event.findAll({
              where : {
                createdAt : { 
                  gte : time.start,
                  lte : time.end
                },
                type : self.getEventStartAndStop().toArray(),
                DeviceId : deviceId
              },
              order: [['id', 'ASC']],
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
                  gte : time.start,
                  lte : time.end
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

StatsModel.prototype.archiveMonthly = function () {
  var self = this,
      time = this.getTimeVal('weekly');

  return new Promise(function (fulfill, reject) {
    Db.EventWeekly.findAll({
      where : {
        createdAt : { 
          gte : time.start,
          lte : time.end
        }
      },
      order: [['id', 'ASC']],
      limit: 5000
    }, {raw: true}).spread(function () {
      var dataGroupedByDevice = _.groupBy(arguments, function (row) {
              return row.DeviceId
            }), 
            timeval = 'daily',
            sqlData = [];

      _.map(dataGroupedByDevice, function (raw, deviceId) {
          var data = []

          raw.sort(function (a, b) {
            if (a.id < b.id)
              return -1;
            else if (a.id > b.id)
              return 1;
            else 
              return 0;
          })
          _.map(raw, function (weekData, weekId) {
           data.push(JSON.parse(weekData.timeval))
          })
          var computeData = self.computeGroups(data, timeval, true);
          
          computeData.activity = self.getActivity(raw, timeval);
                
          sqlData.push({
            timeval : JSON.stringify(computeData.distance.data),
            activity : JSON.stringify(computeData.activity),
            summary : JSON.stringify(computeData.summary),
            DeviceId : deviceId
          })
        })
      Db.EventMonthly.bulkCreate(sqlData).then(function (data) {
        fulfill(sqlData);
      }).catch(function (e) {reject(e)})
    });
  });
}

StatsModel.prototype.archiveYearly = function () {
  return new Promise(function (fulfill, reject) {

  });
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
                  }), 
                  timeval = 'daily',
                  sqlData = [];

              _.map(dataGroupedByDevice, function (raw, deviceId) {
                raw.sort(function (a, b) {
                  if (a.id < b.id)
                    return -1;
                  else if (a.id > b.id)
                    return 1;
                  else 
                    return 0;
                })

                var data = self.aggregateActivityByTimestamp(self.aggregateByActivity(raw), timeval),
                    computeData = self.computeGroups(data, timeval);
                    computeData.activity = self.getActivity(raw, timeval);
                
                sqlData.push({
                  timeval : computeData.distance.data,
                  activity : computeData.activity,
                  summary : computeData.summary,
                  DeviceId : deviceId
                })
              })
              Db.EventWeekly.bulkCreate(sqlData).then(function () {
                var a = Moment();
                // TODO : locale pour avoir lundi == 0
                if (a.weekday() == 0) 
                  self.archiveMonthly().then(function (data) {
                    if (a.date() == 1)
                      self.archiveYearly().then(function (data) {
                        fulfill(data)
                      })
                    else
                      fulfill(data)
                  })
                else
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
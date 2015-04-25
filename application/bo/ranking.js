
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

var RankingModel = function () {
  this.ticks = { // in milliseconds
      'hourly' : 60 * 15 * 1000, // 15mn
      'daily' : 60 * 60 * 1000, // 1h
      'weekly' : 24 * 60 * 60 * 1000, // 1day
      'monthly' : 24 * 60 * 60 * 1000, // 1day
      'yearly' : 30 * 24 * 60 * 60 * 1000 // 1month
    }

  this.perimeter = 2 * 3.1415926 * 17;
  this.rankings = [];
  this.sort = {};
};



RankingModel.prototype.find = function (UserId) {
}


RankingModel.prototype.sortByMaxDistance = function (_rankings) {
  rankings = _rankings || this.rankings;

  rankings.sort(function (a, b) {
    if (a.summary.max < b.summary.sum)
      return 1;
    else if (a.summary.max > b.summary.max)
      return -1;
    else 
      return 0;
  })
}

RankingModel.prototype.sortByDistance = function (_rankings) {
  rankings = _rankings || this.rankings;

  rankings.sort(function (a, b) {
      if (a.summary.sum < b.summary.sum)
        return 1;
      else if (a.summary.sum > b.summary.sum)
        return -1;
      else 
        return 0;
    })
}

RankingModel.prototype.sortByActivity= function (_rankings) {
  rankings = _rankings || this.rankings;
  
  rankings.sort(function (a, b) {
      if (a.activity.time < b.activity.time)
        return 1;
      else if (a.activity.time > b.activity.time)
        return -1;
      else 
        return 0;
    })
}


RankingModel.prototype.pushSort = function (key) {
  this.sort[key] = [];
  for (var k in this.rankings) {
    this.sort[key].push(this.rankings[k].friend.id)
  }
}

RankingModel.prototype.distance = function () {
  return this.getRanking("CAST(\"EventWeekly\".\"summary\"->>'sum' as int) DESC")
}

RankingModel.prototype.max = function () {
  return this.getRanking("CAST(\"EventWeekly\".\"summary\"->>'max' as int) DESC")
}

RankingModel.prototype.average = function () {
  return this.getRanking("CAST(\"EventWeekly\".\"summary\"->>'average' as int) DESC")
}

RankingModel.prototype.activity = function () {
  return this.getRanking("CAST(\"EventWeekly\".\"activity\"->>'percent' as float) DESC")
}

RankingModel.prototype.getRanking = function (order, limit) {
  var self = this,
      time = Moment().subtract(1, 'week').hours(0).minutes(0).seconds(0).format(),
      limit = limit || 50;
      
  return new Promise(function (fulfill, reject) {
    Db.EventWeekly.findAll({
      attributes : ['DeviceId', 'activity', 'summary'],
      where : {
        createdAt : { 
          gte : time
        }
      },
      order : {raw : order},
      limit : limit,
      include : {
        model : Db.Device,
        attributes : ['id'],
        include : {
          model : Db.RegisteredDevice,
          attributes : ['PersonId'],
          include : {
            model : Db.Person,
            attributes : ['id'],
            include : {
              model : Db.PersonDetails,
              attributes : ['name', 'firstname', 'gender']
            }
          }
        }
      }
    }).then(function (rows) {
      rows.map(function (row) {
        var activity = {},
            summary = {}
        if (row.Device.RegisteredDevices.length) {
          self.rankings.push({
            person : {
              id : row.PersonId,
              firstname : row.Device.RegisteredDevices[0].Person.PersonDetails[0].firstname,
              name : row.Device.RegisteredDevices[0].Person.PersonDetails[0].name
            },
            deviceId : row.DeviceId,
            activity : row.activity,
            summary : row.summary,
          })
        }
      })
      fulfill(self.rankings)
    })
  })
}

/*
 *
 * @params object or int
 * @return object
 */
RankingModel.prototype.friends = function (UserId) {
  var self = this,
      time = Moment().subtract(1, 'week').hours(0).minutes(0).seconds(0).format();

  return new Promise(function (fulfill, reject) {
    Db.PeopleFriend.findAll({
      attributes : ['id', 'FriendId'],
      where : {PersonId: UserId, confirmed: true},
      include : [{
        model: Db.Person,
        as : 'Friend',
        attributes : ['id'],
        include : [{
            attributes : ['firstname', 'name'],
            model : Db.PersonDetails
          },{
          model : Db.RegisteredDevice,
          attributes : ['DeviceId'],
          include : {
            attributes : ['id'],
            model : Db.Device,
            include : {
              model : Db.EventWeekly,
              limit : 1,
              attributes : ['activity', 'summary'],
              where : {
                createdAt : { 
                  gte : time
                }
              }
            }
          }
        }]
      }]
    }).then(function (rows) {

      // on epure l'objet
      rows.map(function (row) {
        var activity = {},
            summary = {}

        self.rankings.push({
          friend : {
            id : row.FriendId,
            firstname : row.Friend.PersonDetails[0].firstname,
            name : row.Friend.PersonDetails[0].name
          },
          deviceId : row.Friend.RegisteredDevice.Device.id,
          activity : row.Friend.RegisteredDevice.Device.EventWeeklies[0].activity,
          summary : row.Friend.RegisteredDevice.Device.EventWeeklies[0].summary,
        })
      })
      
      // on le sort car l'ORM ne gere pas 
      // encore le ORDER avec le type json de postgre
      self.sortByMaxDistance();
      self.pushSort('max');

      self.sortByDistance()
      self.pushSort('sum');

      self.sortByActivity()
      self.pushSort('activity');



      fulfill({sort : self.sort, rankings : self.rankings});
    }).catch(function (e) { reject(e) })

  }).catch(function (e) { reject(e) })
}



if (typeof module !== 'undefined') {
  module.exports = new RankingModel();
}
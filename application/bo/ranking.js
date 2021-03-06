
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
            include : [{
              model : Db.PersonDetails,
              attributes : ['name', 'firstname', 'gender']
            }, {
              model : Db.Avatar,
              attributes : ['id'],
              include : [{
                model: Db.Image,
                attributes : ['resource']
              }]
            }]
          }
        }
      }
    }).then(function (rows) {
      var rankings = [];
      rows.map(function (row) {
        var activity = {},
            summary = {}
        if (row.Device.RegisteredDevices.length) {
          rankings.push({
            person : {
              id : row.PersonId,
              firstname : row.Device.RegisteredDevices[0].Person.PersonDetails[0].firstname,
              name : row.Device.RegisteredDevices[0].Person.PersonDetails[0].name,
              avatar : row.Device.RegisteredDevices[0].Person.Avatar.Image.resource
            },
            deviceId : row.DeviceId,
            activity : row.activity,
            summary : row.summary,
          })
        }
      })
      fulfill(rankings)
    })
  })
}


/*
 * 
 *
 * @params object/int User ou id user
 * @params string     
 * @return object
 */
RankingModel.prototype.getFriendRanking = function (UserId, order) {
  var self = this,
      time = Moment().subtract(1, 'week').hours(0).minutes(0).seconds(0).format();

  return new Promise(function (fulfill, reject) {
    Db.PeopleFriend.findAll({
      order : {raw : order},
      attributes : ['FriendId'],
      where : {PersonId: UserId, confirmed: true},
      include : [{
        model: Db.Person,
        as : 'Friend',
        attributes : ['id'],
        include : [{
            attributes : ['firstname', 'name'],
            model : Db.PersonDetails
          },{
            model : Db.Avatar,
            attributes : ['id'],
            include : [{
              model: Db.Image,
              attributes : ['resource']
            }]
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
      var rankings = [];
      // on epure l'objet
      rows.map(function (row) {
        var activity = {},
            summary = {}

        rankings.push({
          friend : {
            id : row.FriendId,
            firstname : row.Friend.PersonDetails[0].firstname,
            name : row.Friend.PersonDetails[0].name,
            avatar : row.Friend.Avatar.Image.resource
          },
          deviceId : row.Friend.RegisteredDevice.Device.id,
          activity : row.Friend.RegisteredDevice.Device.EventWeeklies[0].activity,
          summary : row.Friend.RegisteredDevice.Device.EventWeeklies[0].summary,
        })
      })

      fulfill(rankings);
    }).catch(function (e) { reject(e) })
  })
}

/*
 * Bit tricky here, the order is done by the full alias name of the include cascade
 * then, cast json to perform the correct order.
 * Had to use raw format cause can't cast and using model include as the same type
 * This can cause future bugs if name models change
 */
RankingModel.prototype.friendsDistance = function (UserId) {
  return this.getFriendRanking(UserId, "CAST(\"Friend.RegisteredDevice.Device.EventWeeklies\".\"summary\"->>'sum' as int) DESC")
}

RankingModel.prototype.friendsMax = function (UserId) {
  return this.getFriendRanking(UserId, "CAST(\"Friend.RegisteredDevice.Device.EventWeeklies\".\"summary\"->>'max' as int) DESC")
}

RankingModel.prototype.friendsAverage = function (UserId) {
  return this.getFriendRanking(UserId, "CAST(\"Friend.RegisteredDevice.Device.EventWeeklies\".\"summary\"->>'average' as int) DESC")
}

RankingModel.prototype.friendsActivity = function (UserId) {
  return this.getFriendRanking(UserId," CAST(\"Friend.RegisteredDevice.Device.EventWeeklies\".\"activity\"->>'percent' as float) DESC")
}

RankingModel.prototype.find = function (UserId) {
}




if (typeof module !== 'undefined') {
  module.exports = new RankingModel();
}

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
};


RankingModel.prototype.find = function (UserId) {
}


/*
 *
 * @params object or int
 * @return object
 */
RankingModel.prototype.friends = function (UserId) {
  var self = this;

  return Db.PeopleFriend.findAll({
      attributes : ['id'],
      where : {PersonId: UserId, confirmed: true},
      include : [{
        model: Db.Person,
        attributes : ['id'],
        include : [{
          model : Db.PersonDetails,
          attributes : ['name', 'firstname'],
        }, {
          model : Db.RegisteredDevice,
          attributes : ['DeviceId'],
          include : {
            attributes : ['id'],
            model : Db.Device,
            include : {
              model : Db.EventWeekly
            }
          }
        }]
      }]
    })
  /*return new Promise(function (fulfill, reject) {
      Db.EventWeekly.findAll({
        include: {
          model : Db.Device,
          attributes : ['id'],
          include : {
            model : Db.RegisteredDevice,
            include : {
              model : Db.Person,
              attributes : ['id'],
              include : [{
                model : Db.PeopleFriend,
                attributes : ['confirmed'],
                where : {
                  confirmed : true
                },
              }, {
                model : Db.PersonDetails,
                attributes : ['name', 'firstname']
              }]
            }
          }
        },
        limit: 50
      }, {raw:true}).spread(function () {
        fulfill(arguments)
      })
  })*/
}



if (typeof module !== 'undefined') {
  module.exports = new RankingModel();
}
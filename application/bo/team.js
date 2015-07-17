/* 
* @Author: huitre
* @Date:   2015-07-15 20:34:25
* @Last Modified by:   huitre
* @Last Modified time: 2015-07-17 11:54:05
*/

/*
 * Requirements
 */
var Db = require('../models'),
    Person = require('../bo/person'),
    crypto = require('crypto'),
    Promise = require("bluebird"),
    events = require('events'),
    console = require('console-plus');

var TeamsModel = function () {}

TeamsModel.prototype = Object.create(events.EventEmitter.prototype);


/**
 *
 */

TeamsModel.prototype.createTeam = function (teamID, team) { 
}

TeamsModel.prototype.updateTeam = function (teamID, team) { 
}

TeamsModel.prototype.getTeams = function (offset) {
  offset = offset || {from : 30, to : 0};

  return new Promise (function (fullfill, reject) {
    Db.Team.findAll({
      include : [{
        model : Db.Person,
        attributes : ['TeamMember.id', [Db.sequelize.fn('COUNT', 'TeamMember.id'), 'MembersCount']]
      }],
      group : ['TeamMember.id'],
      limit : offset.from,
      offset : offset.to
    }).then(function (teams) {
      fullfill(teams)
    }).catch(function (e) {
      reject(e)
    })
  });
}

TeamsModel.prototype.getTeam = function (teamID) {
}

TeamsModel.prototype.getTeamByName = function (teamName) { 
  return Db.Team.findAll({
    where : {
      name : { ilike : '%' + name + '%' }
    }
  })
}

TeamsModel.prototype.getTeamMembers = function (teamID) {

}

TeamsModel.prototype.addTeamMember = function (teamID, userId) { 
}

TeamsModel.prototype.removeTeamMembers = function (teamID, userId) {
}

TeamsModel.prototype.getRequestTeamMembers = function (teamID, userId) { 
}

TeamsModel.prototype.getTeamBadges = function (teamID) { 
}

TeamsModel.prototype.getTeamStats = function (teamID) { 
}


if (typeof module !== 'undefined') {
  module.exports = new TeamsModel;
}
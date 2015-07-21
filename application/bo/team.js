/* 
* @Author: huitre
* @Date:   2015-07-15 20:34:25
* @Last Modified by:   huitre
* @Last Modified time: 2015-07-18 19:25:37
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


// inherit Event for Badges system
TeamsModel.prototype = Object.create(events.EventEmitter.prototype);

TeamsModel.prototype.populateTeams = function (rows) {
  var friends = [],
      populate = function (row) {
        friends.push({
          id : row.FriendId,
          type : row.type,
          gender : row.Friend.PersonDetails.gender,
          age : row.Friend.PersonDetails.age,
          updatedAt : row.updatedAt,
          firstname : row.Friend.PersonDetails.firstname,
          name : row.Friend.PersonDetails.name,
          avatar : row.Friend.Avatar.Image
        });
      }

  if (rows.hasOwnProperty('length')) 
    rows.map(populate)
  else 
    populate(rows)
  
  return friends;
}


TeamsModel.prototype.populateTeamMembers = function (rows) {
  var friends = [],
      populate = function (row) {
        friends.push({
          id : row.FriendId,
          type : row.type,
          gender : row.Friend.PersonDetails.gender,
          age : row.Friend.PersonDetails.age,
          updatedAt : row.updatedAt,
          firstname : row.Friend.PersonDetails.firstname,
          name : row.Friend.PersonDetails.name,
          avatar : row.Friend.Avatar.Image
        });
      }

  if (rows.hasOwnProperty('length')) 
    rows.map(populate)
  else 
    populate(rows)
  
  return friends;
}


/**
 * @params User Db.models.Person
 * @params team obj reflecting schema of Db.models.Team
 */

TeamsModel.prototype.createTeam = function (User, team) {
  team.exp = 0;
  team.level = 1;

  return new Promise (function (fullfill, reject) {
    var Team = Db.Team.build(team).save().then(function (team) {
      var TeamMember = Db.TeamMember.create({
            confirmed : true,
            status : 'admin',
            PersonId : User.id,
            TeamId : team.id
          }).then(function (teamMember) {
            fullfill({
              team : team,
              member : teamMember
            })
          }).catch(function (e) {
            reject(e);
          })
    })
  });
}


/**
 * @params User Db.models.Person
 * @params team obj reflecting schema of Db.models.Team
 */
TeamsModel.prototype.updateTeam = function (User, team) {
  return new Promise(function (fullfill, reject) {
    Db.TeamMember.findOne({
      PersonId : User.id,
      TeamId : team.id
    }).then(function (TeamMember) {
      if (!TeamMember || TeamMember.status != 'admin') {
        return reject('Not enough permission to delete team ' + team.teamId);
      }
      Db.Team.findById(team.teamId).then(function (Team) {
        Team.update(team).save().then(function (status) {
          fullfill(status)
        }).catch(function (e) {
          reject(e)
        })
      }).catch(function (e) {
        reject(e)
      })
    })
  })
}


/**
 * Remove a Team from the database only if the user exists and
 * his status equals to admin
 *
 * @params User Db.models.Person
 * @params team obj reflecting schema of Db.models.Team
 */
TeamsModel.prototype.removeTeam = function (User, team) {
  return new Promise(function (fullfill, reject) {
    Db.TeamMember.findOne({
      PersonId : User.id,
      TeamId : team.teamId
    }).then(function (TeamMember) {
      if (!TeamMember || TeamMember.status != 'admin') {
        return reject('Not enough permission to delete team ' + team.teamId);
      }
      Db.Team.findById(team.teamId).then(function (Team) {
        Team.destroy().then(function (status) {
          fullfill(status)
        }).catch(function (e) {
          reject(e)
        })
      }).catch(function (e) {
        reject(e)
      })
    })
  })
}

TeamsModel.prototype.getTeams = function (offset, where) {
  var self = this;

  offset = offset || {from : 30, to : 0};
  where = where || '1 = 1';

  return new Promise (function (fullfill, reject) {
    Db.Team.findAll({
      include : [{
        model : Db.TeamMember,
        attributes : ['status'],
        include : [{
          model: Db.Person,
          attributes : ['id'],
          include : [{
            model : Db.PersonDetails,
            attributes : ['firstname', 'name']
          }, {
            model : Db.Avatar,
            attributes : ['id'],
            include : [{
              model: Db.Image,
              attributes : ['resource']
            }]
          }]
        }],
        limit : 5
      }],
      limit : offset.from,
      offset : offset.to,
      where : where
    }).then(function (teams) {
      fullfill(self.populateTeams(teams))
    }).catch(function (e) {
      reject(e)
    })
  });
}

TeamsModel.prototype.getTeam = function (teamID) {
  return this.getTeams(0, {id : teamID})
}

/**
 * Used for checking if a team already exists
 * @params teamName string name
 * @return Promise with all teams found
 */
TeamsModel.prototype.nameExists = function (teamName) { 
  return Db.Team.findAll({
    where : {
      name : { ilike : '%' + teamName + '%' }
    },
    attributes : ['id']
  })
}

TeamsModel.prototype.getTeamByName = function (teamName) { 
  return Db.Team.findAll({
    where : {
      name : { ilike : '%' + teamName + '%' }
    }
  })
}

TeamsModel.prototype.getTeamMembers = function (teamID) {

}

TeamsModel.prototype.addTeamMember = function (teamID, userId) { 
}

TeamsModel.prototype.removeTeamMembers = function (teamID, userId) {
}

TeamsModel.prototype.addRequestTeamMembers = function (teamID, userId) { 
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
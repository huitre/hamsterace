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
  var teams = [],
    self = this,
    populate = function (row) {
      teams.push({
        id : row.id,
        name : row.name,
        slogan : row.slogan,
        recruit : row.recruit,
        visible : row.visible,
        max : row.max,
        members : self.populateTeamMembers(row.TeamMembers)
      });
    }

  if (rows.hasOwnProperty('length'))
    rows.map(populate)
  else
    populate(rows)

  return teams;
}


TeamsModel.prototype.populateTeamMembers = function (rows) {
  var members = [],
      populate = function (row) {
        if (row && row.Person.PersonDetail) {
          members.push({
            id : row.Person.id,
            type : row.Person.type,
            status : row.status,
            confirmed : row.confirmed,
            gender : row.Person.PersonDetail.gender,
            age : row.Person.PersonDetail.age,
            updatedAt : row.Person.updatedAt,
            firstname : row.Person.PersonDetail.firstname,
            name : row.Person.PersonDetail.name,
            avatar : {
              src : row.Person.Avatar ? row.Person.Avatar.Image.resource : null
            }
          });
        }
      }

  if (rows.hasOwnProperty('length'))
    rows.map(populate)
  else
    populate(rows)

  return members;
}



/**
 * @params User Db.models.Person
 * @params team obj reflecting schema of Db.models.Team
 */

TeamsModel.prototype.createTeam = function (User, team) {
  team.xp = 0;
  team.level = 1;

  if (team.visible == null)
    team.visible = true;
  if (team.recruit == null)
    team.recruit = true;

  return new Promise (function (fullfill, reject) {
    var Team = Db.Team.build(team).save().then(function (team) {
      var TeamMember = Db.TeamMember.create({
            confirmed : true,
            status : 'owner',
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
      if (!TeamMember || (TeamMember.status != 'admin' || TeamMember.status != 'owner')) {
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
      if (!TeamMember || TeamMember.status != 'owner') {
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

/**
 * Return all teams from the database
 *
 * @params offset
 * @params where optionnal
 * @return Promise
 */
TeamsModel.prototype.getTeams = function (offset, where) {
  var self = this;

  offset = offset || {from : 30, to : 0};
  where = where || {visible: true};

  return new Promise (function (fullfill, reject) {
    Db.Team.findAll({
      include : [{
        model : Db.TeamMember,
        attributes : ['status', 'xp'],
        where : {confirmed : true},
        order : ['id'],
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
        limit : 30
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

TeamsModel.prototype.getMine = function (user) {
  var self = this;

  return new Promise(function(fulfill, reject) {
    Db.TeamMember.findOne({
      where : {
        PersonId : user.id,
        confirmed : true
      }
    }).then(function (TeamMember) {
      if (TeamMember)
        return fulfill(self.getTeam(TeamMember.TeamId))
      else
        fulfill(null)
    })
  })
}

/**
 * 
 * @params teamID Id of a Team
 * @return Promise with all teams found
 */
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

/**
 * Used for checking if a team already exists
 * @params teamName string name
 * @return Promise with all teams found
 */
TeamsModel.prototype.getTeamByName = function (teamName) { 
  return this.getTeams({from: 5, to: 0}, {name : { ilike : '%' + teamName + '%' }})
}

TeamsModel.prototype.getTeamMember = function (userId, teamId) {
  return Db.TeamMember.findOne({
          where : {
            PersonId : userId,
            TeamId : teamId
          }
        })
}

TeamsModel.prototype.getTeamMembers = function (teamID, confirmed) {
  var self = this,
      confirmed = confirmed != null ? confirmed : true

  return new Promise (function (fullfill, reject) {
    Db.TeamMember.findAll({
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
      where : {
        TeamId : teamID,
        confirmed : confirmed
      }
    }).then(function (members) {
      fullfill(self.populateTeamMembers(members))
    }).catch(function (e) {
      reject(e)
    })
  });

}

/*
 * Accept the request of a member to join a Team
 * @params teamId Id Team
 * @params userId Id User
 * @reteurn Promise
 */
TeamsModel.prototype.addTeamMember = function (teamId, userId) {
  var self = this;

  return new Promise (function (fullfill, reject) {
    self.getTeamMember(userId, teamId).then(function (user) {
        if (user) {
          user.set({confirmed : true});
          user.save().then(function (User) {
            fullfill(User)
          })
        } else {
          reject('User not found')
        }
      })
    });
}

/*
 * Remove a member from a Team
 * @params teamId Id Team
 * @params userId Id User
 * @return User
 */
TeamsModel.prototype.removeTeamMembers = function (User, teamID, userId) {
  var self = this;

  return new Promise (function (fullfill, reject) {
    self.getTeamMember(User.id, teamID).then(function (TeamMember) {
      if (!TeamMember || (TeamMember.status != 'owner' || TeamMember.status != 'admin')) {
        return reject('Not enough permission to delete member ' + userId);
      }

      self.getTeamMember(userId).then(function (user) {
          if (user) {
            user.destroy().then(function (status) {
              fullfill(status)
            }).catch(function (e) {
              reject(e)
            })
          } else {
            reject('User not found')
          }
        })
      })
  });
}

/*
 * Create a request of a member to join a Team
 * @params teamId Id Team
 * @params userId Id User
 * @return Promise
 */
TeamsModel.prototype.addRequestTeamMembers = function (teamId, userId) {
  var self = this;

  return new Promise (function (fullfill, reject) {
    self.getTeamMember(userId, teamId).then(function (user) {
      if (user)
        return reject(user.firstname + 'already in request list')
      Db.TeamMember.create({
        confirmed : false,
        status : 'member',
        PersonId : userId,
        TeamId : teamId
      }).then(function (teamMember) {
        fullfill({
          member : teamMember
        })
      }).catch(function (e) {
        reject(e);
      })
    })
  });
}

TeamsModel.prototype.getRequestTeamMembers = function (teamID) {
  return this.getTeamMembers(teamID, false);
}

TeamsModel.prototype.getTeamBadges = function (teamID) { 
}

TeamsModel.prototype.getTeamStats = function (teamID) { 
}


if (typeof module !== 'undefined') {
  module.exports = new TeamsModel;
}
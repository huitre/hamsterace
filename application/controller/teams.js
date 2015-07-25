"use strict"

var Promise = require("bluebird"),
    Team = require('../bo/team'),
    H = require('../hra/lib/utils'),
    console = require('console-plus');

exports.index = function (req, res) {
  Team.getTeams(req.params.id).then(function (Team) {
    res.send(Team)
  }).catch(function (e) {
    res.status(500).send(arguments);
  })
}

exports.exists = function (req, res) {
  if (req.params.name) {
    Team.nameExists(req.params.id).then(function (Team) {
      res.send(Team)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.find = function (req, res) {
  if (req.params.id) {
  	Team.getTeam(req.params.id).then(function (Team) {
      if (Team) {
        Team = Team.pop();
      }
      res.send(Team)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.members = {}

exports.members.get = function (req, res) {
  if (req.params.id) {
    Team.getTeamMembers(req.params.id).then(function (Team) {
      res.send(Team)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

/*
 * Remove a TeamMember from a Team
 */
exports.members.remove = function (req, res) {
  if (req.params.id) {
    Team.removeTeamMembers(req.params.id).then(function (members) {
      res.send(members)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.request = {}

/*
 * All invitation request for a Team
 */
exports.request.get  = function (req, res) {
  if (req.params.id) {
    Team.getRequestTeamMembers(req.params.id).then(function (members) {
      res.send(members)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}


/*
 * Request from a Person to join a Team
 * Only Admin can accept
 */
exports.request.post = function (req, res) {
  var userId,
      body,
      user;

  if (req.params.id) {
    body = req.body || null
    user = req.user || null
    userId = body.userId || req.user.id

    if (!userId)
      return res.status(500).send('missing parameters id');
        
    Team.addRequestTeamMembers(req.params.id, userId).then(function (members) {
      res.send(members)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

/*
 * Accept a request from a Person to join a Team
 * Only Admin can accept
 */
exports.request.accept = function (req, res) {
  var userId,
      body,
      user;

  if (req.params.id && req.body.userId) {
    Team.addTeamMember(req.params.id, req.body.userId).then(function (members) {
      res.send(members)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.stats = function (req, res) {
  if (req.params.id) {
    Team.getStats(req.params.id).then(function (Stats) {
      res.send(Stats)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.badges = function (req, res) {
  if (req.params.id) {
    Team.getTeam(req.params.id).then(function (Badges) {
      res.send(Badges)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.wall = function (req, res) {
  res.send('this is wall');
}

/*
 * Create a Team
 * Add an Admin to a Team
 */
exports.create = function (req, res) {
  if (req.user && req.body) {
    try {
      var team = H.bodyToObj(req, ['name', 'slogan', 'max'], ['recruit', 'hidden']);
    } catch (e) {
      res.status(500).send(arguments);
    }
    Team.createTeam(req.user, team).then(function (Team) {
      res.send(Team);
    }).catch(function (e) {
      res.status(500).send(arguments);
    })
  } else {
    res.status(500).send('User not connected');
  }
}

/*
 * Update a Team
 */
exports.update = function (req, res) {
  if (req.params.id && req.body.team && req.user) {
    try {
      var team = H.bodyToObj(req, ['name', 'slogan', 'max'], ['recruit', 'hidden']);
    } catch (e) {
      res.status(500).send(arguments);
    }
    Team.updateTeam(req.user, req.params.id, team).then(function (Team) {
      res.send(Team)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send('missing parameters id');
  }
}

exports.remove = function (req, res) {
  if (req.user && req.body) {
    try {
      var team = H.bodyToObj(req, ['teamId']);
    } catch (e) {
      res.status(500).send(arguments);
    }
    Team.removeTeam(req.user, team).then(function (confirm) {
      res.send(confirm);
    }).catch(function (e) {
      res.status(500).send(arguments);
    })
  } else {
    res.status(500).send('User not connected');
  } 
}
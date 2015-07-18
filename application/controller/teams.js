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

exports.members.post = function (req, res) {
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

exports.request.post = function (req, res) {
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

exports.create = function (req, res) {
  if (req.user && req.body) {
    try {
      var team = H.bodyToObj(req, ['name', 'slogan', 'max', 'recruit', 'hidden']);
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

exports.update = function (req, res) {
  if (req.params.id && req.body.team) {
    Team.updateTeam(req.params.id, req.body.team).then(function (Team) {
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
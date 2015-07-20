var Feed = require('../bo/feed'),
    Person = require('../bo/person'),
    Stats = require('../bo/stats'),
    Badges = require('../bo/badges'),
    console = require('console-plus');

exports.index = function (req, res) {
  if (req.params && req.params.id) {
    Person.getOne(parseInt(req.params.id)).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
  } else {
    res.status(500).send('Missing parameters id');
  }
}

exports.friends = function (req, res) {
  if (req.params && req.params.id) {
    Person.getFriends(req.params.id).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
  } else {
    res.status(500).send('Missing parameters id');
  }
}

exports.followers = function (req, res) {
  res.send('this is followers');
}

exports.badges = function (req, res) {
 if (req.params && req.params.id) {
    Badges.getBadges(req.params.id).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
 }
}

exports.wall = function (req, res) {
  if (req.params && req.params.id) {
    Feed.getFeed(req.params.id, function (err, result) {
      if (err)
        return res.status(500).send(err)
      res.send(result);
    });
  } else {
    res.status(500).send('Missing parameters id');
  }
}

exports.all = function (req, res) {
  Person.getAll().then(function (result) {
    res.send(result);
  }).catch(function (err) {
    return res.status(500).send(err)
  })
}

exports.find = function (req, res) {
  if (req.params && req.params.name && req.params.name.length > 2) {
    Person.findByName(req.params.name).then(function (result) {
      res.send(result)
    }).catch(function (e) {
      res.status(500).send(e);
    })
  } else {
    res.status(500).send({});
  }
}

exports.request = {}

exports.request.post = function (req, res) {
  if (req.params && req.body.id && req.user) {
    Person.request.post(req.user.id, req.body.id).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
  } else {
    res.status(500).send(new Error({params : req.params, msg : 'missing parameters'}));
  }
}

exports.request.get = function (req, res) {
  Person.request.get(req.user.id).spread(function () {
    res.send(arguments);
  }).catch(function (err) {
    return res.status(500).send(err)
  })
}

exports.accept = function (req, res) {
 if (req.params && req.body.id && req.user) {
    Person.accept(req.user.id, req.body.id).then(function (result) {
      res.send(result);
    }).catch(function (err) {
      return res.status(500).send(err)
    })
  } else {
    res.send(new Error({params : req.params, msg : 'missing parameters'}));
  } 
}

exports.details = function (req, res) {
  if (req.params && req.params.id) {
    var result = {};
    Person.getOne(req.params.id).then(function (User) {
      Stats.getTotalSummary(User.id).then(function (stats) {
        result.stats = stats;        
        //res.send(result);
        Feed.getFeed(User, function (err, feed) {
          if (err) {
            return res.status(500).send(err);
          }
          result.feed = feed;
          res.send(result);
        })
      }).catch(function (e){
        res.status(500).send('Unable.to.get.statistics');
      });
    }).catch(function (e){
        res.status(500).send('Unknown User');
      });
  } else {
    res.status(500).send({});
  }
}
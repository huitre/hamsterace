exports.init = function init (router) {   
  // controllers 
  var Device = require('../controller/device'),
      Me = require('../controller/me'),
      Users = require('../controller/users'),
      Rankings = require('../controller/rankings'),
      Team = require('../controller/teams'),
      Stats = require('../controller/stats'),
      Auth = require('../controller/auth'),
      Passport = require('passport'),
      // config
      Config = require('config');

  /*
   * Type definition for route parameters
   */

   router.param('email', /^[a-z0-9.-]+@[a-z0-9-]+\.[a-z]{2,4}$/);

  /*
   * Index
   */

  router.get('/', function (req, res) {
      res.render("index", { user : null});
  })

  router.get('/test', function (req, res) {
    var boperson = require('../bo/person'),
        boteam = require('../bo/team'),
        team;

    boperson.getAll().then(function (users) {
      boteam.getTeam(1).then(function (_team) {
        boteam.getRequestTeamMembers(1).then(function (_request) {
          res.render("test", { 
            user : req.user,
            users : users,
            team : _team.pop(),
            requests : _request
          });
        })
      })
    })

  })

  /*
   * Signup / Auth / Login / Logout
   */
  router.get("/login", function(req, res){ 
    res.render("login");
  });

  router.post("/login", Auth.login);

  router.post("/signin",  Auth.signIn);

  router.get("/auth/facebook", Auth.login.fb);
  router.get("/auth/facebook/callback", Auth.login.fb.ok);

  router.get('/auth/google',  Auth.login.google);

  router.get('/auth/google/callback', Auth.login.google.ok);

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  /*
   * Device route
   */

  // get requests
  router.get('/device', Device.index);
  router.get('/device/activate/:token/:email', Device.activate);
  router.get('/device/events', Device.events.get);
  if (Config.env == "Developpment")
    router.get('/device/register', Device.register);

  // post requests
  router.post('/device/events', Device.events.post);
  router.post('/device/register', Device.register);
  
  

  /*
   * Me routes
   */

  // get requests
  router.get('/me', Me.index);
  router.get('/me/feed', Me.feed);
  router.get('/me/stats', Me.stats);
  router.get('/me/stats/:type', Me.stats);
  router.get('/me/link', Me.link);
  router.get('/me/devices', Me.devices);
  router.get('/me/request', Me.request.get)
  router.get('/me/friends', Me.friends)
  
  // post request
  router.post('/me/auth', Me.auth);
  router.post('/me/feed/post', Me.post);
  router.post('/me/feed/comment/:postid', Me.comment);
  router.post('/me/request/:id', Me.request.post)
  router.post('/me/accept/:id', Me.accept)
  router.post('/me/refuse/:id', Me.refuse)
  router.post('/me/remove/:id', Me.remove)

  // put request
  router.put('/me/feed/post', Me.post);
  router.put('/me/feed/comment/:postid', Me.comment);

  //delete
  router.delete('/me/feed/comment/:id', Me.comment);

  /*
   * Rankings routes
   */ 

  // get request
  router.get('/ranking/friends', Rankings.friends);
  router.get('/ranking/friends/max', Rankings.friends.max);
  router.get('/ranking/friends/average', Rankings.friends.average);
  router.get('/ranking/friends/activity', Rankings.friends.activity);
  router.get('/ranking/distance', Rankings.distance);
  router.get('/ranking/distance/max', Rankings.distance.max);
  router.get('/ranking/distance/average', Rankings.distance.average);
  router.get('/ranking/speed', Rankings.speed);
  router.get('/ranking/activity', Rankings.activity);
  

  // post request
  router.post('/ranking', Rankings.find);

  /*
   * Stats routes
   */ 

  // get request
  router.get('/stats/:id/monthly/:type', Stats.monthly)
  router.get('/stats/:id/weekly/:type', Stats.weekly)
  router.get('/stats/:id/daily/:type', Stats.daily)
  router.get('/stats/:id/hourly/:type', Stats.hourly)
  router.get('/stats/:id/summary', Stats.summary)
  router.get('/stats/archive', Stats.archive)
  router.get('/stats/archive/monthly', Stats.archive.monthly)
  
  // post request
  router.post('/stats', Stats.find);

  /*
   * Users routes
   */

  // get requests
  router.get('/user', Users.all);
  router.get('/user/:id([0-9]+)', Users.index);
  router.get('/user/:id([0-9]+)/friends', Users.friends);
  router.get('/user/:id([0-9]+)/followers', Users.followers);
  router.get('/user/:id([0-9]+)/badges', Users.badges);
  router.get('/user/:id([0-9]+)/wall', Users.wall);
  router.get('/user/find/:name', Users.find);
  router.get('/user/request', Users.request.get)

  // post request
  router.post('/user/request', Users.request.post)
  router.post('/user/accept/:id', Users.accept)

  /*
   * Users routes
   */

  // get requests
  router.get('/team', Team.index);
  router.get('/team/:id', Team.find);
  router.get('/team/:id/members', Team.members.get);
  router.get('/team/:id/request', Team.request.get);
  router.get('/team/:id/stats', Team.stats);
  router.get('/team/:id/badges', Team.badges);
  router.get('/team/:id/wall', Team.wall);
  router.get('/team/exists/:name', Team.wall);

  // post requests
  router.post('/team', Team.create);
  router.post('/team/delete', Team.remove);
  router.post('/team/:id', Team.find);
  router.post('/team/:id/request', Team.request.post);
  router.post('/team/:id/request/accept', Team.request.accept)
  router.get('/team/:id/members/remove', Team.members.remove);;
  
};


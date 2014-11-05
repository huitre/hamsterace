exports.init = function init (router) {   
	// controllers 
  var Device = require('../controller/device'),
  		Me = require('../controller/me'),
  		Users = require('../controller/users'),
  		Rankings = require('../controller/rankings'),
  		Team = require('../controller/teams'),
  		Stats = require('../controller/stats'),
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
    res.render('index', {title: 'Hamsterace is under development !'});
  })

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
   * Users routes
   */

  // get requests
  router.get('/users/:id', Users.index);
  router.get('/users/:id/friends', Users.friends);
	router.get('/users/:id/followers', Users.followers);
	router.get('/users/:id/badges', Users.badges);
	router.get('/users/:id/wall', Users.wall);

	/*
   * Me routes
   */

  // get requests
  router.get('/me', Me.index);
  router.get('/me/feed', Me.feed);
	router.get('/me/link', Me.link);
	router.get('/me/devices', Me.devices);

	// post request
	router.post('/me/feed', Me.feed);
	router.post('/me/auth', Me.auth);

	/*
   * Rankings routes
   */	

  // post request
  router.post('/rankings', Rankings.find);

  /*
   * Stats routes
   */	

  // post request
  router.post('/stats', Stats.find);


  /*
   * Users routes
   */

  // get requests
  router.get('/user/:id', Users.index);
  router.get('/user/:id/friends', Users.friends);
	router.get('/user/:id/followers', Users.followers);
	router.get('/user/:id/badges', Users.badges);
	router.get('/user/:id/wall', Users.wall);

	/*
   * Users routes
   */

  // get requests
  router.get('/team', Team.index);
  router.get('/team/:id', Team.find);
  router.get('/team/:id/members', Team.members);
	router.get('/team/:id/stats', Team.stats);
	router.get('/team/:id/badges', Team.badges);
	router.get('/team/:id/wall', Team.wall);

};

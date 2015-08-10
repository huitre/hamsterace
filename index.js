/**
 * Module dependencies.
 */

var express = require('express'),
    app = express(),
    logger = require('morgan'),
    multi = require('multer'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    fs = require('fs'),
    https = require('https'),
    routes = require('./application/routes'),
    config = require('config'),
    session = require('express-session'),
    /*
     * ORM Sequelize
     */
    sequelize = require('./application/models'),
    /*
     * Passport for authentification
     */
    passport = require('passport'),
    FB = require('passport-facebook'),
    LocalStrategy = require('passport-local'),
    GoogleStrategy = require('passport-google'),
    passportMidlleWare = require('./application/middleware/passport')(passport, config);

var FakeDatas = require('./install/fakeData');

module.exports = app;

// Config

app.set('view engine', 'jade');
app.set('views', __dirname + '/application/views');

/* istanbul ignore next */
if (!module.parent) {
  app.use(logger('dev'));
}

app.use(methodOverride('_method'));
app.use(multi({ dest: './uploads/'}));
app.use(cookieParser());

/*
 * Raw body to check md5 content integrity
 */
app.use(function(req, res, next) {
  req.rawBody = '';
  //req.setEncoding('utf8');

  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  next();
});

app.use(function(req, res, next) {
  config.Cors.forEach(function (host) {
    if (req.headers.origin == host) {
      res.header("Access-Control-Allow-Origin", host);
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
  });
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/'));

/* passport for login/session */

app.use(session({ secret: config.Session.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  if (!req.user && 
      Config.env == 'Developpment')
    req.user = {
      id: 1,
      email: "toto@toto.com",
      password: "d9bb4a8aad7b5e737beeee4813577d1f",
      gid: null,
      fbid: null,
      createdAt: "2015-07-17T10:37:44.683Z",
      updatedAt: "2015-07-17T10:37:44.683Z",
      PersonDetail: {
        id: 1,
        type: "hamster",
        name: "Rabotin",
        firstname: "Arthur",
        gender: "male",
        age: "1970-01-15T07:56:23.104Z",
        createdAt: "2015-07-17T10:37:44.758Z",
        updatedAt: "2015-07-17T10:37:44.758Z",
        PersonId: 1
      }
    }
  next();
})

/* allow regex for captures parameters */
app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures[0];
        next();
      } else {
        next('route');
      }
    }
  }
});

routes.init(app, passport);


var startServer = function(callback) {

  if (callback)
    callback()
  
  // database setted up
  // launching server
  if (!module.parent) {
    if (config.SSL) {
      var httpsOptions = {
        key: fs.readFileSync('config/api.key'),
        cert: fs.readFileSync('config/api.crt')
      };
      https.createServer(httpsOptions, app).listen(4242, '127.0.0.1');
    }
    else
      app.listen(4242);
    console.log('Express started on port 4242');
  }

}

var reset = false;

if (reset)
  sequelize.sequelize.sync({force : true}).done(
    function () { 
      startServer(FakeDatas.populate) 
    }
  );
else
  sequelize.sequelize.sync({force : false}).done(
    function () { 
      startServer(FakeDatas.incrementStats) 
    }
  );
  // populate
  //FakeDatas.populate();
  //FakeDatas.populateDevice();
  //FakeDatas.populateStats();
  //FakeDatas.incrementStats();
  //FakeDatas.populateAvatar();

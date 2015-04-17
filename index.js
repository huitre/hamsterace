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
  /*if (!req.user && 
      req.url !== '/' &&
      req.url !== '/login')
    return res.redirect('/')*/
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

sequelize.sequelize.sync({force : false}).done(function() {

  // populate
  //FakeDatas.populate();
  //FakeDatas.populateStats();
  FakeDatas.incrementStats();

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

});

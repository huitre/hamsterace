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
    routes = require('./application/routes'),
    fs = require('fs'),
    https = require('https'),
    config = require('config');

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
app.use(function(req, res, next) {
  req.rawBody = '';
  //req.setEncoding('utf8');

  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

routes.init(app);

var httpsOptions = {
  key: fs.readFileSync('config/api.key'),
  cert: fs.readFileSync('config/api.crt')
};
 

/* istanbul ignore next */
if (!module.parent) {
  if (config.SSL)
    https.createServer(httpsOptions, app).listen(4242, '127.0.0.1');
  else
    app.listen(4242);
  console.log('Express started on port 4242');
}

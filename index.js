/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var logger = require('morgan');
var multi = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var routes = require('./application/routes');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

routes.init(app);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(80);
  console.log('Express started on port 80');
}

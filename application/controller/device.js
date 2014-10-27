var DeviceController = (function () {
  var Auth = require('../hra/bo/auth.js'),
      Events = require('../model/events.js');

  function index (req, res) {
    res.send('this is index');
  }

  function register (req, res) {
    res.send('this is auth');
  }
  
  var events = {};
  
  events.get = function (req, res) {
    
    res.send(html);
  }
  
  events.post = function (req, res) {
    var onAuth, onFail;

    onAuth = function (req) {
      if (req.body.events && req.body.events.length) {
        Events.insert(req, req.body.events);
      }
    } 
    
    onFail = function (err) {
      res.send(err);
    }

    Auth.checkSignature(req, onAuth, onFail);
  }

  return {
    "index" : index,
    "register" : register,
    "events" : events
  }
})();

if (typeof module !== 'undefined') {
  module.exports = DeviceController;
}
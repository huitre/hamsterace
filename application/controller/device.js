var DeviceController = (function () {
  var Auth = require('../hra/bo/auth.js'),
      Stats = require('../model/stats.js');

  function index (req, res) {
    res.send('this is index');
  }

  function register (req, res) {
    res.send('this is auth');
  }
  
  var stats = {};
  
  stats.get = function (req, res) {
    
    res.send(html);
  }
  
  stats.post = function (req, res) {
    var onAuth, onFail;

    onAuth = function () {
      if (req.body != "undefined" && req.body.length) {
        Stats.insert(req.body)
        res.send({success: true});
      }
      res.send()
    } 
    
    onFail = function (err) {
      res.send(err);
    }

    Auth.checkSignature(req, onAuth, onFail);
  }

  return {
    "index" : index,
    "register" : register,
    "stats" : stats
  }
})();

if (typeof module !== 'undefined') {
  module.exports = DeviceController;
}
var DeviceController = (function () {
  function index (req, res) {
    res.send('this is index');
  }

  function auth (req, res) {
    res.send('this is auth');
  }
  
  var stats = {};
  
  stats.get = function (req, res) {
    var model = require('../model/device'),
      html = '<form action="/device/stats" method="post">' +
               'apikey:' +
               '<input type="text" name="apiKey" placeholder="..." />' +
               'signature:' +
               '<input type="text" name="signature" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
    res.send(html);
  }
  
  stats.post = function (req, res) {
    var boDevice = require('../hra/bo/device.js'),
        onAuth, onFail;

    onAuth = function () {
      res.send('done');
    }
    
    onFail = function (err) {
      res.send(err);
    }

    boDevice.checkSignature(req, onAuth, onFail);
  }

  return {
    "index" : index,
    "auth" : auth,
    "stats" : stats
  }
})();

if (typeof module !== 'undefined') {
  module.exports = DeviceController;
}
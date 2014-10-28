var DeviceController = (function () {
  var Auth = require('../hra/bo/auth.js'),
      Device = require('../model/device.js')
      Events = require('../model/events.js'),
      // config
      Config = require('config');

  function index (req, res) {
    res.send('this is index');
  }

  /*
   * Endpoint used to bind a device to a user
   * This Endpoint need to be signed
   * @params private_key
   * @params api_key
   * @params serial_number
   * @params user email
   */
  function register (req, res) {
    var onAuth, onFail;
    onAuth = function (req) {
      if (req.param('privateKey') && req.param('userEmail') && req.param('apiKey')) {
        res.send(Device.register(req, res));
      }
      res.status(500).send({'message': 'missing parameters'});
    } 
    
    onFail = function (err) {
      res.status(500).send(err);
    }
    if (Config.env !== "Developpment")
      Auth.checkSignature(req, onAuth, onFail);
    else
      onAuth(req);
  }
  
  
  /*
   * Events routes
   */
  var events = {};

  events.get = function (req, res) {
    res.send({});
  }
  
  /*
   * Endpoint used to insert events in the database
   * This Endpoint need to be signed
   * @params private_key
   * @params api_key
   * @params serial_number
   * @params user email
   */
  events.post = function (req, res) {
    var onAuth, onFail;

    onAuth = function (req) {
      if (req.param('events')) {
        Events.insert(req, req.param('events'));
      }
    } 
    
    onFail = function (err) {
      res.status(500).send(err);
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
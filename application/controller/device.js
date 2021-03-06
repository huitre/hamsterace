var DeviceController = (function () {
  var Auth = require('../bo/auth.js'),
      Device = require('../bo/device.js')
      Events = require('../bo/events.js'),
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
    var onAuth, onSucces;

    onAuth = function (req) {
      if (req.param('privateKey') && req.param('userEmail') 
          && req.param('apiKey') && req.param('userKey')) {
        Device.register(req, function (err, result) {
          if (err) return onFail(res, err);
          return onSucces(res, result);
        });
      } else {
        onFail(res, {'message': 'user.missing.parameters'});
      }
    } 
    
    if (Config.env !== "Developpment")
      Auth.checkSignature(req, onAuth, onFail);
    else
      onAuth(req);
  }
  

  /*
   * Generic success call back
   * @param res express response object
   * @param success obj
   */
  function onSuccess (res, success) {
    res.status(200).send(success);
  }


  /*
   * Generic error call back
   * @param obj express response object
   * @param obj error
   */
  function onFail (res, err) {
    res.status(500).send(err);
  }

    /*
   * Endpoint used to activte a device to a user preregister with /device/register
   * This Endpoint doesn't need to be signed
   * @params authentification token
   * @params email
   */
  function activate (req, res) {
    if (req.param('token') && req.param('email')) {
      Device.activate(req, function onActivated (err) {
        if (err) return onFail(res, err);
        Device.sendActivationMail(req.param('email'), onSuccess, onFail)
      });
    }
    else
      onFail(res, {'message': 'missing.parameters'});
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
    var onAuth;

    onAuth = function (req) {
      if (req.param('events')) {
        Events.insert(req, req.param('events'));
      }
    } 
    Auth.checkSignature(req, 
      onAuth, 
      function (err) {onFail(res, err)});
  }

  return {
    "index" : index,
    "register" : register,
    "events" : events,
    "activate" : activate
  }
})();

if (typeof module !== 'undefined') {
  module.exports = DeviceController;
}
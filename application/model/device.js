var DeviceModel = (function () {
  /*
   * Requirements
   */
  var pg = require('../hra/database')(),
      bo = require('../hra/bo/device.js'),
      crypto = require('crypto'),
      Mandrill = require('mandrill-api/mandrill'),
      Utils = require('../hra/lib/utils'),
      // config
      Config = require('config'),
      self = this,

  /*
   * First we check if with can find a device with the
   * user key and public key, then we insert the user email 
   * into a temporary table to future activation
   *
   * @params req        Express request object containing :
   *  @params userKey
   *  @params apiKey
   *  @params userEmail
   * @params onSuccess  Callback when everything went as planned
   * @params onFail     Callback when everything is fucked up
   */
  register = function (req, done) {
    var uKey = req.param('userKey'),
        privateKey = req.param('privateKey'),
        apiKey = req.param('apiKey'),
        email = req.param('userEmail'),
        token = createToken(uKey, apiKey);
 
      bo.getDeviceUserKey([uKey, privateKey, apiKey], function (err, rows, result) {
        if (err) return ({'error': err, 'message': 'user.key.invalid'});
        if (rows && rows.length > 0) {
          bo.registerUserDevice([token, email], function (err, rows, result) {
            if (err) return done({'error': err, 'message': 'user.registered.fail'});
            sendRegistrationMail(token, email, done, done)
          });
        }
      });
  },

  /*
   * Return a token based on the user secret key and the device secret key
   * This token is used for activation when the user is registered
   */
  createToken = function (uKey, apiKey) {
    return crypto.createHash('md5').update(uKey).update(apiKey).update(new Date().getTime() + '').digest('hex');
  },


  /*
   * @params req        Express request object containing :
   *  @params userKey
   *  @params apiKey
   *  @params userEmail
   * @params res        Express response object
   * @params onSuccess  Callback when everything went as planned
   * @params onFail     Callback when everything is fucked up
   */
  activate = function (req, onActivated) {
    var token = req.param('token'),
        email = req.param('email');

      bo.getRegisteredUser([token, email], 
        function (err, rows, result) {
          if (err) return onActivated(new Error({'error': err, 'message': 'user.key.invalid'}));
          var when = new Date().getTime();
          bo.activateUserDevice([email, when, when], onRegisterDevice);
        }
      );

      var onRegisterDevice = function (err, rows, result) {
        if (err) return onActivated(err);
        bo.deleteOldToken([token, email], 
          function (err, rows, result) {
            if (err) return onActivated(new Error({'error': err, 'message': 'user.registered.fail'}));
            sendActivationMail(email, onActivated, onActivated);
          }
        );
      };
  },

  sendActivationMail = function (email, onSuccess, onFail) {
    var mandrill_client = new Mandrill.Mandrill(Config.Mailer.apiKey);
    var message = {
        "html": "<p>Your device is now activated !</p>",
        "text": "Example text content",
        "subject": "device.user.activation",
        "from_email": Config.Mailer.user,
        "from_name": Config.Mailer.name,
        "to": [{
                "email": email,
                "type": "to"
            }],
        "headers": {
            "Reply-To": Config.Mailer.user
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "bcc_address": null,
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": true,
        "merge_language": "mailchimp",
        "global_merge_vars": [{
                "name": "merge1",
                "content": "merge1 content"
            }],
        "tags": [
            "password-resets"
        ],
        "metadata": {
            "website": "www.hamsterace.com"
        }
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = Utils.DateUtils.toMandrillUTC(new Date());
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, 
      onSuccess, 
      onFail
    );
  },

  sendRegistrationMail = function (token, email, onSuccess, onFail) {
    var mandrill_client = new Mandrill.Mandrill(Config.Mailer.apiKey),
        link = "http://localhost:4242/device/activate/" + token + "/" + email;
        message = {
        "html": "<p>click <a href='" + link + "' target='_blank'>here</a> to activate your device</p><p>" + link + "</p>",
        "text": "Example text content",
        "subject": "device.user.activation",
        "from_email": Config.Mailer.user,
        "from_name": Config.Mailer.name,
        "to": [{
                "email": email,
                "name": null,
                "type": "to"
            }],
        "headers": {
            "Reply-To": Config.Mailer.user
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "bcc_address": null,
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": true,
        "merge_language": "mailchimp",
        "global_merge_vars": [{
                "name": "merge1",
                "content": "merge1 content"
            }],
        "tags": [
            "password-resets"
        ],
        "metadata": {
            "website": "www.hamsterace.com"
        }
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = Utils.DateUtils.toMandrillUTC(new Date());
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, 
      onSuccess, 
      onFail
    );
  }

  return {
    register : register,
    activate : activate,
    sendActivationMail : sendActivationMail,
    sendRegistrationMail: sendRegistrationMail
  }
})()

if (typeof module !== 'undefined') {
  module.exports = DeviceModel;
}
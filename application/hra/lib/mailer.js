var Mandrill = require('mandrill-api/mandrill'),
    Utils = require('../hra/lib/utils'),
    // config
    Config = require('config');

var Mailer = (function () { 

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
  
  return this;
})
var BOAuthDevice = (function () {
  // list of requirement
  var crypto = require('crypto'),
      Person = require('../../model/person');

  var makeSignature = function (privateKey, stringToSign) {
    var sha1 = crypto.createHmac('sha256', privateKey),
        hmac;

    hmac = sha1.update(stringToSign);
    return hmac.digest('hex');
  }

  var makeStringTosign = function (req) {
    var httpVerb = req.route.post ? 'POST' : 'GET',
        md5 = crypto.createHash('md5'),
        contentmd5 = md5.update(req.rawBody).digest('hex'),
        contentType = req.headers["content-type"],
        date = req.headers["date"],
        sign;
    
    return  httpVerb + "\n" +
            contentmd5 + "\n" +
            date;
  }

/*
 * This method check the signature used to authentificate the device
 * to allow it to insert data into the database
 *
 * @params apiKey string Device Serial Number
 * @params signature string Signature generated with HMAC-SHA256
 * @params onAuth function callback called when authentificated
 * @params onFail function callback called when something is wrong !
 */
  var checkSignature = function (req, onAuth, onFail) {
    if (!req.headers.authorization)
        return onFail({message: "Missing parameters API Key & signature !"})

    var pg = require('../database')(),
        apikey = req.body.apiKey, 
        signature = req.body.signature || {}

    if (req.headers.authorization) {
      var tmp = req.headers.authorization.split(':')
      apikey = tmp[0].trim().replace('HRA ', '');
      signature = tmp[1];
    }

    pg("SELECT private_key FROM DEVICE WHERE SERIAL_NUMBER = $1", [apikey], 
      function(err, rows, result) {
        err = err || {}
        if (rows && rows.length > 0) {
          var sign = makeSignature(rows[0].private_key.trim(), makeStringTosign(req))
          if (signature == sign)
            return onAuth(req)
          err.message = "Signature not valid !"
          return onFail(err);
        } 
        err.message = "API key not registered !"
        return onFail(err);
      }
    )
  }

  var signup = function (email, password, name, done) {
    Person.find({email: email}, function (err, result) {
      if (err) return done(err);
      if (result.length === 0 || !result)
        Person.insert([email, password, name], done)
    });
  }

  var isValidUserPassword = function (params, done) {
    if (params.password) {
      var hash = crypto.createHash('md5').update(params.password).digest('hex')
      Person.findForAuth([params.userEmail, hash], function (err, row, result) {
        if (err) return done(new Error(err));
        if (row.length < 0) return done(new Error({'message': 'user.not.found'}));
        return done(null,populate(row[0]));
      })
    }
    return done(new Error({'message': 'user.missing.parameters'}))
  }

  return {
    checkSignature : checkSignature,
    signup : signup,
    isValidUserPassword : isValidUserPassword
  }
})()

if (typeof module !== 'undefined') {
  module.exports = BOAuthDevice;
}
/*
 * This method check the signature used to authentificate the device
 * to allow it to insert data into the database
 * 
 * @params apiKey string Device Serial Number
 * @params signature string Signature generated with HMAC-SHA1
 * @params onAuth function callback called when authentificated
 * @params onFail function callback called when something is wrong !
 */
exports.checkSignature = function (req, onAuth, onFail) {
  if ((!req.body.signature && !req.headers.authorization) || !req.body.apiKey)
      return onFail({message: "Missing parameters API Key or signature !"})

  var pg = require('../database')(),
      apikey = req.body.apiKey, 
      signature = req.body.signature || {}

  if (req.headers.authorization)
    signature = req.headers.authorization.split('HRA:')[1];

  pg("SELECT * FROM DEVICE WHERE SERIAL_NUMBER = $1", [apikey], 
    function(err, rows, result) {
      err = err || {}
      if (rows && rows.length > 0) {
        var sign = makeSignature(apikey, rows[0].private_key, makeStringTosign(req))
        if (signature == sign)
          return onAuth()
        err.message = "Signature not valid !"
        return onFail(err);
      } 
      err.message = "API key not registered !"
      return onFail(err);
    }
  )
}

var makeSignature = function (apiKey, deviceSerialNumber, stringToSign) {
  var sha1 = require('crypto').createHash('sha1'),
      hmac,
      b;

  hmac = sha1.update(deviceSerialNumber);
  hmac = sha1.update(stringToSign);
  return encodeURI(hmac.digest('base64'));
}

var makeStringTosign = function (req) {
  var httpVerb = req.route.post ? 'POST' : 'GET',
      contentmd5 = req.headers["content-md5"],
      contentType = req.headers["content-type"],
      expires = req.headers["expires"];

  return  httpVerb + "\n" +
          contentmd5 + "\n" +
          contentType + "\n" +
          expires;
}
exports.index = function (req, res) {
  console.log(req.user);
  res.send(req.user);
}

exports.feed = function (req, res) {
	res.send('this is feed');
}

exports.link = function (req, res) {
	res.send('this is link');
}

exports.devices = function (req, res) {
	res.send('this is devices');
}

exports.auth = function (req, res) {
	res.send(req);
}
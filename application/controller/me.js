exports.index = function (req, res) {
  console.log(req);
	res.send(JSON.stringify(req.user));
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
exports.index = function (req, res) {
	res.send('this is index');
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
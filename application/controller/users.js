exports.index = function (req, res) {
	res.send('this is index');
}

exports.friends = function (req, res) {
	res.send('this is friends');
}

exports.followers = function (req, res) {
	res.send('this is followers');
}

exports.badges = function (req, res) {
	res.send('this is badges');
}

exports.wall = function (req, res) {
	res.send('this is wall');
}
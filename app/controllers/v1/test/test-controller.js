
function TestController() {
}

function post(req, res, next) {
	res.status(200).json({});
}

function get(req, res, next) {

	res.status(200).json({});
}

TestController.prototype = {
	get: get,
	post: post
};

var test = new TestController();
module.exports = test;

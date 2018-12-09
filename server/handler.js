const handler = {};

handler.notFound = (data, callback) => {
	callback(404);
};
handler.hello = (data, callback) => {
	response = {
		'Hello': 'World'
	};
	callback(200, response);
};

module.exports = handler;
const handler = require("./handler");

const routes = {
	"hello": handler.hello,
	"undefined": handler.notFound
};
module.exports = routes;
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");

const config = require("./config");

const httpServer = http.createServer((req, res) => {
	buildServer(req, res);
});

const httpsOptions = {
	'key': fs.readFileSync("./keys/key.pem"),
	'cert': fs.readFileSync("./keys/cert.pem")
};

const httpsServer = https.createServer(httpsOptions, (req, res) => {
	buildServer(req, res);
});

const buildServer = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;

	const trimmedPath = path.replace(/^\/+|\/+$/g, '');
	const query = parsedUrl.query;
	const method = req.method.toLowerCase();
	const headers = req.headers;

};

const server = {
	start : () => {
		httpServer.listen(config.httpPort, () => {
			console.log("Server started at: " + config.httpPort);
		});
		httpsServer.listen(config.httpsPort, () => {
			console.log("Server started at: " + config.httpsPort);
		})
	}
};


module.exports = server;
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require('string_decoder').StringDecoder;

const config = require("./config");
const routes = require("./routes");

const httpServer = http.createServer((req, res) => {
	buildServer(req, res);
});

const httpsOptions = {
	'key': fs.readFileSync(__dirname + "/keys/key.pem"),
	'cert': fs.readFileSync(__dirname + "/keys/cert.pem")
};

const httpsServer = https.createServer(httpsOptions, (req, res) => {
	buildServer(req, res);
});

const buildServer = (req, res) => {
	//get the requested url and parse it.
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;

	//get query parameters, request method, and headers
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');
	const query = parsedUrl.query;
	const method = req.method.toLowerCase();
	const headers = req.headers;

	//get the payload if any.
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (data) => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		//build data
		const data = {
			"path": trimmedPath,
			"query": query,
			"method": method,
			"headers": headers,
			"payload": buffer
		};
		//select handler
		const handler = routes[trimmedPath] || routes.undefined;

		const callback = (statusCode, payload) => {
			statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(JSON.stringify(payload || {}));
		};
		//call handler
		handler(data, callback);
	});


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
import http from 'http';

const PORT = 3000;

const PORTS_MAP = {
	service1: 3001,
	service2: 3002,
};

const server = http.createServer((req, res) => {
	const serviceName = req.url.split('/')[1];

	if (['service1', 'service2'].includes(serviceName)) {
		http.request(
			{
				host: `http:/${req.url}`,
				port: PORTS_MAP[serviceName],
				method: req.method,
				headers: req.headers,
			},
			(serviceResponse) => {
				res.writeHead(
					serviceResponse.statusCode,
					serviceResponse.headers,
				);
				serviceResponse.pipe(res);
			},
		);
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({ error: `Service "${serviceName}" not found` }),
		);
	}
});

server.listen(PORT, () => {
	console.log(`API Gateway is listening on port ${PORT}`);
});

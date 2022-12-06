const http = require('http')

const PORT = 3002;

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('service2');
});

server.listen(PORT, () => {
	console.log(`Service 2 is listening on port ${PORT}`);
});

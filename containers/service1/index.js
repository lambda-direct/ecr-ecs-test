const http = require('http')

const PORT = 3001;

const server = http.createServer((req, res) => {
	// console.log('Request');
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('service1');
});

server.listen(PORT, () => {
	console.log(`Service 1 is listening on port ${PORT}`);
});

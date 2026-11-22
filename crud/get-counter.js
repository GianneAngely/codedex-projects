const http = require('http');

let visitors = 0;

const server = http.createServer((request, response) => {
  // Browsers also ask for /favicon.ico, so only count the real page
  if (request.method === 'GET' && request.url === '/') {
    visitors++;
    console.log(`Visitors: ${visitors}`);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`<h1 style="font-family:monospace">👀 You are visitor #${String(visitors).padStart(6, '0')}</h1>`);
  } else {
    response.writeHead(404);
    response.end();
  }
});

server.listen(3000, () => {
  console.log('Visitor Counter running at http://localhost:3000');
});

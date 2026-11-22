const http = require('http');

let bio = 'pixel artist 🎨 | informatics student @ Bali';

// Collect the request body, then hand it to a callback
const readBody = (request, callback) => {
  let body = '';
  request.on('data', (chunk) => (body += chunk));
  request.on('end', () => callback(body));
};

const server = http.createServer((request, response) => {
  if (request.method === 'PATCH') {
    readBody(request, (extra) => {
      console.log('Original Bio:', bio);
      bio += extra;                       // PATCH: change only part of it
      console.log('Patched Bio: ', bio);
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Bio patched!\n');
    });
  } else if (request.method === 'PUT') {
    readBody(request, (newBio) => {
      console.log('Original Bio:', bio);
      bio = newBio;                       // PUT: replace the whole thing
      console.log('Replaced Bio:', bio);
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Bio replaced!\n');
    });
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Go back to your terminal!\n');
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));

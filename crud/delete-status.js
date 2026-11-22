const http = require('http');

let status = 'away msg: debugging my feelings 🖤 brb never';

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (request.method === 'GET') {
    response.end(status ? `Current status: ${status}\n` : 'No status set.\n');
  } else if (request.method === 'DELETE') {
    if (!status) {
      response.statusCode = 404;
      return response.end('Nothing to delete, status is already empty.\n');
    }
    console.log('Deleting status:', status);
    status = null;
    response.end('Status deleted! 🗑️\n');
  } else {
    response.statusCode = 404;
    response.end('Go back to your terminal!\n');
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));

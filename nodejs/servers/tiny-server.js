const http = require('http');

// Create a server object
const server = http.createServer((request, response) => {
  response.write('Hello World! This is Kyokoala\'s first Node.js server 🐨');
  response.end();
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));

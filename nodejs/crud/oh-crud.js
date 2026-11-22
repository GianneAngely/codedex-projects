const http = require('http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('CRUD map logged in the terminal!');
});

server.listen(3000, () => {
  console.log('App Name: Codédex');
  console.log('Create (POST):        write a new post in the Community feed');
  console.log('Read (GET):           view my dashboard, XP, and course progress');
  console.log('Update (PUT/PATCH):   edit my profile bio or display name');
  console.log('Delete (DELETE):      delete a comment I posted');
  server.close();   // just a demo, shut down right away
});

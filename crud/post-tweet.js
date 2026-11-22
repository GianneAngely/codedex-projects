const http = require('http');

const tweets = [];

const server = http.createServer((request, response) => {
  if (request.method === 'POST') {
    let tweet = '';

    request.on('data', (chunk) => {   // data can arrive in pieces
      tweet += chunk;
    });

    request.on('end', () => {         // all pieces received
      if (tweet.length > 280) {
        response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        return response.end(`Too long! ${tweet.length}/280 characters.\n`);
      }
      tweets.push(tweet);
      console.log(`🐦 New tweet #${tweets.length}: ${tweet}`);
      response.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(`Tweet posted! You have ${tweets.length} tweet(s).\n`);
    });
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Send a POST request with curl!\n');
  }
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});

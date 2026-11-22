const http = require('http');

// Today's story in emojis: woke up, coffee, coding on Codedex, earned badges, game dreams
const story = '🌅☕️💻🐨📚➡️🐍✅🟨✅🟢⏳... 🏅🏅🏅🏅 ➡️ 🎮👾✨ 😴';

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);   // log every incoming request
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(story);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

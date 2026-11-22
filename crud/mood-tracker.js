const http = require('http');

let mood = '';

const readBody = (request, callback) => {
  let body = '';
  request.on('data', (chunk) => (body += chunk));
  request.on('end', () => callback(body.trim()));
};

const reply = (response, statusCode, text) => {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(text + '\n');
};

const server = http.createServer((request, response) => {
  const { method } = request;

  if (method === 'GET') {                                   // Read
    reply(response, 200, mood ? `💍 Current mood: ${mood}` : 'No mood yet. POST one!');

  } else if (method === 'POST') {                           // Create
    readBody(request, (newMood) => {
      if (mood) return reply(response, 409, 'A mood already exists. Use PUT or PATCH to change it.');
      mood = newMood;
      console.log('POST  ->', mood);
      reply(response, 201, `Mood created: ${mood}`);
    });

  } else if (method === 'PATCH') {                          // Update (partial)
    readBody(request, (extra) => {
      if (!mood) return reply(response, 404, 'No mood to patch.');
      mood += ` ${extra}`;
      console.log('PATCH ->', mood);
      reply(response, 200, `Mood patched: ${mood}`);
    });

  } else if (method === 'PUT') {                            // Update (replace)
    readBody(request, (newMood) => {
      mood = newMood;
      console.log('PUT   ->', mood);
      reply(response, 200, `Mood replaced: ${mood}`);
    });

  } else if (method === 'DELETE') {                         // Delete
    if (!mood) return reply(response, 404, 'No mood to delete.');
    console.log('DELETE->', mood);
    mood = '';
    reply(response, 200, 'Mood deleted. 🗑️');

  } else {
    reply(response, 405, `Method ${method} not allowed.`);
  }
});

server.listen(3000, () => console.log('Mood feed server running at http://localhost:3000'));

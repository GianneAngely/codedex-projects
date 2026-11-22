const http = require('http');

const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// Each recovery room: Pokédex number + cry
const rooms = {
  '/pikachu': { name: 'Pikachu', id: 25, cry: 'Pika Pika!' },
  '/sylveon': { name: 'Sylveon', id: 700, cry: 'Sylv Sylv!' },
  '/snorlax': { name: 'Snorlax', id: 143, cry: 'Snooorlax... zzz' }
};

const server = http.createServer((request, response) => {
  const room = rooms[request.url];

  if (room) {
    console.log(room.cry);   // the Pokémon's cry goes to the terminal
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write(`<body style="font-family:monospace;text-align:center;background:#fff4f4">`);
    response.write(`<h1>🏥 Pokémon Center: ${room.name}'s room</h1>`);
    response.write(`<img src="${SPRITES}/${room.id}.png" width="288" style="image-rendering:pixelated">`);
    response.write(`<p>${room.name} is healing nicely. 💖</p>`);
    response.end('</body>');
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.write('This Pokémon is currently resting! 💤\n');
    response.end('Try /pikachu, /sylveon or /snorlax');
  }
});

server.listen(3000, () => console.log('🏥 Pokémon Center open at http://localhost:3000'));

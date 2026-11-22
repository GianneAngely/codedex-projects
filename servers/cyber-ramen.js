const http = require('http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  // Each write() sends one chunk of the menu
  response.write('Welcome to Neon Koala Noodles! 🐨🍜\n\n');
  response.write('==============================\n');
  response.write('       LATE NITE MENU\n');
  response.write('==============================\n\n');
  response.write('RAMEN\n');
  response.write('1. Quantum Truffle Ramen\n');
  response.write('2. Sambal Matah Overclock Ramen 🌶️\n');
  response.write('3. Pixel Miso (8-bit broth)\n\n');
  response.write('EXTRA TOPPINGS\n');
  response.write('1. Hacktivist Pork\n');
  response.write('2. Cybernetic Egg 🥚\n');
  response.write('3. Glowing Scallions\n');

  response.end('\nThank you for visiting! Come back after your next deploy.');
});

server.listen(3000, () => {
  console.log('🍜 Neon Koala Noodles is OPEN at http://localhost:3000');
});

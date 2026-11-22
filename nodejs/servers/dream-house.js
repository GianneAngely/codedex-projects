const http = require('http');

const page = (title, emoji, text) => `
  <body style="font-family: monospace; background:#1b1b3a; color:#ffe9a8; padding:24px">
    <nav style="margin-bottom:16px">
      <a style="color:#7ad7ff" href="/">🏡 outside</a> ·
      <a style="color:#7ad7ff" href="/studio">🎨 studio</a> ·
      <a style="color:#7ad7ff" href="/game-room">🎮 game room</a> ·
      <a style="color:#7ad7ff" href="/library">📚 library</a> ·
      <a style="color:#7ad7ff" href="/bedroom">🛏️ bedroom</a>
    </nav>
    <h1 style="font-size:48px">${emoji}</h1>
    <h2>${title}</h2>
    <p>${text}</p>
  </body>`;

const server = http.createServer((request, response) => {
  let statusCode = 200;
  let content = '';

  if (request.url === '/') {
    content = page('Outside', '🏡🌴', 'A cozy two-story house in Ubud, surrounded by rice fields and a koala-shaped mailbox.');
  } else if (request.url === '/studio') {
    content = page('Pixel Art Studio', '🎨🖥️', 'A big drawing tablet, a 32x32 grid on the wall, and shelves of color palettes.');
  } else if (request.url === '/game-room') {
    content = page('Game Room', '🎮👾', 'Retro consoles, an arcade cabinet, and a playtest corner for my own games.');
  } else if (request.url === '/library') {
    content = page('Library', '📚☕', 'Manga, art books, and a reading nook for Apothecary Diaries marathons.');
  } else if (request.url === '/bedroom') {
    content = page('Bedroom', '🛏️🌙', 'Fairy lights, a koala plushie army, and blackout curtains for late-night coding naps.');
  } else {
    statusCode = 404;
    content = page('404 Room Not Found', '🚪❓', 'This room has not been built yet!');
  }

  response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(content);
});

server.listen(3000, () => console.log('🏡 Dream house is ready at http://localhost:3000'));

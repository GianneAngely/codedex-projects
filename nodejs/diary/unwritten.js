const fs = require('fs');

const entry = `dear diary,
22 November 2026
weather: rainy season in Bali, cozy for coding
feeling: proud! finished three Codedex courses today
and now learning Node.js file system stuff.
`;

fs.writeFile('seventh-grade.txt', entry, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
    return;
  }
  console.log('File written successfully!\n');

  // Read it back only after the write has finished
  fs.readFile('seventh-grade.txt', 'utf8', (err, data) => {
    if (err) return console.error(err);
    console.log(data);
  });
});

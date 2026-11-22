const fs = require('fs');

// Read the diary file and print it (the callback runs once reading finishes)
fs.readFile('seventh-grade.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Could not read the diary:', err.message);
    return;
  }
  console.log(data);
});

console.log('(This line prints first, because readFile is asynchronous!)\n');

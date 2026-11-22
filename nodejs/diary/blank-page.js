const fs = require('fs');

// Bonus: show a redacted version before deleting
fs.readFile('seventh-grade.txt', 'utf8', (err, data) => {
  if (err) return console.error('Error reading file:', err.message);
  console.log(data.replace(/[A-Za-z]/g, '█'));

  // Then delete the file for good (it does NOT go to the Trash)
  fs.unlink('seventh-grade.txt', (err) => {
    if (err) return console.error('Error deleting file:', err.message);
    console.log('seventh-grade.txt has been deleted. Poof!');
  });
});

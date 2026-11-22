const path = require('path');
const os = require('os');

// Path to the Desktop, built safely for any operating system
const desktopPath = path.join(os.homedir(), 'Desktop');

// Example file names (not reading the real Desktop)
const files = ['notes.txt', 'tugas-uas.docx', 'pixel-koala.PNG', 'sprite-sheet.png', 'game-idea.md'];

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'];

// Find the first image file
const firstImage = files.find(file => imageExtensions.includes(path.extname(file)));

if (firstImage) {
  console.log('First image file found:', path.join(desktopPath, firstImage));
} else {
  console.log('No image files found!');
}

// Every extension, for comparison
files.forEach(file => console.log(file.padEnd(18), '->', path.extname(file)));

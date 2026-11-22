const fs = require('fs');
const path = require('path');
const os = require('os');

// Affirmations about this year's dreams
const affirmations = [
  'Your pixel art game WILL ship this year!',
  'Every bug you fix makes you a better developer.',
  'You finished four Codedex courses in one day. You can do anything.',
  'Your art style is uniquely yours, keep drawing.',
  'Small steps every day add up to big projects.',
  'Rest is part of the process, not a break from it.'
];

// Saved next to this script instead of the Desktop.
// To use the Desktop instead: path.join(os.homedir(), 'Desktop')
const saveFolder = __dirname;

function saveRandomAffirmation() {
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
  const newFilePath = path.join(saveFolder, 'daily-affirmations.txt');

  fs.writeFile(newFilePath, randomAffirmation, (err) => {
    if (err) {
      console.error('Error writing the affirmation to the file:', err);
    } else {
      console.log(`Hi ${os.userInfo().username}! Today's affirmation: "${randomAffirmation}"`);
      console.log('Saved to:', newFilePath);
    }
  });
}

saveRandomAffirmation();

const os = require('os');

const uptimeInSeconds = os.uptime();

// 7 days in seconds
const SECONDS_IN_A_WEEK = 60 * 60 * 24 * 7;

// Convert uptime to hours, minutes, and seconds
const hours = Math.floor(uptimeInSeconds / 3600);
const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
const seconds = Math.floor(uptimeInSeconds % 60);

const osType = os.type() === 'Darwin' ? 'macOS' : os.type();
console.log(`Operating System: ${osType} (${os.platform()})`);
console.log(`Memory: ${(os.freemem() / 1e9).toFixed(2)} GB free of ${(os.totalmem() / 1e9).toFixed(2)} GB`);
console.log(`Awake for ${hours}h ${minutes}m ${seconds}s`);

if (uptimeInSeconds < SECONDS_IN_A_WEEK) {
  console.log('Feeling fresh! Less than a week since my last nap. 😊');
} else {
  console.log('Zzz... it has been over a week. Please restart me soon! 😴');
}

// Frog Star Hop: collect all 5 stars, dodge the wizards, press R to play again

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 700 }, debug: false },
  },
  scene: { preload, create, update },
};

let player, cursors, stars, enemies, platforms;
let score = 0;
let starsCollected = 0;
let totalStars;
let gameOver = false;
let gameWon = false;
let scoreText, messageText;
let bgMusic, coinSound, jumpSound, loseSound, winSound;
const playerStart = { x: 80, y: 480 };

// builds a tiny 8-bit WAV in code and returns it as a data URL (no audio files needed)
function makeChiptune(notes, noteLength, volume) {
  const rate = 22050;
  const perNote = Math.floor(rate * noteLength);
  const total = perNote * notes.length;
  const bytes = new Uint8Array(44 + total);
  const view = new DataView(bytes.buffer);
  const text = (offset, s) => [...s].forEach((c, i) => bytes[offset + i] = c.charCodeAt(0));

  text(0, "RIFF"); view.setUint32(4, 36 + total, true); text(8, "WAVE");
  text(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate, true);
  view.setUint16(32, 1, true); view.setUint16(34, 8, true);
  text(36, "data"); view.setUint32(40, total, true);

  notes.forEach((freq, n) => {
    for (let i = 0; i < perNote; i++) {
      const t = i / rate;
      const fade = 1 - i / perNote;
      const square = freq ? (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) : 0;
      bytes[44 + n * perNote + i] = 128 + Math.round(square * fade * volume * 127);
    }
  });

  let binary = "";
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return "data:audio/wav;base64," + btoa(binary);
}

function preload() {
  this.load.image("bg", "https://i.imgur.com/Sjz9xBy.png");
  this.load.image("frog", "https://i.imgur.com/NSsqbju.png");
  this.load.image("greenPlatform", "https://i.imgur.com/uEJoszN.png");
  this.load.image("yellowPlatform", "https://i.imgur.com/uhAy5nF.png");
  this.load.image("bluePlatform", "https://i.imgur.com/oSHt5fT.png");
  this.load.image("pinkPlatform", "https://i.imgur.com/TUKptDb.png");
  this.load.image("star", "https://i.imgur.com/I40gewR.png");
  this.load.image("enemy", "https://i.imgur.com/sdFz5Xp.png");

  const melody = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 784, 659, 587, 0];
  this.load.audio("bgMusic", makeChiptune(melody, 0.22, 0.2));
  this.load.audio("coinSound", makeChiptune([988, 1319], 0.08, 0.5));
  this.load.audio("jumpSound", makeChiptune([330, 440, 554], 0.05, 0.4));
  this.load.audio("loseSound", makeChiptune([392, 330, 262, 196], 0.18, 0.5));
  this.load.audio("winSound", makeChiptune([523, 659, 784, 1047, 1047], 0.15, 0.5));
}

function create() {
  this.add.image(400, 300, "bg").setScale(1.3);

  // ground drawn with code: a navy strip with a yellow top edge
  const g = this.add.graphics();
  g.fillStyle(0x1b2a4a).fillRect(0, 0, 800, 40);
  g.fillStyle(0xffd23f).fillRect(0, 0, 800, 6);
  g.generateTexture("ground", 800, 40);
  g.destroy();

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 580, "ground");
  const layout = [
    [200, 470, "greenPlatform"],
    [420, 380, "yellowPlatform"],
    [650, 300, "bluePlatform"],
    [380, 210, "pinkPlatform"],
    [130, 290, "greenPlatform"],
  ];
  layout.forEach(([x, y, key]) => platforms.create(x, y, key).setScale(3).refreshBody());

  // one star floating above each platform
  stars = this.physics.add.group({ allowGravity: false });
  layout.forEach(([x, y]) => {
    const star = stars.create(x, y - 45, "star").setScale(2);
    star.body.setAllowGravity(false);
  });
  totalStars = stars.getChildren().length;

  // two wizards patrolling: one along the ground, one up and down on the right
  enemies = this.physics.add.group({ allowGravity: false, immovable: true });
  const walker = enemies.create(500, 510, "enemy").setScale(0.6);
  const floater = enemies.create(740, 200, "enemy").setScale(0.6);
  enemies.getChildren().forEach((e) => {
    e.body.setAllowGravity(false);
    e.setImmovable(true);
    e.setCollideWorldBounds(true);
  });
  walker.setBounce(1, 0).setVelocityX(120);
  floater.setBounce(0, 1).setVelocityY(110);
  walker.start = { x: 500, y: 510, vx: 120, vy: 0 };
  floater.start = { x: 740, y: 200, vx: 0, vy: 110 };

  player = this.physics.add.sprite(playerStart.x, playerStart.y, "frog").setScale(3);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.collider(player, enemies, hitEnemy, null, this);

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "28px", fill: "#fff", stroke: "#1b2a4a", strokeThickness: 5,
  });
  messageText = this.add.text(400, 280, "", {
    fontSize: "40px", fill: "#ffd23f", stroke: "#1b2a4a", strokeThickness: 7, align: "center",
  }).setOrigin(0.5).setVisible(false);

  bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.35 });
  coinSound = this.sound.add("coinSound", { volume: 0.7 });
  jumpSound = this.sound.add("jumpSound", { volume: 0.6 });
  loseSound = this.sound.add("loseSound", { volume: 0.7 });
  winSound = this.sound.add("winSound", { volume: 0.7 });
  bgMusic.play();

  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on("keydown-R", restartGame, this);
}

function collectStar(player, star) {
  if (gameOver || gameWon) return;
  star.disableBody(true, true);
  starsCollected += 1;
  score += 10;
  scoreText.setText("Score: " + score);
  coinSound.play();

  if (starsCollected === totalStars) {
    gameWon = true;
    endGame(this, "You win!\nScore: " + score + "\nPress R to play again", 0x7fff7f, winSound);
  }
}

function hitEnemy() {
  if (gameOver || gameWon) return;
  gameOver = true;   // one touch from a wizard ends the game
  endGame(this, "Game Over\nScore: " + score + "\nPress R to try again", 0xff5555, loseSound);
}

function endGame(scene, message, tint, sound) {
  scene.physics.pause();
  player.setTint(tint);
  bgMusic.stop();
  sound.play();
  messageText.setText(message).setVisible(true);
}

function restartGame() {
  score = 0;
  starsCollected = 0;
  gameOver = false;
  gameWon = false;

  player.clearTint();
  player.setPosition(playerStart.x, playerStart.y);
  player.setVelocity(0, 0);

  stars.children.iterate((star) => star.enableBody(true, star.x, star.y, true, true));
  enemies.children.iterate((e) => {
    e.setPosition(e.start.x, e.start.y);
    e.setVelocity(e.start.vx, e.start.vy);
  });

  scoreText.setText("Score: 0");
  messageText.setVisible(false);
  this.physics.resume();
  if (!bgMusic.isPlaying) bgMusic.play();
}

function update() {
  if (gameOver || gameWon) return;

  if (cursors.left.isDown) {
    player.setVelocityX(-200);
    player.setFlipX(true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
    player.setFlipX(false);
  } else {
    player.setVelocityX(0);
  }

  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.setVelocityY(-450);
    jumpSound.play();
  }
}

new Phaser.Game(config);

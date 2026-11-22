const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1b2a4a",
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const game = new Phaser.Game(config);

// Angel's Happy Place: a sunny meadow where two pets collect treasures
let player;       // Hippocorn, arrow keys
let buddy;        // Dino, W A S D
let cursors;
let wasd;
let background;
let clickCount = 0;

const treasures = ["coin", "gem", "star"];
// sky moods: normal day, golden hour, cozy night (tints applied to the background)
const skyTints = [0xffffff, 0xffd27f, 0x6f7fb8];

function preload() {
  this.load.image("meadow", "https://i.imgur.com/H5lgW9a.png");
  this.load.image("hippocorn", "https://i.imgur.com/wMj8P7M.gif");
  this.load.image("dino", "https://i.imgur.com/TTQA8lp.gif");
  this.load.image("coin", "https://i.imgur.com/4ZZz70O.gif");
  this.load.image("gem", "https://i.imgur.com/8SJRGJr.gif");
  this.load.image("star", "https://i.imgur.com/z5E7KFm.gif");
}

function create() {
  background = this.add.image(400, 300, "meadow").setDisplaySize(800, 600);

  player = this.add.image(300, 450, "hippocorn").setScale(0.3);
  buddy = this.add.image(500, 450, "dino").setScale(0.3);

  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D"); // second set of controls

  this.input.on(
    "pointerdown",
    function (pointer) {
      // a different treasure each click: coin, gem, star, coin, ...
      const key = treasures[clickCount % treasures.length];
      const size = key === "star" ? 0.12 : 1.5; // the star gif is much bigger
      this.add.image(pointer.x, pointer.y, key).setScale(size);

      // every click also changes the mood of the sky
      background.setTint(skyTints[clickCount % skyTints.length]);
      clickCount++;
    },
    this
  );
}

function move(character, left, right, up, down, speed) {
  if (left.isDown) {
    character.x -= speed;
  } else if (right.isDown) {
    character.x += speed;
  }
  if (up.isDown) {
    character.y -= speed;
  } else if (down.isDown) {
    character.y += speed;
  }
}

function update() {
  move(player, cursors.left, cursors.right, cursors.up, cursors.down, 4);
  move(buddy, wasd.A, wasd.D, wasd.W, wasd.S, 3);
}

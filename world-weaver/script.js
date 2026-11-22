const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#002fa7",
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const game = new Phaser.Game(config);

// Fox Girl's meadow: walk with arrows, hold Shift to run, press Space to cast a sparkle spell
let scene;
let foxGirl;
let cursors;
let shiftKey;
let currentState;
let castEndsAt = 0;
let castRequested = false;
let facing = "down";
const speed = 3;
const runSpeed = speed * 2;

function heldDirection() {
  if (cursors.left.isDown) return "left";
  if (cursors.right.isDown) return "right";
  if (cursors.down.isDown) return "down";
  if (cursors.up.isDown) return "up";
  return null;
}

function step(direction, amount) {
  if (direction === "left") foxGirl.x -= amount;
  if (direction === "right") foxGirl.x += amount;
  if (direction === "down") foxGirl.y += amount;
  if (direction === "up") foxGirl.y -= amount;
  facing = direction;
}

function wantsToCast() {
  // the keydown-SPACE event sets the flag; we use it once and reset it
  const wants = castRequested;
  castRequested = false;
  return wants;
}

function walkState(direction) {
  return {
    onEnter() {
      foxGirl.anims.play("walk-" + direction, true);
    },
    onUpdate() {
      if (wantsToCast()) return "cast-spell";
      if (!cursors[direction].isDown) return "idle";
      if (shiftKey.isDown) return "run";
      step(direction, speed);
      return "walk-" + direction;
    },
    onExit() {}
  };
}

const states = {
  idle: {
    onEnter() {
      foxGirl.anims.stop();
    },
    onUpdate() {
      if (wantsToCast()) return "cast-spell";
      const direction = heldDirection();
      if (!direction) return "idle";
      return shiftKey.isDown ? "run" : "walk-" + direction;
    },
    onExit() {}
  },
  "walk-left": walkState("left"),
  "walk-right": walkState("right"),
  "walk-down": walkState("down"),
  "walk-up": walkState("up"),
  run: {
    onEnter() {
      foxGirl.anims.timeScale = 2;
    },
    onUpdate() {
      if (wantsToCast()) return "cast-spell";
      const direction = heldDirection();
      if (!direction) return "idle";
      if (!shiftKey.isDown) return "walk-" + direction;
      foxGirl.anims.play("walk-" + direction, true);
      step(direction, runSpeed);
      return "run";
    },
    onExit() {
      foxGirl.anims.timeScale = 1;
    }
  },
  "cast-spell": {
    onEnter() {
      foxGirl.anims.play("spin", true);       // spins through all four directions
      castEndsAt = scene.time.now + 800;      // the spell lasts 0.8 seconds
      sparkle();
    },
    onUpdate() {
      // she can't move while casting; return to idle when the spell is over
      return scene.time.now >= castEndsAt ? "idle" : "cast-spell";
    },
    onExit() {
      foxGirl.anims.play("walk-" + facing, true);
      foxGirl.anims.stop();
    }
  }
};

// bonus: a ring of stars bursts out above her head and fades away
function sparkle() {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const star = scene.add.image(foxGirl.x, foxGirl.y - 40, "star").setScale(0.06);
    scene.tweens.add({
      targets: star,
      x: foxGirl.x + Math.cos(angle) * 70,
      y: foxGirl.y - 40 + Math.sin(angle) * 70,
      alpha: 0,
      angle: 180,
      duration: 800,
      onComplete: () => star.destroy()   // clean up so stars don't pile up
    });
  }
}

function preload() {
  this.load.image("meadow", "https://i.imgur.com/H5lgW9a.png");
  this.load.image("star", "https://i.imgur.com/z5E7KFm.gif");
  this.load.spritesheet("foxGirl", "https://i.imgur.com/7CU9Ky9.png", {
    frameWidth: 120,
    frameHeight: 120,
  });
}

function create() {
  scene = this;
  this.add.image(400, 300, "meadow").setDisplaySize(800, 600);
  foxGirl = this.add.sprite(400, 450, "foxGirl");

  cursors = this.input.keyboard.createCursorKeys();
  shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  // an event never misses a quick tap, even if the key is released within the same frame
  this.input.keyboard.on("keydown-SPACE", () => { castRequested = true; });

  const rows = { down: 0, up: 6, right: 12, left: 18 };
  for (const direction in rows) {
    this.anims.create({
      key: "walk-" + direction,
      frames: this.anims.generateFrameNumbers("foxGirl", { start: rows[direction], end: rows[direction] + 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // spell animation: first frame of each direction, played fast = a spin
  this.anims.create({
    key: "spin",
    frames: this.anims.generateFrameNumbers("foxGirl", { frames: [0, 12, 6, 18] }),
    frameRate: 12,
    repeat: -1,
  });

  currentState = "idle";
  states[currentState].onEnter();
}

function update() {
  const nextState = states[currentState].onUpdate();

  if (nextState !== currentState) {
    states[currentState].onExit();
    states[nextState].onEnter();
    currentState = nextState;
  }
}

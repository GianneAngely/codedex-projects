// Frog Star Hop: collect every star in 3 levels, dodge the wizards.
// Arrow keys / WASD to move, Up / W / Space to jump, P to pause. Touch buttons on phones.

const W = 800;
const H = 600;
const BEST_KEY = "frogStarHopBest";

// ---------------------------------------------------------------- helpers

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

// best score lives in localStorage; private windows may block it, so never crash on it
function loadBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
}
function saveBest(score) {
  try { localStorage.setItem(BEST_KEY, String(score)); } catch (e) { /* ignore */ }
}

const TEXT = { fontFamily: "monospace", fontStyle: "bold", stroke: "#1b2a4a", strokeThickness: 6 };

// ---------------------------------------------------------------- levels
// p = platforms [x, y, texture, moveX?] (moveX = how far it slides left and right)
// e = wizards [x, y, vx, vy]
const LEVELS = [
  {
    p: [[200, 470, "greenPlatform"], [420, 380, "yellowPlatform"], [650, 300, "bluePlatform"],
        [380, 210, "pinkPlatform"], [130, 290, "greenPlatform"]],
    e: [[500, 510, 120, 0]],
  },
  {
    p: [[160, 460, "bluePlatform"], [400, 400, "yellowPlatform", 90], [660, 330, "greenPlatform"],
        [430, 230, "pinkPlatform"], [150, 250, "yellowPlatform"]],
    e: [[520, 510, 150, 0], [740, 200, 0, 120]],
  },
  {
    p: [[140, 470, "pinkPlatform"], [360, 390, "greenPlatform", 110], [640, 420, "bluePlatform"],
        [620, 300, "yellowPlatform", 100], [220, 270, "bluePlatform"]],
    e: [[450, 510, 190, 0], [760, 160, 0, 150], [40, 160, 0, 130]],
  },
];

// ---------------------------------------------------------------- boot: load everything once
class Boot extends Phaser.Scene {
  constructor() { super("Boot"); }

  preload() {
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
    this.load.audio("hurtSound", makeChiptune([300, 200], 0.1, 0.5));
    this.load.audio("loseSound", makeChiptune([392, 330, 262, 196], 0.18, 0.5));
    this.load.audio("winSound", makeChiptune([523, 659, 784, 1047, 1047], 0.15, 0.5));

    const bar = this.add.rectangle(W / 2 - 150, H / 2, 0, 12, 0xffd23f).setOrigin(0, 0.5);
    this.load.on("progress", (v) => bar.width = 300 * v);
  }

  create() {
    // small textures drawn with code: ground, sparkle, dust, heart, touch button
    const g = this.add.graphics();
    g.fillStyle(0x1b2a4a).fillRect(0, 0, W, 40);
    g.fillStyle(0xffd23f).fillRect(0, 0, W, 6);
    g.generateTexture("ground", W, 40);
    g.clear().fillStyle(0xffffff).fillCircle(4, 4, 4);
    g.generateTexture("spark", 8, 8);
    g.clear().fillStyle(0xf3ecd8).fillCircle(3, 3, 3);
    g.generateTexture("dust", 6, 6);
    g.clear().fillStyle(0xff5d8f);
    g.fillCircle(6, 6, 6).fillCircle(16, 6, 6).fillTriangle(0, 8, 22, 8, 11, 20);
    g.generateTexture("heart", 22, 21);
    g.clear().fillStyle(0x1b2a4a, 0.45).fillCircle(40, 40, 40).lineStyle(3, 0xffd23f, 0.8).strokeCircle(40, 40, 38);
    g.generateTexture("touchBtn", 80, 80);
    g.destroy();

    this.scene.start("Title");
  }
}

// ---------------------------------------------------------------- title screen
class Title extends Phaser.Scene {
  constructor() { super("Title"); }

  create() {
    this.add.image(W / 2, H / 2, "bg").setScale(1.3);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a1930, 0.35);

    this.add.text(W / 2, 150, "FROG STAR HOP", { ...TEXT, fontSize: "64px", color: "#ffd23f", strokeThickness: 10 })
      .setOrigin(0.5);
    this.add.text(W / 2, 215, "collect every star, dodge the wizards", { ...TEXT, fontSize: "20px", color: "#ffffff" })
      .setOrigin(0.5);

    const frog = this.add.image(W / 2, 330, "frog").setScale(5);
    this.tweens.add({ targets: frog, y: 290, scaleY: 5.6, scaleX: 4.6, duration: 380, yoyo: true, repeat: -1, ease: "Sine.easeOut" });
    [-150, 150].forEach((dx, i) => {
      const s = this.add.image(W / 2 + dx, 320, "star").setScale(2.5);
      this.tweens.add({ targets: s, angle: 360, duration: 3000 + i * 600, repeat: -1 });
      this.tweens.add({ targets: s, y: 300, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });

    const touch = this.sys.game.device.input.touch;
    const start = this.add.text(W / 2, 440, touch ? "TAP TO START" : "PRESS SPACE TO START",
      { ...TEXT, fontSize: "30px", color: "#ffffff" }).setOrigin(0.5);
    this.tweens.add({ targets: start, alpha: 0.25, duration: 600, yoyo: true, repeat: -1 });

    this.add.text(W / 2, 500, "BEST: " + loadBest(), { ...TEXT, fontSize: "22px", color: "#ffd23f" }).setOrigin(0.5);
    this.add.text(W / 2, 560, touch ? "" : "arrows/WASD move  -  up/W/space jump  -  P pause",
      { ...TEXT, fontSize: "16px", color: "#ffffff", strokeThickness: 4 }).setOrigin(0.5);

    const go = () => this.scene.start("Game", { level: 0, score: 0, lives: 3 });
    this.input.keyboard.once("keydown-SPACE", go);
    this.input.keyboard.once("keydown-ENTER", go);
    this.input.once("pointerdown", go);
  }
}

// ---------------------------------------------------------------- the game
class Game extends Phaser.Scene {
  constructor() { super("Game"); }

  init(data) {
    this.level = data.level;
    this.score = data.score;
    this.lives = data.lives;
    this.ended = false;
    this.nextLevelPending = false;
    this.invincibleUntil = 0;
    this.wasOnGround = true;
    this.touchState = { left: false, right: false, jump: false };
  }

  create() {
    const L = LEVELS[this.level];
    this.add.image(W / 2, H / 2, "bg").setScale(1.3);

    this.sfx = {};
    ["coinSound", "jumpSound", "hurtSound", "loseSound", "winSound"].forEach((k) => this.sfx[k] = this.sound.add(k, { volume: 0.6 }));
    this.music = this.sound.get("bgMusic") || this.sound.add("bgMusic", { loop: true, volume: 0.3 });
    if (!this.music.isPlaying) this.music.play();

    // static ground + static platforms, moving ones are immovable bodies that slide
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(W / 2, 580, "ground");
    this.movers = this.physics.add.group({ allowGravity: false, immovable: true });
    L.p.forEach(([x, y, key, moveX]) => {
      if (moveX) {
        const m = this.movers.create(x, y, key).setScale(3);
        m.body.setAllowGravity(false).setImmovable(true);
        m.home = x; m.range = moveX;
        m.setVelocityX(60 + this.level * 20);
      } else {
        this.platforms.create(x, y, key).setScale(3).refreshBody();
      }
    });

    // one star above each platform, bobbing so it feels alive
    this.stars = this.physics.add.group({ allowGravity: false });
    L.p.forEach(([x, y, , moveX], i) => {
      const s = this.stars.create(x, y - 45, "star").setScale(2);
      s.body.setAllowGravity(false);
      s.rider = moveX ? this.movers.getChildren().find((m) => m.home === x) : null;
      this.tweens.add({ targets: s, scale: 2.4, duration: 500 + i * 70, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });
    this.totalStars = this.stars.getLength();
    this.collected = 0;

    this.enemies = this.physics.add.group({ allowGravity: false, immovable: true });
    L.e.forEach(([x, y, vx, vy]) => {
      const e = this.enemies.create(x, y, "enemy").setScale(0.6);
      e.body.setAllowGravity(false);
      e.setImmovable(true).setCollideWorldBounds(true).setBounce(1, 1).setVelocity(vx, vy);
      this.tweens.add({ targets: e, angle: { from: -6, to: 6 }, duration: 300, yoyo: true, repeat: -1 });
    });

    this.player = this.physics.add.sprite(80, 480, "frog").setScale(3).setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movers);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

    this.sparks = this.add.particles(0, 0, "spark", {
      speed: { min: 80, max: 260 }, lifespan: 500, scale: { start: 1.2, end: 0 },
      tint: [0xffd23f, 0xffffff, 0xff9ecb], emitting: false,
    });
    this.dust = this.add.particles(0, 0, "dust", {
      speed: { min: 30, max: 90 }, angle: { min: 180, max: 360 }, lifespan: 350,
      scale: { start: 1.4, end: 0 }, alpha: { start: 0.8, end: 0 }, emitting: false,
    });

    // HUD
    this.scoreText = this.add.text(16, 14, "", { ...TEXT, fontSize: "26px", color: "#ffffff" });
    this.add.text(W / 2, 14, "LEVEL " + (this.level + 1) + "/" + LEVELS.length, { ...TEXT, fontSize: "22px", color: "#ffd23f" }).setOrigin(0.5, 0);
    this.hearts = [0, 1, 2].map((i) => this.add.image(W - 30 - i * 30, 28, "heart"));
    this.starText = this.add.text(W - 16, 48, "", { ...TEXT, fontSize: "18px", color: "#ffffff", strokeThickness: 4 }).setOrigin(1, 0);
    this.refreshHud();
    this.levelStart = this.time.now;

    const banner = this.add.text(W / 2, H / 2 - 40, "LEVEL " + (this.level + 1), { ...TEXT, fontSize: "56px", color: "#ffd23f", strokeThickness: 9 })
      .setOrigin(0.5).setScale(0.3);
    this.tweens.add({ targets: banner, scale: 1, duration: 350, ease: "Back.easeOut" });
    this.tweens.add({ targets: banner, alpha: 0, delay: 900, duration: 400, onComplete: () => banner.destroy() });

    this.msg = this.add.text(W / 2, H / 2 - 30, "", { ...TEXT, fontSize: "36px", color: "#ffd23f", strokeThickness: 7, align: "center", backgroundColor: "rgba(10,25,48,0.78)", padding: { x: 28, y: 18 } })
      .setOrigin(0.5).setDepth(10).setVisible(false);

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,SPACE,A,D,W,P,R");
    this.input.keyboard.on("keydown-P", this.togglePause, this);
    this.input.keyboard.on("keydown-R", () => { if (this.ended) this.restart(); });
    this.input.keyboard.on("keydown-SPACE", () => { if (this.ended) this.restart(); });

    if (this.sys.game.device.input.touch) this.addTouchControls();
  }

  addTouchControls() {
    this.input.addPointer(2);
    const make = (x, label, key) => {
      const b = this.add.image(x, H - 70, "touchBtn").setInteractive().setDepth(20).setAlpha(0.8);
      this.add.text(x, H - 70, label, { ...TEXT, fontSize: "30px", color: "#ffd23f" }).setOrigin(0.5).setDepth(21);
      b.on("pointerdown", () => { this.touchState[key] = true; if (this.ended) this.restart(); });
      b.on("pointerup", () => this.touchState[key] = false);
      b.on("pointerout", () => this.touchState[key] = false);
    };
    make(70, "<", "left");
    make(170, ">", "right");
    make(W - 80, "^", "jump");
  }

  refreshHud() {
    this.scoreText.setText("SCORE " + this.score);
    this.hearts.forEach((h, i) => h.setAlpha(i < this.lives ? 1 : 0.2));
    this.starText.setText("STARS " + this.collected + "/" + this.totalStars);
  }

  popText(x, y, label, color) {
    const t = this.add.text(x, y, label, { ...TEXT, fontSize: "22px", color, strokeThickness: 5 }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }

  collectStar(player, star) {
    if (this.ended) return;
    star.disableBody(true, true);
    this.collected += 1;
    this.score += 10;
    this.sparks.explode(18, star.x, star.y);
    this.popText(star.x, star.y - 10, "+10", "#ffd23f");
    this.sfx.coinSound.play();
    this.refreshHud();
    if (this.collected === this.totalStars) this.clearLevel();
  }

  hitEnemy(player, enemy) {
    if (this.ended || this.time.now < this.invincibleUntil) return;
    this.lives -= 1;
    this.refreshHud();
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(120, 255, 80, 80);

    if (this.lives <= 0) {
      this.endGame("GAME OVER", this.sfx.loseSound, 0xff5555);
      return;
    }
    // knock back, blink and a short grace period so one touch never costs two hearts
    this.sfx.hurtSound.play();
    this.invincibleUntil = this.time.now + 1500;
    player.setVelocity(player.x < enemy.x ? -260 : 260, -300);
    this.tweens.add({ targets: player, alpha: 0.2, duration: 100, yoyo: true, repeat: 6, onComplete: () => player.setAlpha(1) });
  }

  clearLevel() {
    const seconds = Math.floor((this.time.now - this.levelStart) / 1000);
    const bonus = Math.max(0, 40 - seconds) * 2;
    this.score += bonus;
    this.refreshHud();

    if (this.level === LEVELS.length - 1) {
      this.endGame("YOU WIN!", this.sfx.winSound, 0x7fff7f, "time bonus +" + bonus);
      return;
    }
    this.ended = true;
    this.physics.pause();
    this.sfx.winSound.play();
    this.sparks.explode(40, this.player.x, this.player.y);
    this.msg.setText("LEVEL CLEAR!\ntime bonus +" + bonus).setVisible(true);
    this.time.delayedCall(1800, () => this.scene.restart({ level: this.level + 1, score: this.score, lives: this.lives }));
    this.nextLevelPending = true;
  }

  endGame(title, sound, tint, extra) {
    this.ended = true;
    this.physics.pause();
    this.player.setTint(tint);
    this.music.stop();
    sound.play();

    const best = loadBest();
    const isBest = this.score > best;
    if (isBest) saveBest(this.score);
    const again = this.sys.game.device.input.touch ? "tap a button to play again" : "press R to play again";
    this.msg.setText([title, extra || "", "score " + this.score, isBest ? "NEW BEST!" : "best " + best, again].filter(Boolean).join("\n"))
      .setVisible(true).setScale(0.5);
    this.tweens.add({ targets: this.msg, scale: 1, duration: 300, ease: "Back.easeOut" });
  }

  restart() {
    if (this.nextLevelPending) return; // already moving to the next level
    this.scene.restart({ level: 0, score: 0, lives: 3 });
  }

  togglePause() {
    if (this.ended) return;
    if (this.physics.world.isPaused) {
      this.physics.resume();
      this.msg.setVisible(false);
    } else {
      this.physics.pause();
      this.msg.setText("PAUSED\npress P").setVisible(true).setScale(1);
    }
  }

  update() {
    // sliding platforms turn around at the edge of their range, stars ride along
    this.movers.getChildren().forEach((m) => {
      if (m.x > m.home + m.range) m.setVelocityX(-Math.abs(m.body.velocity.x));
      if (m.x < m.home - m.range) m.setVelocityX(Math.abs(m.body.velocity.x));
    });
    this.stars.getChildren().forEach((s) => { if (s.rider && s.active) s.x = s.rider.x; });

    if (this.ended || this.physics.world.isPaused) return;
    const k = this.keys;
    const p = this.player;
    const left = k.LEFT.isDown || k.A.isDown || this.touchState.left;
    const right = k.RIGHT.isDown || k.D.isDown || this.touchState.right;
    const jump = k.UP.isDown || k.W.isDown || k.SPACE.isDown || this.touchState.jump;
    const onGround = p.body.blocked.down || p.body.touching.down;

    if (this.time.now > this.invincibleUntil - 1200) {
      if (left) { p.setVelocityX(-220); p.setFlipX(true); }
      else if (right) { p.setVelocityX(220); p.setFlipX(false); }
      else p.setVelocityX(0);
    }

    if (jump && onGround) {
      p.setVelocityY(-480);
      this.sfx.jumpSound.play();
      this.tweens.add({ targets: p, scaleX: 2.4, scaleY: 3.6, duration: 90, yoyo: true });
    }

    // landing: squash + a puff of dust
    if (onGround && !this.wasOnGround) {
      this.dust.explode(8, p.x, p.y + p.displayHeight / 2);
      this.tweens.add({ targets: p, scaleX: 3.6, scaleY: 2.4, duration: 70, yoyo: true });
    }
    this.wasOnGround = onGround;
  }
}

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: "#0a1930",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: "arcade", arcade: { gravity: { y: 800 }, debug: false } },
  scene: [Boot, Title, Game],
});

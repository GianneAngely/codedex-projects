// Spell Garden (from the "World Weaver" exercise): shadow wisps drift toward Fox Girl.
// Walk with arrows/WASD, hold Shift to run, Space to cast a sparkle spell that clears nearby wisps.
// Fox Girl is still driven by a state machine (idle, walk, run, cast-spell, hurt).
// On a phone: tap to walk there, tap the star button to cast.

const W = 800;
const H = 600;
const BEST_KEY = "spellGardenBest";
const SPELL_RADIUS = 130;
const SPELL_COOLDOWN = 1100;
const TEXT = { fontFamily: "monospace", fontStyle: "bold", stroke: "#1b2a4a", strokeThickness: 6 };

function loadBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
}
function saveBest(score) {
  try { localStorage.setItem(BEST_KEY, String(score)); } catch (e) { /* ignore */ }
}

class Boot extends Phaser.Scene {
  constructor() { super("Boot"); }

  preload() {
    this.load.image("meadow", "https://i.imgur.com/H5lgW9a.png");
    this.load.image("star", "https://i.imgur.com/z5E7KFm.gif");
    this.load.spritesheet("foxGirl", "https://i.imgur.com/7CU9Ky9.png", { frameWidth: 120, frameHeight: 120 });
  }

  create() {
    // wisp: a soft purple glow drawn with code, plus a spark, a heart and a touch button
    const g = this.add.graphics();
    [[22, 0.15], [16, 0.3], [11, 0.6], [6, 1]].forEach(([r, a]) => g.fillStyle(0x6b3fa0, a).fillCircle(24, 24, r));
    g.fillStyle(0xffffff, 0.9).fillCircle(19, 21, 2.5).fillCircle(29, 21, 2.5);
    g.generateTexture("wisp", 48, 48);
    g.clear().fillStyle(0xffffff).fillCircle(4, 4, 4);
    g.generateTexture("spark", 8, 8);
    g.clear().fillStyle(0xff5d8f).fillCircle(6, 6, 6).fillCircle(16, 6, 6).fillTriangle(0, 8, 22, 8, 11, 20);
    g.generateTexture("heart", 22, 21);
    g.clear().fillStyle(0x1b2a4a, 0.5).fillCircle(45, 45, 45).lineStyle(3, 0xffd23f, 0.8).strokeCircle(45, 45, 43);
    g.generateTexture("touchBtn", 90, 90);
    g.destroy();

    const rows = { down: 0, up: 6, right: 12, left: 18 };
    for (const dir in rows) {
      this.anims.create({
        key: "walk-" + dir,
        frames: this.anims.generateFrameNumbers("foxGirl", { start: rows[dir], end: rows[dir] + 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    // spell animation: first frame of each direction, played fast = a spin
    this.anims.create({ key: "spin", frames: this.anims.generateFrameNumbers("foxGirl", { frames: [0, 12, 6, 18] }), frameRate: 14, repeat: -1 });

    this.scene.start("Title");
  }
}

class Title extends Phaser.Scene {
  constructor() { super("Title"); }

  create() {
    this.add.image(W / 2, H / 2, "meadow").setDisplaySize(W, H);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a1930, 0.45);
    this.add.text(W / 2, 120, "SPELL GARDEN", { ...TEXT, fontSize: "60px", color: "#ffd23f", strokeThickness: 10 }).setOrigin(0.5);
    this.add.text(W / 2, 180, "keep the shadow wisps away from Fox Girl", { ...TEXT, fontSize: "20px", color: "#ffffff" }).setOrigin(0.5);

    const fox = this.add.sprite(W / 2, 310, "foxGirl").setScale(1.4).play("spin");
    [-1, 1].forEach((side) => {
      const w = this.add.image(W / 2 + side * 150, 300, "wisp").setScale(1.4);
      this.tweens.add({ targets: w, y: 280, x: w.x - side * 20, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });
    this.tweens.add({ targets: fox, y: 300, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const touch = this.sys.game.device.input.touch;
    this.add.text(W / 2, 420, touch ? "tap to walk  -  star button to cast" : "arrows/WASD walk  -  shift run  -  space cast",
      { ...TEXT, fontSize: "17px", color: "#ffffff", strokeThickness: 4 }).setOrigin(0.5);
    const start = this.add.text(W / 2, 480, touch ? "TAP TO START" : "PRESS SPACE TO START", { ...TEXT, fontSize: "28px", color: "#ffffff" }).setOrigin(0.5);
    this.tweens.add({ targets: start, alpha: 0.25, duration: 600, yoyo: true, repeat: -1 });
    this.add.text(W / 2, 535, "BEST: " + loadBest(), { ...TEXT, fontSize: "20px", color: "#ffd23f" }).setOrigin(0.5);

    const go = () => this.scene.start("Game");
    this.input.keyboard.once("keydown-SPACE", go);
    this.input.keyboard.once("keydown-ENTER", go);
    this.input.once("pointerdown", go);
  }
}

class Game extends Phaser.Scene {
  constructor() { super("Game"); }

  create() {
    this.add.image(W / 2, H / 2, "meadow").setDisplaySize(W, H);
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.ended = false;
    this.facing = "down";
    this.castRequested = false;
    this.nextCastAt = 0;
    this.target = null; // touch: where to walk to
    this.wisps = this.add.group();

    this.fox = this.add.sprite(400, 450, "foxGirl").setDepth(5);
    this.cooldownRing = this.add.graphics().setDepth(4);

    this.sparks = this.add.particles(0, 0, "spark", {
      speed: { min: 60, max: 240 }, lifespan: 500, scale: { start: 1.2, end: 0 },
      tint: [0xb48cff, 0xffffff, 0xffd23f], emitting: false,
    }).setDepth(6);

    this.scoreText = this.add.text(16, 14, "", { ...TEXT, fontSize: "24px", color: "#ffffff" }).setDepth(10);
    this.waveText = this.add.text(W / 2, 14, "", { ...TEXT, fontSize: "22px", color: "#ffd23f" }).setOrigin(0.5, 0).setDepth(10);
    this.hearts = [0, 1, 2].map((i) => this.add.image(W - 30 - i * 30, 28, "heart").setDepth(10));
    this.msg = this.add.text(W / 2, H / 2 - 20, "", {
      ...TEXT, fontSize: "40px", color: "#ffd23f", strokeThickness: 8, align: "center",
      backgroundColor: "rgba(10,25,48,0.78)", padding: { x: 28, y: 18 },
    }).setOrigin(0.5).setDepth(20).setVisible(false);
    this.refreshHud();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D");
    this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    // an event never misses a quick tap, even if the key is released within the same frame
    this.input.keyboard.on("keydown-SPACE", () => this.ended ? this.scene.restart() : this.castRequested = true);
    this.input.keyboard.on("keydown-R", () => { if (this.ended) this.scene.restart(); });

    if (this.sys.game.device.input.touch) {
      const btn = this.add.image(W - 70, H - 70, "touchBtn").setInteractive().setDepth(20);
      this.add.image(W - 70, H - 70, "star").setScale(0.05).setDepth(21);
      btn.on("pointerdown", (p, x, y, e) => { e.stopPropagation(); this.castRequested = true; });
      this.input.on("pointerdown", (p) => {
        if (this.ended) return this.scene.restart();
        this.target = { x: p.worldX, y: p.worldY };
      });
    }

    this.states = this.buildStates();
    this.state = "idle";
    this.states.idle.onEnter();

    this.spawnEvent = this.time.addEvent({ delay: 1400, loop: true, callback: () => this.spawnWisp() });
    this.time.addEvent({ delay: 20000, loop: true, callback: () => this.nextWave() });
  }

  // ------------------------------------------------------------ state machine
  heldDirection() {
    const c = this.cursors;
    const k = this.wasd;
    if (c.left.isDown || k.A.isDown) return "left";
    if (c.right.isDown || k.D.isDown) return "right";
    if (c.down.isDown || k.S.isDown) return "down";
    if (c.up.isDown || k.W.isDown) return "up";
    if (this.target) {
      const dx = this.target.x - this.fox.x;
      const dy = this.target.y - this.fox.y;
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) { this.target = null; return null; }
      return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
    }
    return null;
  }

  wantsToCast() {
    const wants = this.castRequested && this.time.now >= this.nextCastAt;
    this.castRequested = false;
    return wants;
  }

  step(dir, amount) {
    if (dir === "left") this.fox.x -= amount;
    if (dir === "right") this.fox.x += amount;
    if (dir === "up") this.fox.y -= amount;
    if (dir === "down") this.fox.y += amount;
    this.fox.x = Phaser.Math.Clamp(this.fox.x, 40, W - 40);
    this.fox.y = Phaser.Math.Clamp(this.fox.y, 250, H - 50);
    this.facing = dir;
  }

  buildStates() {
    const s = this;
    return {
      idle: {
        onEnter() { s.fox.anims.play("walk-" + s.facing, true); s.fox.anims.stop(); },
        onUpdate() {
          if (s.wantsToCast()) return "cast";
          return s.heldDirection() ? (s.shift.isDown ? "run" : "walk") : "idle";
        },
        onExit() {},
      },
      walk: {
        onEnter() {},
        onUpdate(dt) {
          if (s.wantsToCast()) return "cast";
          const dir = s.heldDirection();
          if (!dir) return "idle";
          if (s.shift.isDown) return "run";
          s.fox.anims.play("walk-" + dir, true);
          s.step(dir, 180 * dt);
          return "walk";
        },
        onExit() {},
      },
      run: {
        onEnter() { s.fox.anims.timeScale = 2; },
        onUpdate(dt) {
          if (s.wantsToCast()) return "cast";
          const dir = s.heldDirection();
          if (!dir) return "idle";
          if (!s.shift.isDown) return "walk";
          s.fox.anims.play("walk-" + dir, true);
          s.step(dir, 340 * dt);
          return "run";
        },
        onExit() { s.fox.anims.timeScale = 1; },
      },
      cast: {
        onEnter() {
          s.fox.anims.play("spin", true);
          s.castEndsAt = s.time.now + 450;
          s.nextCastAt = s.time.now + SPELL_COOLDOWN;
          s.castSpell();
        },
        onUpdate() { return s.time.now >= s.castEndsAt ? "idle" : "cast"; },
        onExit() {},
      },
      hurt: {
        onEnter() {
          s.hurtEndsAt = s.time.now + 600;
          s.fox.setTint(0xff7777);
          s.cameras.main.shake(220, 0.012);
        },
        onUpdate() { return s.time.now >= s.hurtEndsAt ? "idle" : "hurt"; },
        onExit() { s.fox.clearTint(); },
      },
    };
  }

  setState(next) {
    if (next === this.state) return;
    this.states[this.state].onExit();
    this.state = next;
    this.states[next].onEnter();
  }

  // ------------------------------------------------------------ gameplay
  castSpell() {
    const { x, y } = this.fox;
    // ring of stars bursting out (from the original exercise)
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10;
      const star = this.add.image(x, y - 20, "star").setScale(0.05).setDepth(6);
      this.tweens.add({
        targets: star, x: x + Math.cos(a) * SPELL_RADIUS, y: y - 20 + Math.sin(a) * SPELL_RADIUS,
        alpha: 0, angle: 180, duration: 450, onComplete: () => star.destroy(),
      });
    }
    let cleared = 0;
    this.wisps.getChildren().slice().forEach((w) => {
      if (Phaser.Math.Distance.Between(x, y - 20, w.x, w.y) <= SPELL_RADIUS) {
        cleared += 1;
        this.sparks.explode(10, w.x, w.y);
        w.destroy();
      }
    });
    if (cleared) {
      // more wisps in one spell = bigger combo bonus
      const pts = cleared * 10 * cleared;
      this.score += pts;
      this.popText(x, y - 80, (cleared > 1 ? "COMBO x" + cleared + "  " : "") + "+" + pts);
      this.refreshHud();
    }
  }

  spawnWisp() {
    if (this.ended) return;
    const side = Phaser.Math.Between(0, 2); // left, right or top edge
    const x = side === 0 ? -20 : side === 1 ? W + 20 : Phaser.Math.Between(40, W - 40);
    const y = side === 2 ? 230 : Phaser.Math.Between(260, H - 40);
    const w = this.add.image(x, y, "wisp").setDepth(3).setAlpha(0);
    w.speed = 45 + this.wave * 12 + Math.random() * 20;
    this.tweens.add({ targets: w, alpha: 1, duration: 300 });
    this.tweens.add({ targets: w, scale: 1.2, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.wisps.add(w);
  }

  nextWave() {
    if (this.ended) return;
    this.wave += 1;
    this.spawnEvent.reset({ delay: Math.max(450, 1400 - this.wave * 150), loop: true, callback: () => this.spawnWisp() });
    this.refreshHud();
    this.popText(W / 2, H / 2 - 60, "WAVE " + this.wave, 46);
  }

  popText(x, y, label, size = 22) {
    const t = this.add.text(x, y, label, { ...TEXT, fontSize: size + "px", color: "#ffd23f", strokeThickness: 5 }).setOrigin(0.5).setDepth(15);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  }

  refreshHud() {
    this.scoreText.setText("SCORE " + this.score);
    this.waveText.setText("WAVE " + this.wave);
    this.hearts.forEach((h, i) => h.setAlpha(i < this.lives ? 1 : 0.2));
  }

  hit(wisp) {
    wisp.destroy();
    if (this.state === "hurt") return;
    this.lives -= 1;
    this.refreshHud();
    if (this.lives <= 0) return this.endGame();
    this.setState("hurt");
  }

  endGame() {
    this.ended = true;
    this.fox.setTint(0xff5555).anims.stop();
    this.cameras.main.shake(300, 0.015);
    const best = loadBest();
    if (this.score > best) saveBest(this.score);
    const again = this.sys.game.device.input.touch ? "tap to play again" : "press R to play again";
    this.msg.setText(["THE WISPS WON", "score " + this.score + "  -  wave " + this.wave, this.score > best ? "NEW BEST!" : "best " + best, again].join("\n"))
      .setVisible(true).setScale(0.5);
    this.tweens.add({ targets: this.msg, scale: 1, duration: 300, ease: "Back.easeOut" });
  }

  update(time, delta) {
    if (this.ended) return;
    const dt = delta / 1000;
    this.setState(this.states[this.state].onUpdate(dt));

    this.wisps.getChildren().slice().forEach((w) => {
      const angle = Phaser.Math.Angle.Between(w.x, w.y, this.fox.x, this.fox.y - 20);
      w.x += Math.cos(angle) * w.speed * dt;
      w.y += Math.sin(angle) * w.speed * dt;
      if (Phaser.Math.Distance.Between(w.x, w.y, this.fox.x, this.fox.y - 20) < 34) this.hit(w);
    });

    // cooldown ring under her feet fills back up after each spell
    const ready = Phaser.Math.Clamp(1 - (this.nextCastAt - time) / SPELL_COOLDOWN, 0, 1);
    this.cooldownRing.clear()
      .lineStyle(4, ready >= 1 ? 0xffd23f : 0x9db2d9, ready >= 1 ? 0.9 : 0.6)
      .beginPath().arc(this.fox.x, this.fox.y + 40, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ready).strokePath();
  }
}

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: "#0a1930",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Boot, Title, Game],
});

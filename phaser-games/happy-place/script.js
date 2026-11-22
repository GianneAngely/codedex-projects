// Treasure Meadow (from the "Happy Place" exercise): Hippocorn and Dino race to grab
// treasures in 60 seconds. Player 1 = arrow keys, player 2 = WASD. On a phone, drag to move Hippocorn.

const W = 800;
const H = 600;
const ROUND = 60;
const BEST_KEY = "treasureMeadowBest";
const TEXT = { fontFamily: "monospace", fontStyle: "bold", stroke: "#1b2a4a", strokeThickness: 6 };

// treasure types: how often they appear, how much they are worth, how big the gif is drawn
const TREASURES = [
  { key: "coin", points: 1, weight: 60, scale: 1.5 },
  { key: "gem", points: 3, weight: 30, scale: 1.5 },
  { key: "star", points: 5, weight: 10, scale: 0.12 },
];
// sky moods across the round: day, golden hour, cozy night
const SKY = [0xffffff, 0xffd27f, 0x6f7fb8];

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
    this.load.image("hippocorn", "https://i.imgur.com/wMj8P7M.gif");
    this.load.image("dino", "https://i.imgur.com/TTQA8lp.gif");
    this.load.image("coin", "https://i.imgur.com/4ZZz70O.gif");
    this.load.image("gem", "https://i.imgur.com/8SJRGJr.gif");
    this.load.image("star", "https://i.imgur.com/z5E7KFm.gif");
  }

  create() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff).fillCircle(4, 4, 4);
    g.generateTexture("spark", 8, 8);
    g.destroy();
    this.scene.start("Title");
  }
}

class Title extends Phaser.Scene {
  constructor() { super("Title"); }

  create() {
    this.add.image(W / 2, H / 2, "meadow").setDisplaySize(W, H);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a1930, 0.4);
    this.add.text(W / 2, 120, "TREASURE MEADOW", { ...TEXT, fontSize: "56px", color: "#ffd23f", strokeThickness: 10 }).setOrigin(0.5);
    this.add.text(W / 2, 180, "grab the most treasure in " + ROUND + " seconds", { ...TEXT, fontSize: "20px", color: "#ffffff" }).setOrigin(0.5);

    const hippo = this.add.image(W / 2 - 120, 300, "hippocorn").setScale(0.35);
    const dino = this.add.image(W / 2 + 120, 300, "dino").setScale(0.35).setFlipX(true);
    this.tweens.add({ targets: [hippo, dino], y: 280, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.add.text(W / 2 - 120, 380, "HIPPOCORN\narrow keys", { ...TEXT, fontSize: "18px", color: "#ff9ecb", align: "center" }).setOrigin(0.5);
    this.add.text(W / 2 + 120, 380, "DINO\nW A S D", { ...TEXT, fontSize: "18px", color: "#9df29d", align: "center" }).setOrigin(0.5);

    this.add.text(W / 2, 450, "coin 1   gem 3   star 5   last 10 s = DOUBLE", { ...TEXT, fontSize: "17px", color: "#ffffff", strokeThickness: 4 }).setOrigin(0.5);
    const touch = this.sys.game.device.input.touch;
    const start = this.add.text(W / 2, 505, touch ? "TAP TO START" : "PRESS SPACE TO START", { ...TEXT, fontSize: "28px", color: "#ffffff" }).setOrigin(0.5);
    this.tweens.add({ targets: start, alpha: 0.25, duration: 600, yoyo: true, repeat: -1 });
    this.add.text(W / 2, 555, "BEST: " + loadBest(), { ...TEXT, fontSize: "20px", color: "#ffd23f" }).setOrigin(0.5);

    const go = () => this.scene.start("Game");
    this.input.keyboard.once("keydown-SPACE", go);
    this.input.keyboard.once("keydown-ENTER", go);
    this.input.once("pointerdown", go);
  }
}

class Game extends Phaser.Scene {
  constructor() { super("Game"); }

  create() {
    this.bg = this.add.image(W / 2, H / 2, "meadow").setDisplaySize(W, H);
    this.treasures = [];
    this.timeLeft = ROUND;
    this.ended = false;
    this.started = false;

    this.players = [
      { name: "HIPPOCORN", sprite: this.add.image(300, 450, "hippocorn").setScale(0.3), speed: 260, score: 0, color: "#ff9ecb" },
      { name: "DINO", sprite: this.add.image(500, 450, "dino").setScale(0.3), speed: 260, score: 0, color: "#9df29d" },
    ];
    this.players.forEach((p) => p.sprite.setDepth(5));

    this.sparks = this.add.particles(0, 0, "spark", {
      speed: { min: 60, max: 220 }, lifespan: 450, scale: { start: 1.1, end: 0 },
      tint: [0xffd23f, 0xffffff, 0xff9ecb], emitting: false,
    }).setDepth(6);

    this.p1Text = this.add.text(16, 14, "", { ...TEXT, fontSize: "24px", color: "#ff9ecb" }).setDepth(10);
    this.p2Text = this.add.text(W - 16, 14, "", { ...TEXT, fontSize: "24px", color: "#9df29d" }).setOrigin(1, 0).setDepth(10);
    this.timerText = this.add.text(W / 2, 14, "", { ...TEXT, fontSize: "28px", color: "#ffffff" }).setOrigin(0.5, 0).setDepth(10);
    this.msg = this.add.text(W / 2, H / 2 - 20, "", {
      ...TEXT, fontSize: "40px", color: "#ffd23f", strokeThickness: 8, align: "center",
      backgroundColor: "rgba(10,25,48,0.78)", padding: { x: 28, y: 18 },
    }).setOrigin(0.5).setDepth(20).setVisible(false);
    this.refreshHud();

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,W,A,S,D,R,SPACE");
    this.input.keyboard.on("keydown-R", () => { if (this.ended) this.scene.restart(); });
    this.input.keyboard.on("keydown-SPACE", () => { if (this.ended) this.scene.restart(); });
    this.input.on("pointerdown", () => { if (this.ended) this.scene.restart(); });

    this.countdown(3);
  }

  countdown(n) {
    const label = n > 0 ? String(n) : "GO!";
    const t = this.add.text(W / 2, H / 2 - 40, label, { ...TEXT, fontSize: "90px", color: "#ffd23f", strokeThickness: 12 })
      .setOrigin(0.5).setScale(0.3).setDepth(20);
    this.tweens.add({ targets: t, scale: 1, duration: 300, ease: "Back.easeOut" });
    this.tweens.add({ targets: t, alpha: 0, delay: 600, duration: 300, onComplete: () => t.destroy() });
    if (n > 0) {
      this.time.delayedCall(900, () => this.countdown(n - 1));
    } else {
      this.started = true;
      this.spawnTimer = this.time.addEvent({ delay: 700, loop: true, callback: () => this.spawnTreasure() });
    }
  }

  pickType() {
    let roll = Math.random() * 100;
    for (const t of TREASURES) {
      if (roll < t.weight) return t;
      roll -= t.weight;
    }
    return TREASURES[0];
  }

  spawnTreasure() {
    if (this.ended || this.treasures.length >= 9) return;
    const type = this.pickType();
    const img = this.add.image(Phaser.Math.Between(60, W - 60), Phaser.Math.Between(270, H - 50), type.key).setScale(0);
    img.type = type;
    img.expiresAt = this.time.now + 6000;
    this.tweens.add({ targets: img, scale: type.scale, duration: 250, ease: "Back.easeOut" });
    this.treasures.push(img);
  }

  doubleTime() {
    return this.timeLeft <= 10;
  }

  refreshHud() {
    this.p1Text.setText("HIPPO " + this.players[0].score);
    this.p2Text.setText("DINO " + this.players[1].score);
    this.timerText.setText((this.doubleTime() ? "x2  " : "") + Math.ceil(this.timeLeft));
    this.timerText.setColor(this.doubleTime() ? "#ffd23f" : "#ffffff");
  }

  grab(player, treasure) {
    const pts = treasure.type.points * (this.doubleTime() ? 2 : 1);
    player.score += pts;
    this.sparks.explode(14, treasure.x, treasure.y);
    const t = this.add.text(treasure.x, treasure.y - 20, "+" + pts, { ...TEXT, fontSize: "24px", color: player.color, strokeThickness: 5 })
      .setOrigin(0.5).setDepth(15);
    this.tweens.add({ targets: t, y: t.y - 50, alpha: 0, duration: 700, onComplete: () => t.destroy() });
    this.tweens.add({ targets: player.sprite, scale: 0.36, duration: 90, yoyo: true });
    treasure.destroy();
    this.refreshHud();
  }

  movePlayer(p, left, right, up, down, dt) {
    let dx = (right ? 1 : 0) - (left ? 1 : 0);
    let dy = (down ? 1 : 0) - (up ? 1 : 0);
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    p.sprite.x = Phaser.Math.Clamp(p.sprite.x + dx * p.speed * dt, 40, W - 40);
    p.sprite.y = Phaser.Math.Clamp(p.sprite.y + dy * p.speed * dt, 250, H - 40);
    if (dx) p.sprite.setFlipX(dx < 0);
    // little wobble while walking
    p.sprite.angle = (dx || dy) ? Math.sin(this.time.now / 60) * 6 : 0;
  }

  endRound() {
    this.ended = true;
    this.spawnTimer.remove();
    const [a, b] = this.players;
    const top = Math.max(a.score, b.score);
    const best = loadBest();
    if (top > best) saveBest(top);
    const winner = a.score === b.score ? "IT'S A TIE!" : (a.score > b.score ? a.name : b.name) + " WINS!";
    const again = this.sys.game.device.input.touch ? "tap to play again" : "press R to play again";
    this.msg.setText([winner, "hippo " + a.score + "  -  dino " + b.score, top > best ? "NEW BEST!" : "best " + best, again].join("\n"))
      .setVisible(true).setScale(0.5);
    this.tweens.add({ targets: this.msg, scale: 1, duration: 300, ease: "Back.easeOut" });
    this.sparks.explode(40, W / 2, H / 2 - 120);
  }

  update(time, delta) {
    if (!this.started || this.ended) return;
    const dt = delta / 1000;
    const k = this.keys;

    // player 1 also follows a finger on touch screens
    const ptr = this.input.activePointer;
    const p1 = this.players[0].sprite;
    const touchDrag = ptr.isDown && this.sys.game.device.input.touch;
    const tx = touchDrag ? ptr.worldX - p1.x : 0;
    const ty = touchDrag ? ptr.worldY - p1.y : 0;
    this.movePlayer(this.players[0], k.LEFT.isDown || tx < -10, k.RIGHT.isDown || tx > 10, k.UP.isDown || ty < -10, k.DOWN.isDown || ty > 10, dt);
    this.movePlayer(this.players[1], k.A.isDown, k.D.isDown, k.W.isDown, k.S.isDown, dt);

    this.treasures = this.treasures.filter((t) => {
      if (!t.active) return false;
      for (const p of this.players) {
        if (Phaser.Math.Distance.Between(p.sprite.x, p.sprite.y, t.x, t.y) < 50) {
          this.grab(p, t);
          return false;
        }
      }
      if (time > t.expiresAt) {
        this.tweens.add({ targets: t, alpha: 0, scale: 0, duration: 200, onComplete: () => t.destroy() });
        return false;
      }
      if (time > t.expiresAt - 1500) t.setAlpha(Math.floor(time / 120) % 2 ? 0.4 : 1); // blink before it vanishes
      return true;
    });

    // sky drifts from day to golden hour to night as the round goes on
    const progress = 1 - this.timeLeft / ROUND;
    const seg = Math.min(1, Math.floor(progress * 2));
    const local = Math.min(1, progress * 2 - seg);
    const c = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(SKY[seg]), Phaser.Display.Color.ValueToColor(SKY[seg + 1]), 100, local * 100);
    this.bg.setTint(Phaser.Display.Color.GetColor(c.r, c.g, c.b));

    this.timeLeft = Math.max(0, this.timeLeft - dt);
    this.refreshHud();
    if (this.timeLeft === 0) this.endRound();
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

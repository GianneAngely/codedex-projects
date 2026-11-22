# Phaser Games

Three browser games built with [Phaser 3](https://phaser.io). Each one started as a Codédex Phaser exercise and grew into a small complete game with a title screen, scoring, a best score saved in the browser, sound and touch controls for phones.

| Game | Folder | Controls | Play |
| --- | --- | --- | --- |
| Frog Star Hop | `frog-star-hop/` | arrows or WASD, up/W/space to jump, P to pause | [play](https://gianneangely.github.io/codedex-projects/phaser-games/frog-star-hop/) |
| Spell Garden | `world-weaver/` | arrows or WASD, shift to run, space to cast | [play](https://gianneangely.github.io/codedex-projects/phaser-games/world-weaver/) |
| Treasure Meadow | `happy-place/` | player 1 arrows, player 2 WASD | [play](https://gianneangely.github.io/codedex-projects/phaser-games/happy-place/) |

**What's inside:** scenes (boot, title, game), arcade physics with static and moving platforms, overlap vs collider, a character state machine, particles, tweens for squash and stretch, camera shake, a chiptune WAV generated in code, `localStorage` best scores, and `Scale.FIT` with on-screen buttons for touch screens.

## Run

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/frog-star-hop/ (or the other folders). No build step: Phaser 3.90 loads from a CDN.

Art assets are the ones provided by the Codédex Phaser course (loaded by URL).

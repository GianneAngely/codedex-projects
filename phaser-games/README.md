# Phaser Games

Three small browser games I built while learning [Phaser 3](https://phaser.io) on Codédex.

| Game | What it shows |
| --- | --- |
| [Frog Star Hop](frog-star-hop/) | Platformer: collect 5 stars, dodge 2 patrolling wizards. Arcade physics, colliders vs overlaps, HUD, win/lose states, restart, generated chiptune audio |
| [World Weaver](world-weaver/) | Character with a state machine (idle, walk, run, cast spell) and spritesheet animations |
| [Happy Place](happy-place/) | First scene: preload/create/update, sprites, keyboard input |

**Play online:** [Frog Star Hop](https://gianneangely.github.io/codedex-projects/phaser-games/frog-star-hop/) · [World Weaver](https://gianneangely.github.io/codedex-projects/phaser-games/world-weaver/) · [Happy Place](https://gianneangely.github.io/codedex-projects/phaser-games/happy-place/)

**Stack:** JavaScript, Phaser 3.90 (CDN). No build step.

## Run

Open a game folder's `index.html` through any local server, for example:

```bash
cd frog-star-hop && python3 -m http.server 8000
```

Then visit http://localhost:8000. Frog Star Hop controls: arrow keys to move and jump, R to restart.

Art assets are the ones provided by the Codédex Phaser course (loaded by URL).

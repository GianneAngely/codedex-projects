<p align="center">
  <img src="https://www.codedex.io/images/30-nites-of-code/all-pets.gif" width="320" alt="The Codédex pets">
</p>

<h1 align="center">Codédex Projects</h1>

<p align="center">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/int-python.png" width="40" alt="Intermediate Python">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/int-js.png" width="40" alt="Intermediate JavaScript">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/int-java.png" width="40" alt="Intermediate Java">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/node.png" width="40" alt="Node.js">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/sql.png" width="40" alt="SQL">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/phaser.png" width="40" alt="Phaser">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/lua.png" width="40" alt="Lua">
  <img src="https://www.codedex.io/images/badges/goldenCourseBadges/github-copilot.png" width="40" alt="GitHub Copilot">
</p>

<p align="center">Games, apps and exercises I built while learning on <a href="https://www.codedex.io">Codédex</a> in 2026, from JavaScript game dev to Lua, Python, SQL and Node.js.</p>

## Games <img src="https://www.codedex.io/images/30-nites-of-code/step-3.gif" height="28" alt="">

| Game | About | Stack | Play |
| --- | --- | --- | --- |
| **Frog Star Hop** | Platformer with 3 levels, patrolling wizards, moving platforms, lives, time bonus, best score and touch controls | JavaScript, Phaser 3 | [play in browser](https://gianneangely.github.io/codedex-projects/phaser-games/frog-star-hop/) |
| **Spell Garden** | Survive waves of shadow wisps by casting a sparkle spell. The character runs on a state machine (idle, walk, run, cast, hurt) | JavaScript, Phaser 3 | [play in browser](https://gianneangely.github.io/codedex-projects/phaser-games/world-weaver/) |
| **Treasure Meadow** | 2-player race to grab treasures in 60 seconds while the sky turns from day to night | JavaScript, Phaser 3 | [play in browser](https://gianneangely.github.io/codedex-projects/phaser-games/happy-place/) |
| **Brick Breaker** | Breakout with 5 levels, power-ups, particles, best score saved to disk and 20 unit tests. My Lua final project | Lua, LÖVE | [how to run](lua/brick-breaker/) |

## Other projects <img src="https://www.codedex.io/images/brand/bot/bouncingbot.webp" height="28" alt="">

| Project | About | Stack |
| --- | --- | --- |
| [UI/UX Design](ui-ux-design/) | Figma: holographic trading card deck and PetPal, a petsitter app taken from Crazy 8s to wireframes, clickable prototype and hi-fi | Figma |
| [Tip Predictor](machine-learning-tips-regression/) | Linear regression on 244 restaurant bills: each extra dollar adds about 10 cents of tip (R² 0.545) | Python, pandas, scikit-learn, Matplotlib |
| [Tkinter Mini Apps](github-copilot-python-apps/) | Rock Paper Scissors with a scoreboard, and a calculator, as desktop apps | Python, Tkinter |
| [Lua OOP Adventure](lua/adventure.lua) | Text battle with Player, Enemy and Spell objects built from metatables | Lua |
| [Node.js exercises](nodejs/) | `fs`, `path` and `os` modules, small HTTP servers, CRUD routes | JavaScript, Node.js |
| [Intermediate Python exercises](intermediate-python/) | File I/O, CSV, `unittest` | Python |

## Extras <img src="https://www.codedex.io/images/30-nites-of-code/step-2.gif" height="28" alt="">

- **[Pixel Gallery](https://gianneangely.github.io/codedex-projects/pixel-gallery/)**: a fan page of the Codédex pixel art I love, with 120+ pets, characters, badges and course worlds. Tap any sprite to zoom.
- **[Study notes](notes/)** (Bahasa Indonesia): chapter-by-chapter notes for React, p5.js, UI/UX Design and SQL.

## Run locally

- **Phaser games:** serve the folder and open a game, for example `cd phaser-games && python3 -m http.server` then visit http://localhost:8000/frog-star-hop/
- **Brick Breaker:** install [LÖVE](https://love2d.org), then `love lua/brick-breaker`. Tests: `cd lua/brick-breaker && lua tests/run_tests.lua`
- **Python projects:** `python3 <file>.py` inside the project folder (the ML project needs `pip install pandas numpy scikit-learn matplotlib`)

Art for the Phaser games comes from the Codédex Phaser course.

Pixel art in this README and the gallery © Codédex, loaded from their site.

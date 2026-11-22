# Codédex Projects

Games, apps and exercises I built while learning on [Codédex](https://www.codedex.io) in 2026, from JavaScript game dev to Lua, Python and Node.js.

## Games

| Game | About | Stack | Play |
| --- | --- | --- | --- |
| **Frog Star Hop** | Platformer with 3 levels, patrolling wizards, moving platforms, lives, time bonus, best score and touch controls | JavaScript, Phaser 3 | [play in browser](https://gianneangely.github.io/codedex-projects/phaser-games/frog-star-hop/) |
| **Spell Garden** | Survive waves of shadow wisps by casting a sparkle spell. The character runs on a state machine (idle, walk, run, cast, hurt) | JavaScript, Phaser 3 | [play in browser](https://gianneangely.github.io/codedex-projects/phaser-games/world-weaver/) |
| **Treasure Meadow** | 2-player race to grab treasures in 60 seconds while the sky turns from day to night | JavaScript, Phaser 3 | [play in browser](https://gianneangely.github.io/codedex-projects/phaser-games/happy-place/) |
| **Brick Breaker** | Breakout with 5 levels, power-ups, particles, best score saved to disk and 20 unit tests. My Lua final project | Lua, LÖVE | [how to run](lua/brick-breaker/) |

## Other projects

| Project | About | Stack |
| --- | --- | --- |
| [Tip Predictor](machine-learning-tips-regression/) | Linear regression on 244 restaurant bills: each extra dollar adds about 10 cents of tip (R² 0.545) | Python, pandas, scikit-learn, Matplotlib |
| [Tkinter Mini Apps](github-copilot-python-apps/) | Rock Paper Scissors with a scoreboard, and a calculator, as desktop apps | Python, Tkinter |
| [Lua OOP Adventure](lua/adventure.lua) | Text battle with Player, Enemy and Spell objects built from metatables | Lua |
| [Node.js exercises](nodejs/) | `fs`, `path` and `os` modules, small HTTP servers, CRUD routes | JavaScript, Node.js |
| [Intermediate Python exercises](intermediate-python/) | File I/O, CSV, `unittest` | Python |

## Run locally

- **Phaser games:** serve the folder and open a game, for example `cd phaser-games && python3 -m http.server` then visit http://localhost:8000/frog-star-hop/
- **Brick Breaker:** install [LÖVE](https://love2d.org), then `love lua/brick-breaker`. Tests: `cd lua/brick-breaker && lua tests/run_tests.lua`
- **Python projects:** `python3 <file>.py` inside the project folder (the ML project needs `pip install pandas numpy scikit-learn matplotlib`)

Art for the Phaser games comes from the Codédex Phaser course.

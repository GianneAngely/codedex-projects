# Brick Breaker

Breakout in Lua with [LÖVE](https://love2d.org). My final project for the Codédex Lua course.

- 5 levels, the ball gets faster each level
- Bricks with 1 to 3 hit points that change color as they crack
- Power-ups: **W** wider paddle (10 s), **S** slower ball (8 s), **+** extra life
- Particles, screen shake, ball trail and beep sounds generated in code
- Best score saved to disk, title screen, pause
- 20 unit tests that run with plain `lua`, no LÖVE needed

## Controls

| Key | Action |
| --- | --- |
| Left/Right, A/D or mouse | Move the paddle |
| Space or click | Launch the ball, next level |
| P | Pause |
| R | Play again after game over or win |
| Esc | Quit |

## Run

1. Install LÖVE 11 from https://love2d.org
2. `love path/to/brick-breaker` (on macOS: `/Applications/love.app/Contents/MacOS/love brick-breaker`)

Tests: `lua tests/run_tests.lua`

## Code

- `main.lua`: LÖVE callbacks (`love.load`, `love.update`, `love.draw`, input), sounds, best-score file
- `game.lua`: game state machine (title, serve, play, paused, levelclear, gameover, win), power-ups, particles
- `ball.lua`, `paddle.lua`, `brick.lua`: objects built with metatables and a `new` constructor
- `level.lua`: levels written as rows of text (digit = brick hit points, `.` = empty)
- `tests/`: unit tests plus a smoke test with a fake `love` table

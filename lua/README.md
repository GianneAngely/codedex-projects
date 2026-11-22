# Lua Projects

From the Codédex Lua course.

- [brick-breaker/](brick-breaker/): Breakout game in [LÖVE](https://love2d.org). 3 levels, bricks with 1 to 3 hit points, score, lives, pause, restart, generated beep sounds. Objects with metatables, a game state machine, and unit tests that run without LÖVE (`lua tests/run_tests.lua`).
- `adventure.lua`: text RPG objects (Player, Enemy, Spell) using metatables and `:` methods.

**Stack:** Lua, LÖVE 11

Run the game: `love brick-breaker` (install LÖVE from love2d.org).

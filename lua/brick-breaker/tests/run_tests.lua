-- Jalankan dari folder project: lua tests/run_tests.lua
package.path = "./?.lua;" .. package.path

local Ball = require("ball")
local Paddle = require("paddle")
local Brick = require("brick")
local Level = require("level")
local Game = require("game")

local passed, failed = 0, 0
local function test(name, fn)
  local ok, err = pcall(fn)
  if ok then passed = passed + 1; print("ok   " .. name)
  else failed = failed + 1; print("FAIL " .. name .. ": " .. tostring(err)) end
end
local function near(a, b) return math.abs(a - b) < 1e-6 end

test("level 1 punya 30 bata", function()
  assert(#Level.build(1, 800) == 30)
end)

test("bata level muat di layar", function()
  for n = 1, Level.count do
    for _, b in ipairs(Level.build(n, 800)) do
      assert(b.x >= 0 and b.x + b.w <= 800)
    end
  end
end)

test("launch: kecepatan total = speed", function()
  local b = Ball.new(0, 0, 300); b:launch()
  assert(near(math.sqrt(b.dx ^ 2 + b.dy ^ 2), 300) and b.dy < 0)
end)

test("bola mantul dari dinding kiri", function()
  local b = Ball.new(5, 300, 300); b.dx, b.dy = -100, 0
  b:update(0.1, 800)
  assert(b.dx > 0 and b.x >= b.r)
end)

test("paddle nggak keluar layar", function()
  local p = Paddle.new(10, 560); p:update(1, -1, 800)
  assert(p.x == 0)
  p:update(10, 1, 800)
  assert(p.x + p.w == 800)
end)

test("bata hp 2 butuh 2 pukulan", function()
  local br = Brick.new(0, 0, 10, 10, 2)
  assert(br:hit() == false and br:hit() == true and br.points == 20)
end)

test("kena kanan paddle, bola ke kanan, speed tetap", function()
  local p = Paddle.new(100, 500)
  local b = Ball.new(p.x + p.w - 5, 495, 300); b.dy = 200
  b:bounceOffPaddle(p)
  assert(b.dx > 0 and b.dy < 0 and near(math.sqrt(b.dx ^ 2 + b.dy ^ 2), 300))
end)

test("serve: SPACE melempar bola", function()
  local g = Game.new(800, 600)
  g:update(0.016, 0)
  assert(g.state == "serve" and g.ball.x == g.paddle:center())
  g:keypressed("space")
  assert(g.state == "play" and g.ball.dy < 0)
end)

test("bola jatuh: nyawa berkurang, balik serve", function()
  local g = Game.new(800, 600); g:keypressed("space")
  g.ball.x, g.ball.y, g.ball.dx, g.ball.dy = 400, 700, 0, 100
  g:update(0.016, 0)
  assert(g.lives == 2 and g.state == "serve")
end)

test("nyawa habis: game over, R reset", function()
  local g = Game.new(800, 600); g.lives = 1; g:keypressed("space")
  g.ball.x, g.ball.y, g.ball.dx, g.ball.dy = 400, 700, 0, 100
  g:update(0.016, 0)
  assert(g.state == "gameover")
  g:keypressed("r")
  assert(g.state == "serve" and g.lives == 3 and g.score == 0 and g.level == 1)
end)

test("bola kena bata: bata hilang, skor nambah, bola balik arah", function()
  local g = Game.new(800, 600); g:keypressed("space")
  local target = g.bricks[1]
  local count = #g.bricks
  g.ball.x = target.x + target.w / 2
  g.ball.y = target.y + target.h + g.ball.r - 1
  g.ball.dx, g.ball.dy = 0, -300
  g:update(0.001, 0)
  assert(#g.bricks == count - 1 and g.score == 10 and g.ball.dy > 0)
end)

test("bata habis: level clear, SPACE ke level 2, level terakhir menang", function()
  local g = Game.new(800, 600); g:keypressed("space")
  g.bricks = {}
  g:update(0.016, 0)
  assert(g.state == "levelclear")
  g:keypressed("space")
  assert(g.level == 2 and g.state == "serve" and #g.bricks == 40)
  assert(g.ball.speed == 360)
  g.level = Level.count; g:keypressed("space"); g.state = "play"; g.bricks = {}
  g:update(0.016, 0)
  assert(g.state == "win")
end)

test("P pause dan lanjut, paddle diam waktu pause", function()
  local g = Game.new(800, 600); g:keypressed("space"); g:keypressed("p")
  local x = g.paddle.x
  g:update(0.5, 1)
  assert(g.state == "paused" and g.paddle.x == x)
  g:keypressed("p")
  assert(g.state == "play")
end)

print(("\n%d lulus, %d gagal"):format(passed, failed))
os.exit(failed == 0 and 0 or 1)

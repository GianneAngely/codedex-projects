local Paddle = require("paddle")
local Ball = require("ball")
local Level = require("level")

local Game = {}
Game.__index = Game

local PADDLE_W = 110
local WIDE_W = 170
local POWERUP_CHANCE = 0.15
local POWERUPS = { "wide", "slow", "life" }

-- State: "title", "serve", "play", "paused", "levelclear", "gameover", "win"
function Game.new(w, h, store)
  local self = setmetatable({ w = w, h = h }, Game)
  self.sfx = function(name) end -- diganti main.lua biar ada suara
  self.random = math.random     -- bisa diganti di tes biar hasilnya pasti
  -- store = { load = function() return angka end, save = function(angka) end }
  self.store = store or { load = function() return 0 end, save = function() end }
  self.best = self.store.load()
  self.particles = {}
  self.shake = 0
  self:reset()
  self.state = "title"
  return self
end

function Game:reset()
  self.score = 0
  self.newBest = false
  self.lives = 3
  self.level = 1
  self:loadLevel()
end

function Game:loadLevel()
  self.bricks = Level.build(self.level, self.w)
  self.paddle = Paddle.new(self.w / 2 - PADDLE_W / 2, self.h - 40)
  self.baseSpeed = 300 + 40 * (self.level - 1)
  self.ball = Ball.new(0, 0, self.baseSpeed)
  self.powerups = {}
  self:serve()
end

function Game:clearEffects()
  self.wideTime, self.slowTime = 0, 0
  local center = self.paddle:center()
  self.paddle.w = PADDLE_W
  self.paddle.x = math.max(0, math.min(self.w - PADDLE_W, center - PADDLE_W / 2))
  self.ball.speed = self.baseSpeed
end

function Game:serve()
  self.state = "serve"
  self.ball.dx, self.ball.dy = 0, 0
  self.trail = {}
  self:clearEffects()
end

-- ----------------------------------------------------------- efek visual
function Game:burst(x, y, color, count, power)
  for _ = 1, count do
    local angle = self.random() * math.pi * 2
    local speed = (0.3 + self.random()) * power
    table.insert(self.particles, {
      x = x, y = y, dx = math.cos(angle) * speed, dy = math.sin(angle) * speed,
      life = 0.6, maxLife = 0.6, color = color,
    })
  end
end

function Game:updateParticles(dt)
  for i = #self.particles, 1, -1 do
    local p = self.particles[i]
    p.x, p.y = p.x + p.dx * dt, p.y + p.dy * dt
    p.dy = p.dy + 500 * dt -- jatuh pelan kayak serpihan
    p.life = p.life - dt
    if p.life <= 0 then table.remove(self.particles, i) end
  end
  self.shake = math.max(0, self.shake - dt)
end

-- ----------------------------------------------------------- power-up
function Game:applyPowerup(kind)
  if kind == "wide" then
    local center = self.paddle:center()
    self.paddle.w = WIDE_W
    self.paddle.x = math.max(0, math.min(self.w - WIDE_W, center - WIDE_W / 2))
    self.wideTime = 10
  elseif kind == "slow" then
    if self.slowTime <= 0 then self:setBallSpeed(self.baseSpeed * 0.7) end
    self.slowTime = 8
  elseif kind == "life" then
    self.lives = math.min(5, self.lives + 1)
  end
  self.sfx("power")
end

-- ganti speed tapi arah bola tetap
function Game:setBallSpeed(speed)
  local ball = self.ball
  local scale = speed / ball.speed
  ball.speed = speed
  ball.dx, ball.dy = ball.dx * scale, ball.dy * scale
end

function Game:updateEffects(dt)
  if self.wideTime > 0 then
    self.wideTime = self.wideTime - dt
    if self.wideTime <= 0 then
      local center = self.paddle:center()
      self.paddle.w = PADDLE_W
      self.paddle.x = math.max(0, math.min(self.w - PADDLE_W, center - PADDLE_W / 2))
    end
  end
  if self.slowTime > 0 then
    self.slowTime = self.slowTime - dt
    if self.slowTime <= 0 then self:setBallSpeed(self.baseSpeed) end
  end

  for i = #self.powerups, 1, -1 do
    local p = self.powerups[i]
    p.y = p.y + 160 * dt
    local pad = self.paddle
    if p.y + 10 > pad.y and p.y - 10 < pad.y + pad.h and p.x > pad.x and p.x < pad.x + pad.w then
      self:applyPowerup(p.kind)
      self:burst(p.x, p.y, { 1, 1, 1 }, 10, 160)
      table.remove(self.powerups, i)
    elseif p.y > self.h + 20 then
      table.remove(self.powerups, i)
    end
  end
end

-- ----------------------------------------------------------- loop utama
function Game:update(dt, dir)
  self:updateParticles(dt)
  if self.state ~= "serve" and self.state ~= "play" then return end

  self.paddle:update(dt, dir, self.w)
  local ball = self.ball

  if self.state == "serve" then
    -- bola nempel di atas paddle sampai SPACE
    ball.x = self.paddle:center()
    ball.y = self.paddle.y - ball.r
    return
  end

  ball:update(dt, self.w)
  self:updateEffects(dt)

  table.insert(self.trail, 1, { x = ball.x, y = ball.y })
  if #self.trail > 8 then table.remove(self.trail) end

  if ball.dy > 0 and ball:collides(self.paddle) then
    ball:bounceOffPaddle(self.paddle)
    self.sfx("paddle")
  end

  for i = #self.bricks, 1, -1 do
    local brick = self.bricks[i]
    if ball:collides(brick) then
      ball:bounceOffBrick(brick)
      local color = brick:color()
      if brick:hit() then
        self.score = self.score + brick.points
        table.remove(self.bricks, i)
        self:burst(brick.x + brick.w / 2, brick.y + brick.h / 2, color, 14, 220)
        self.shake = 0.08
        if self.random() < POWERUP_CHANCE then
          local kind = POWERUPS[math.floor(self.random() * #POWERUPS) + 1]
          table.insert(self.powerups, { x = brick.x + brick.w / 2, y = brick.y + brick.h / 2, kind = kind })
        end
      else
        self:burst(ball.x, ball.y, color, 4, 120)
      end
      self.sfx("brick")
      break -- satu bata per frame biar pantulan rapi
    end
  end

  if #self.bricks == 0 then
    self.state = (self.level == Level.count) and "win" or "levelclear"
    if self.state == "win" then self:saveBest() end
    self.sfx("win")
  elseif ball.y - ball.r > self.h then
    self.lives = self.lives - 1
    self.shake = 0.3
    self.sfx("lose")
    if self.lives == 0 then
      self.state = "gameover"
      self:saveBest()
    else
      self:serve()
    end
  end
end

function Game:saveBest()
  self.newBest = self.score > self.best
  if self.newBest then
    self.best = self.score
    self.store.save(self.best)
  end
end

-- mouse: tengah paddle ikut posisi x mouse
function Game:setPaddleCenter(x)
  if self.state ~= "serve" and self.state ~= "play" then return end
  self.paddle.x = math.max(0, math.min(self.w - self.paddle.w, x - self.paddle.w / 2))
end

function Game:keypressed(key)
  if key == "space" then
    if self.state == "title" then
      self:reset()
    elseif self.state == "serve" then
      self.ball:launch()
      self.state = "play"
    elseif self.state == "levelclear" then
      self.level = self.level + 1
      self:loadLevel()
    end
  elseif key == "p" then
    if self.state == "play" then
      self.state = "paused"
    elseif self.state == "paused" then
      self.state = "play"
    end
  elseif key == "r" and (self.state == "gameover" or self.state == "win") then
    self:reset()
  end
end

-- ----------------------------------------------------------- gambar
local MESSAGES = {
  serve = "SPACE / klik buat lempar bola",
  paused = "PAUSE - tekan P buat lanjut",
  levelclear = "Level beres! SPACE ke level berikutnya",
  gameover = "GAME OVER - tekan R buat main lagi",
  win = "MENANG! Semua level beres - tekan R buat main lagi",
}
local POWERUP_STYLE = {
  wide = { label = "W", color = { 0.45, 0.85, 0.55 } },
  slow = { label = "S", color = { 0.45, 0.75, 1.00 } },
  life = { label = "+", color = { 1.00, 0.45, 0.60 } },
}

function Game:drawTitle()
  local g = love.graphics
  local font = g.getFont()
  self.titleFont = self.titleFont or g.newFont(56)
  g.setFont(self.titleFont)
  g.setColor(1, 0.84, 0.04)
  g.printf("BRICK BREAKER", 0, self.h / 2 - 120, self.w, "center")
  g.setFont(font)
  g.setColor(0.93, 0.95, 1)
  g.printf("pecahin semua bata di " .. Level.count .. " level", 0, self.h / 2 - 30, self.w, "center")
  g.setColor(0.62, 0.70, 0.85)
  g.printf("W = paddle lebar   S = bola pelan   + = nyawa", 0, self.h / 2 + 10, self.w, "center")
  g.printf("panah / A D / mouse buat gerak, P pause", 0, self.h / 2 + 40, self.w, "center")
  g.setColor(1, 1, 1, 0.55 + 0.45 * math.sin(love.timer.getTime() * 4))
  g.printf("SPACE / klik buat mulai", 0, self.h / 2 + 100, self.w, "center")
  g.setColor(1, 0.84, 0.04)
  g.printf("BEST: " .. self.best, 0, self.h / 2 + 150, self.w, "center")
end

function Game:draw()
  local g = love.graphics
  if self.state == "title" then
    self:drawTitle()
    return
  end

  g.push()
  if self.shake > 0 then
    g.translate((self.random() - 0.5) * 10, (self.random() - 0.5) * 10)
  end

  for _, brick in ipairs(self.bricks) do brick:draw() end

  for i, t in ipairs(self.trail or {}) do
    g.setColor(1, 1, 1, 0.25 * (1 - i / 9))
    g.circle("fill", t.x, t.y, self.ball.r * (1 - i / 12))
  end

  for _, p in ipairs(self.powerups) do
    local style = POWERUP_STYLE[p.kind]
    g.setColor(style.color)
    g.rectangle("fill", p.x - 16, p.y - 10, 32, 20, 8, 8)
    g.setColor(0.08, 0.07, 0.18)
    g.printf(style.label, p.x - 16, p.y - 11, 32, "center")
  end

  self.paddle:draw()
  self.ball:draw()

  for _, p in ipairs(self.particles) do
    g.setColor(p.color[1], p.color[2], p.color[3], p.life / p.maxLife)
    g.rectangle("fill", p.x - 3, p.y - 3, 6, 6)
  end
  g.pop()

  g.setColor(1, 1, 1)
  g.print("Skor: " .. self.score, 16, 16)
  g.printf("Level " .. self.level .. "/" .. Level.count .. "   Best " .. self.best, 0, 16, self.w, "center")
  g.print("Nyawa: " .. self.lives, self.w - 110, 16)
  if self.wideTime > 0 then g.print("Lebar " .. math.ceil(self.wideTime), 16, 40) end
  if self.slowTime > 0 then g.print("Pelan " .. math.ceil(self.slowTime), 120, 40) end

  local msg = MESSAGES[self.state]
  if msg then
    if self.newBest and (self.state == "gameover" or self.state == "win") then
      msg = "SKOR TERTINGGI BARU! " .. msg
    end
    g.setColor(0.04, 0.10, 0.19, 0.8)
    g.rectangle("fill", 0, self.h / 2 - 16, self.w, 56)
    g.setColor(1, 0.84, 0.04)
    g.printf(msg, 0, self.h / 2, self.w, "center")
  end
end

return Game

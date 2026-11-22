local Paddle = require("paddle")
local Ball = require("ball")
local Level = require("level")

local Game = {}
Game.__index = Game

-- State: "serve", "play", "paused", "levelclear", "gameover", "win"
function Game.new(w, h)
  local self = setmetatable({ w = w, h = h }, Game)
  self.sfx = function(name) end -- diganti main.lua biar ada suara
  self:reset()
  return self
end

function Game:reset()
  self.score = 0
  self.lives = 3
  self.level = 1
  self:loadLevel()
end

function Game:loadLevel()
  self.bricks = Level.build(self.level, self.w)
  self.paddle = Paddle.new(self.w / 2 - 55, self.h - 40)
  self.ball = Ball.new(0, 0, 300 + 60 * (self.level - 1))
  self:serve()
end

function Game:serve()
  self.state = "serve"
  self.ball.dx, self.ball.dy = 0, 0
end

function Game:update(dt, dir)
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

  if ball.dy > 0 and ball:collides(self.paddle) then
    ball:bounceOffPaddle(self.paddle)
    self.sfx("paddle")
  end

  for i = #self.bricks, 1, -1 do
    local brick = self.bricks[i]
    if ball:collides(brick) then
      ball:bounceOffBrick(brick)
      if brick:hit() then
        self.score = self.score + brick.points
        table.remove(self.bricks, i)
      end
      self.sfx("brick")
      break -- satu bata per frame biar pantulan rapi
    end
  end

  if #self.bricks == 0 then
    self.state = (self.level == Level.count) and "win" or "levelclear"
    self.sfx("win")
  elseif ball.y - ball.r > self.h then
    self.lives = self.lives - 1
    self.sfx("lose")
    if self.lives == 0 then
      self.state = "gameover"
    else
      self:serve()
    end
  end
end

function Game:keypressed(key)
  if key == "space" then
    if self.state == "serve" then
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

local MESSAGES = {
  serve = "SPACE buat lempar bola",
  paused = "PAUSE - tekan P buat lanjut",
  levelclear = "Level beres! SPACE ke level berikutnya",
  gameover = "GAME OVER - tekan R buat main lagi",
  win = "MENANG! Semua level beres - tekan R buat main lagi",
}

function Game:draw()
  for _, brick in ipairs(self.bricks) do brick:draw() end
  self.paddle:draw()
  self.ball:draw()

  love.graphics.setColor(1, 1, 1)
  love.graphics.print("Skor: " .. self.score, 16, 16)
  love.graphics.print("Level: " .. self.level .. "/" .. Level.count, self.w / 2 - 30, 16)
  love.graphics.print("Nyawa: " .. self.lives, self.w - 90, 16)

  local msg = MESSAGES[self.state]
  if msg then
    love.graphics.printf(msg, 0, self.h / 2, self.w, "center")
  end
end

return Game

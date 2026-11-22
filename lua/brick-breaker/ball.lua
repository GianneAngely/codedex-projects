local Ball = {}
Ball.__index = Ball

function Ball.new(x, y, speed)
  local self = { x = x, y = y, r = 8, speed = speed, dx = 0, dy = 0 }
  return setmetatable(self, Ball)
end

function Ball:launch()
  -- 0.6^2 + 0.8^2 = 1, jadi kecepatan total tetap = speed
  self.dx = self.speed * 0.6
  self.dy = -self.speed * 0.8
end

function Ball:update(dt, screenW)
  self.x = self.x + self.dx * dt
  self.y = self.y + self.dy * dt

  if self.x - self.r < 0 then
    self.x = self.r
    self.dx = math.abs(self.dx)
  elseif self.x + self.r > screenW then
    self.x = screenW - self.r
    self.dx = -math.abs(self.dx)
  end
  if self.y - self.r < 0 then
    self.y = self.r
    self.dy = math.abs(self.dy)
  end
end

-- Cek tabrakan bola (dianggap kotak) dengan kotak lain
function Ball:collides(rect)
  return self.x + self.r > rect.x and self.x - self.r < rect.x + rect.w
     and self.y + self.r > rect.y and self.y - self.r < rect.y + rect.h
end

-- Makin ke pinggir paddle kena, makin miring pantulannya
function Ball:bounceOffPaddle(paddle)
  local offset = (self.x - paddle:center()) / (paddle.w / 2)
  offset = math.max(-1, math.min(1, offset))
  self.dx = self.speed * offset * 0.8
  self.dy = -math.sqrt(self.speed ^ 2 - self.dx ^ 2)
  self.y = paddle.y - self.r
end

-- Pantul di sumbu yang overlap-nya paling kecil
function Ball:bounceOffBrick(brick)
  local overlapX = math.min(self.x + self.r - brick.x, brick.x + brick.w - (self.x - self.r))
  local overlapY = math.min(self.y + self.r - brick.y, brick.y + brick.h - (self.y - self.r))
  if overlapX < overlapY then
    self.dx = -self.dx
  else
    self.dy = -self.dy
  end
end

function Ball:draw()
  love.graphics.setColor(1, 1, 1)
  love.graphics.circle("fill", self.x, self.y, self.r)
end

return Ball

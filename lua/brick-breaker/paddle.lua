local Paddle = {}
Paddle.__index = Paddle

function Paddle.new(x, y)
  local self = { x = x, y = y, w = 110, h = 16, speed = 480 }
  return setmetatable(self, Paddle)
end

-- dir: -1 = kiri, 0 = diam, 1 = kanan
function Paddle:update(dt, dir, screenW)
  self.x = self.x + dir * self.speed * dt
  if self.x < 0 then self.x = 0 end
  if self.x + self.w > screenW then self.x = screenW - self.w end
end

function Paddle:center()
  return self.x + self.w / 2
end

function Paddle:draw()
  love.graphics.setColor(0.95, 0.95, 1)
  love.graphics.rectangle("fill", self.x, self.y, self.w, self.h, 6, 6)
end

return Paddle

local Brick = {}
Brick.__index = Brick

local COLORS = {
  { 1.00, 0.55, 0.75 }, -- hp 1: pink
  { 1.00, 0.85, 0.30 }, -- hp 2: kuning
  { 0.45, 0.75, 1.00 }, -- hp 3: biru
}

function Brick.new(x, y, w, h, hp)
  local self = { x = x, y = y, w = w, h = h, hp = hp, points = 10 * hp }
  return setmetatable(self, Brick)
end

-- Kurangi hp, return true kalau bata hancur
function Brick:hit()
  self.hp = self.hp - 1
  return self.hp <= 0
end

function Brick:draw()
  love.graphics.setColor(COLORS[self.hp])
  love.graphics.rectangle("fill", self.x, self.y, self.w, self.h, 4, 4)
end

return Brick

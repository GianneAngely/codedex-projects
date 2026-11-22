local Brick = require("brick")

local Level = {}

-- Angka = hp bata, "." = kosong
local LAYOUTS = {
  {
    "1111111111",
    "1111111111",
    "1111111111",
  },
  {
    "2222222222",
    "1111111111",
    "2121212121",
    "1111111111",
  },
  {
    "3333333333",
    "2.2.22.2.2",
    "2222222222",
    "1111111111",
    "1.1.11.1.1",
  },
}

Level.count = #LAYOUTS

function Level.build(n, screenW)
  local bricks = {}
  local cols, gap, top, h = 10, 6, 60, 22
  local w = (screenW - gap * (cols + 1)) / cols
  for row, line in ipairs(LAYOUTS[n]) do
    for col = 1, #line do
      local hp = tonumber(line:sub(col, col))
      if hp then
        local x = gap + (col - 1) * (w + gap)
        local y = top + (row - 1) * (h + gap)
        table.insert(bricks, Brick.new(x, y, w, h, hp))
      end
    end
  end
  return bricks
end

return Level

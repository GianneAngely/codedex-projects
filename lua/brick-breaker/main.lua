local Game = require("game")

local game
local sounds = {}

-- Bikin bunyi "beep" kotak sederhana tanpa file audio
local function beep(freq, duration)
  local rate = 44100
  local data = love.sound.newSoundData(math.floor(rate * duration), rate, 16, 1)
  for i = 0, data:getSampleCount() - 1 do
    local t = i / rate
    local wave = (math.sin(2 * math.pi * freq * t) > 0) and 0.25 or -0.25
    local fade = 1 - i / data:getSampleCount()
    data:setSample(i, wave * fade)
  end
  return love.audio.newSource(data, "static")
end

function love.load()
  love.graphics.setBackgroundColor(0.08, 0.07, 0.18)
  love.graphics.setFont(love.graphics.newFont(18))
  sounds.paddle = beep(440, 0.06)
  sounds.brick = beep(660, 0.05)
  sounds.lose = beep(160, 0.35)
  sounds.win = beep(880, 0.4)
  sounds.power = beep(990, 0.12)

  -- skor tertinggi disimpan di file kecil di folder save LÖVE
  local store = {
    load = function() return tonumber(love.filesystem.read("best.txt") or "") or 0 end,
    save = function(score) love.filesystem.write("best.txt", tostring(score)) end,
  }
  game = Game.new(love.graphics.getWidth(), love.graphics.getHeight(), store)
  game.sfx = function(name)
    sounds[name]:stop()
    sounds[name]:play()
  end
end

function love.update(dt)
  local dir = 0
  if love.keyboard.isDown("left", "a") then dir = dir - 1 end
  if love.keyboard.isDown("right", "d") then dir = dir + 1 end
  game:update(dt, dir)
end

function love.keypressed(key)
  if key == "escape" then love.event.quit() end
  game:keypressed(key)
end

function love.mousemoved(x)
  game:setPaddleCenter(x)
end

function love.mousepressed()
  game:keypressed("space")
end

function love.draw()
  game:draw()
end

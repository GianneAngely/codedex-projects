-- Jalankan main.lua dengan "love" palsu buat nangkep typo API
package.path = "./?.lua;" .. package.path
local noop = function() end
local fakeSound = { getSampleCount = function() return 10 end, setSample = noop }
local fakeSource = { stop = noop, play = noop }
local down = {}
love = {
  graphics = setmetatable({
    getWidth = function() return 800 end,
    getHeight = function() return 600 end,
    newFont = function() return {} end,
  }, { __index = function() return noop end }),
  sound = { newSoundData = function() return fakeSound end },
  audio = { newSource = function() return fakeSource end },
  keyboard = { isDown = function(...) for _, k in ipairs({...}) do if down[k] then return true end end return false end },
  event = { quit = noop },
}
dofile("main.lua")
love.load()
down.right = true
for _ = 1, 30 do love.update(1 / 60); love.draw() end
love.keypressed("space")
for _ = 1, 600 do love.update(1 / 60); love.draw() end
love.keypressed("p"); love.draw()
print("smoke ok")

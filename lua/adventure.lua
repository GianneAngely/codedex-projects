-- Lua course, exercise 21: a tiny adventure with Player, Enemy and Spell objects

-- Player "class"
local Player = {}
Player.__index = Player

function Player.new(name, hp)
    local self = setmetatable({}, Player)
    self.name = name
    self.hp = hp
    self.spells = {}          -- list of learned spells
    return self
end

function Player:takeDamage(amount)
    self.hp = math.max(self.hp - amount, 0)   -- hp never goes below 0
    print(self.name .. " takes " .. amount .. " damage. HP: " .. self.hp)
end

function Player:castSpell(spell, enemy)
    -- check the spell is in this player's learned list first
    for _, learned in ipairs(self.spells) do
        if learned == spell then
            print(self.name .. " casts " .. spell.name .. " on " .. enemy.name .. "!")
            enemy:takeDamage(spell.damage)
            return
        end
    end
    print(self.name .. " hasn't learned " .. spell.name .. " yet.")
end

-- Enemy "class"
local Enemy = {}
Enemy.__index = Enemy

function Enemy.new(name, hp)
    local self = setmetatable({}, Enemy)
    self.name = name
    self.hp = hp
    return self
end

function Enemy:takeDamage(amount)
    self.hp = math.max(self.hp - amount, 0)
    print(self.name .. " takes " .. amount .. " damage. HP: " .. self.hp)
    if self.hp == 0 then
        print(self.name .. " has been defeated!")
    end
end

-- Spell "class"
local Spell = {}
Spell.__index = Spell

function Spell.new(name, damage)
    local self = setmetatable({}, Spell)
    self.name = name
    self.damage = damage
    return self
end

function Spell:learn(player)
    table.insert(player.spells, self)   -- add this spell to the player's list
    print(player.name .. " learned " .. self.name .. "!")
end

local hero = Player.new("Kyokoala", 100)
local slime = Enemy.new("Giant Slime", 50)
local fireball = Spell.new("Fireball", 30)
local thunder = Spell.new("Thunder", 25)

fireball:learn(hero)
hero:castSpell(thunder, slime)    -- not learned yet
hero:castSpell(fireball, slime)
hero:takeDamage(15)               -- the slime strikes back
thunder:learn(hero)
hero:castSpell(thunder, slime)    -- 50 - 30 - 25 = defeated

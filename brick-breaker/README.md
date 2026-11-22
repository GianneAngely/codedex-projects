# Brick Breaker (Final Project Lua, Codédex)

Game Breakout 2D pakai LÖVE dan Lua. Pantulkan bola pakai paddle sampai semua bata hancur. Ada 3 level, makin lama bola makin cepat.

## Cara main

| Tombol | Fungsi |
| --- | --- |
| Panah kiri/kanan atau A/D | Gerakin paddle |
| SPACE | Lempar bola / lanjut level |
| P | Pause |
| R | Main lagi (setelah game over / menang) |
| ESC | Keluar |

- Bata pink = 1 pukulan (10 poin), kuning = 2 pukulan (20), biru = 3 pukulan (30). Warna berubah tiap kena.
- Nyawa 3. Bola jatuh = nyawa berkurang.
- Kena pinggir paddle = bola mantul lebih miring.

## Cara jalanin

1. Download LÖVE dari https://love2d.org (versi macOS), buka app-nya sekali, izinkan di System Settings > Privacy & Security.
2. Drag folder `brick-breaker` ke ikon LÖVE, atau di Terminal:
   `/Applications/love.app/Contents/MacOS/love ~/Documents/Projects/codedex/lua/brick-breaker`

Tes logika (tanpa LÖVE): `lua tests/run_tests.lua`

## Struktur

- `main.lua`: callback LÖVE (`love.load`, `love.update`, `love.draw`, `love.keypressed`) + bunyi beep
- `game.lua`: state machine (serve, play, paused, levelclear, gameover, win), skor, nyawa, level
- `ball.lua`, `paddle.lua`, `brick.lua`: objek pakai metatable `__index` dan constructor `new`
- `level.lua`: layout level dari tabel string (angka = hp bata, `.` = kosong)
- `tests/`: unit test logika + smoke test dengan `love` palsu

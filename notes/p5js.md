# Catatan p5.js (Codédex)

p5.js = library JavaScript buat gambar, animasi, dan game sederhana di `<canvas>`. Cuma ada 1 bab (6 exercise), bab 2 masih "Coming Soon".

- **Dua fungsi utama**: `setup()` jalan sekali di awal (bikin kanvas: `createCanvas(lebar, tinggi)`), `draw()` jalan terus ~60x per detik (kayak `update` di Phaser/LÖVE).
- ex01: gambar pakai mouse: `if (mouseIsPressed) line(pmouseX, pmouseY, mouseX, mouseY)`. `pmouseX` = posisi mouse frame sebelumnya.
- ex02 Brat: `createCanvas(400, 600)` lalu `background(138, 206, 0)` (warna RGB, tiap angka 0-255).
- ex03 Cincin Olimpiade: `noFill()` (bentuk kosong), `strokeWeight(10)` (tebal garis), `stroke(r, g, b)` (warna garis), `ellipse(x, y, diameter)`. Posisi x naik 55, y gantian 55/110.
- ex04: `random(0, 256)` + `floor()` buat angka acak bulat, `color(r, g, b)` simpan warna. `keyIsDown(82)` = tombol R ditahan. `millis()` = waktu sejak mulai (ms), dipakai buat jeda 0.5 detik. Aku tambahin teks kode RGB di layar.
- ex05 Pong: `rect(x, y, w, h)` buat paddle, gerak pakai `keyIsDown(65)` (A) dan `keyIsDown(68)` (D), `constrain()` biar nggak keluar kanvas.
- ex06 Breakout: objek `paddle` dan `ball` (`{ x, y, w, h, speed }`), array 2D `bricks[i][j]`, warna acak tiap bata `color(random(80,255), ...)`, `fill()` sebelum `rect`. Sama konsepnya sama Brick Breaker Lua-mu.
- Catatan editor: tombol Run kadang jalanin kode lama, klik Run 2x.

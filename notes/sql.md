# Catatan SQL (Codédex)

SQL = bahasa buat ngambil dan ngolah data di database (tabel kayak Excel: kolom + baris). Kepakai banget di Data Mining dan SIM.

## Bab 1: Queries (tabel `shows`: id, name, genre, stream, year, seasons, tomatometer)
- ex01-02 `SELECT * FROM shows;` = ambil semua kolom. `SELECT name, genre FROM shows;` = kolom tertentu saja. Akhiri dengan `;`.
- ex03 `SELECT DISTINCT stream FROM shows;` = nilai unik saja (daftar layanan streaming tanpa duplikat).
- ex04 `WHERE` = filter baris: `WHERE tomatometer < 60` (show yang "rotten").
- ex05 `LIKE` + wildcard `%` (0 atau lebih karakter apa saja): `WHERE genre LIKE '%com%'` cocok ke sitcom, rom-com, comedy. `_` = tepat 1 karakter.
- ex06 `BETWEEN`: `WHERE year BETWEEN 1999 AND 2024` (inklusif, ujungnya ikut).
- ex07 `ORDER BY tomatometer DESC` = urut dari terbesar. `ASC` (default) = dari terkecil.
- ex08 NYC Restaurants (tabel `restaurants`): gabungan semuanya: cuisine unik, filter `cuisine = 'Chinese'`, `neighborhood = 'Greenpoint'`, murah `price = '$'`, mewah `price = '$$$$'`, plus pertanyaanku sendiri: resto Brooklyn urut rating Yelp tertinggi. Teks pakai tanda kutip tunggal `'...'`.

## Bab 2: Aggregates (tabel `playlist`: title, artist, album, year, genre, plays, duration)
- **Fungsi agregat** = ngeringkas banyak baris jadi 1 angka.
- ex10 `COUNT(*)` = jumlah baris (playlist ada 76 lagu).
- ex11 `MIN(year)` / `MAX(year)` = terkecil/terbesar. Biar tahu lagunya, tampilkan kolom lain juga: `SELECT title, artist, MIN(year)` (lagu terlama: God Only Knows - The Beach Boys 1966, terbaru: Beautiful Things - Benson Boone 2024). Versi tanpa judul ditolak checker.
- ex12 `SUM(duration)` = total durasi (detik). ex13 `AVG(duration)` = rata-rata.
- ex14 **`GROUP BY`** = hitung agregat per kelompok: `SELECT artist, AVG(plays) FROM playlist GROUP BY artist;` (rata-rata play tiap artis). Ini inti analisis data, mirip pivot table Excel.
- ex15 Video Games (tabel `games`): game paling banyak pemain `MAX(players)`, jumlah game per bahasa pemrograman `COUNT(*) ... GROUP BY language`, rata-rata Metascore per genre, dan pertanyaanku: studio dengan game terbanyak (`ORDER BY COUNT(*) DESC`).

## Bab 3: New Table
- ex16 `CREATE TABLE companies (id INTEGER, name TEXT, headquarters TEXT, year INTEGER);` = bikin tabel baru, tiap kolom punya **tipe data** (INTEGER angka bulat, TEXT teks, REAL desimal).
- ex17 `INSERT INTO companies (id, name, headquarters, year) VALUES (1, 'Figma', 'San Francisco', 2012);` = tambah baris. Pilihanku: Figma, Nintendo, Gojek.
- ex18 `ALTER TABLE companies ADD COLUMN website TEXT;` = tambah kolom (isinya NULL dulu).
- ex19 `UPDATE companies SET website = 'x.com' WHERE id = 1;` = ubah data. **Wajib pakai WHERE**, kalau lupa semua baris ikut berubah.
- ex20 `DELETE FROM companies WHERE id = 3;` = hapus baris (juga wajib WHERE, kalau nggak, tabel kosong).
- ex21 BFFs ("personal CRM"): tabel `friends` (name, birthday, location, favorite_snack, note) diisi 3 teman fiktif (Pip, Dot, Luna, para pet Codédex, bukan data orang asli), lalu `ORDER BY birthday` buat lihat ultah terdekat.

## Bab 4: Multiple Tables (JOIN)
- Tabel: `books` (book_id, title, author_id, year, fictional, goodreads), `authors` (id, name, born, books), `movies`/`directors`, `students`/`teachers`.
- ex23 **Primary key** = kolom identitas unik tiap baris (`books.book_id`, `authors.id`). **Foreign key** = kolom yang nunjuk ke primary key tabel lain (`books.author_id` → `authors.id`). Ini yang nyambungin tabel.
- ex24 **INNER JOIN** (atau `JOIN`): cuma baris yang cocok di kedua tabel.
  `SELECT books.title, authors.name FROM books JOIN authors ON books.author_id = authors.id;`
- ex25 **LEFT JOIN**: semua baris tabel kiri tetap muncul. Yang nggak punya pasangan, kolom kanannya NULL (di data ini ada beberapa buku tanpa penulis yang cocok). Bedanya kelihatan dari baris NULL itu.
- ex26 **UNION**: tumpuk hasil 2 query (kolomnya harus sama jumlah & tipe), duplikat dibuang: `SELECT name FROM students UNION SELECT name FROM teachers;` (pakai `UNION ALL` kalau mau duplikat tetap ada).
- ex27 Online Shop (orders, products, customers): barang terlaris (`JOIN` + `GROUP BY` + `COUNT` + `ORDER BY DESC`), barang paling sepi termasuk yang belum pernah dipesan (`LEFT JOIN` dari products, hasil 0 = Water Bottle & White Hoodie), daftar siapa beli apa (2x JOIN), dan penjualan per hari (`SUM(price)` per `date`). `AS` = kasih nama kolom hasil.

# Catatan React (Codédex)

## Bab 1: First React App
- **React** = library JavaScript buat bikin website dari **komponen** yang bisa dipakai ulang. Ubah di satu tempat, semua yang pakai ikut berubah.
- **Hot reloading**: hasil di kanan langsung update tiap ngetik.
- **File penting**: `index.html` punya `<div id="root">`, `index.js` ambil div itu lalu `createRoot(container).render(<App />)`. Jadi `root` = jembatan HTML dan React. (ex02: tanpa div root dan tanpa argumen `container`, app error.)
- **JSX**: nulis "HTML" di dalam JavaScript, nanti diterjemahin jadi `React.createElement(...)`. Harus dibungkus 1 elemen induk.
- **Komponen** = function yang return JSX, huruf depan kapital (`function Post()`), dipakai kayak tag `<Post />`. `export default` biar bisa di-`import` file lain.
- ex05: `<App>` berisi `<Post>`, `<Post>` berisi `<FollowButton>` dan `<LikeButton>`. Username aku ganti jadi Kyokoala.

## Bab 2: JSX & Components
- ex06: `return` cuma boleh 1 elemen teratas, jadi `<h1>` + `<ul>` dibungkus `<div>`. JSX lebih dari 1 baris ditaruh dalam `( )`.
- ex07: **kurung kurawal `{ }`** = pintu masuk JavaScript di JSX. `const name = "Angel"` lalu `<p>My name is {name}!</p>`.
- ex08: **atribut JSX** pakai `{}` buat nilai JS: `src={"https://..."}`. Elemen JSX bisa disimpan di variabel dan di **array**; array berisi `<li>` langsung bisa ditaruh di `<ul>{imageGallery}</ul>`. Tiap item array butuh `key` unik biar React bisa lacak.
- Beda sama HTML: `class` jadi **`className`** (karena `class` kata kunci JS), tag tanpa isi wajib ditutup `<img />`.
- ex09-10 (Hot Takes): pecah halaman jadi komponen `Header`, `Reviews`, `Footer` di file terpisah, lalu disusun di `App`. Review yang aku tulis: pineapple on pizza, tabs over spaces, kopi dingin.

## Bab 3: Props & State
- **Props** = data yang dikirim dari komponen induk ke anak, kayak atribut: `<Notification message="..." isRead={false} />`. Di anak dibaca lewat parameter `props`: `props.message`, `props.isRead`. Data mengalir **satu arah** (induk ke anak).
- ex11: `array.map(function (item) { return <div key={item.name}>...</div> })` = cara bikin daftar komponen dari array data. Aku isi katalog Angel, Psyduck, Kyokoala.
- ex12: prop boolean dipakai buat logika: kalau `props.isRead === false`, kasih `className="not-read"` (notifikasi belum dibaca kelihatan beda).
- **State** = data milik komponen yang bisa berubah, dan tiap berubah komponennya digambar ulang. `const [seconds, setSeconds] = useState(0);` (nilai awal 0). **Jangan ubah state langsung**, selalu lewat fungsi set-nya.
- ex13 Stopwatch: `setTimeout(() => setSeconds(seconds + 1), 1000)` tiap render, jadi angka naik tiap detik.
- ex14-15: state array di induk dikirim ke anak lewat props (`<TrendingList movies={movieData} />`), anak `.map` jadi `<Movie>`. Film pilihanku: Spirited Away, Your Name, Kiki's Delivery Service, Spider-Verse, Hitchhiker's Guide.

## Bab 4: Events
- **Event handler** = function yang dipanggil waktu user ngelakuin sesuatu. Ditempel ke elemen pakai atribut camelCase: `onClick={handleIncrease}` (tanpa `()`, karena kita ngasih fungsinya, bukan manggil sekarang).
- ex16 Online Shopping: `handleIncrease` nambah quantity, `handleDecrease` ngurangin tapi cuma kalau `> 0`.
- ex17 Tooltip: `onMouseOver` set state `true`, `onMouseLeave` set `false`, lalu `{showTooltip && <div>...}` = **conditional rendering** (tampil cuma kalau true).
- ex18 Zoom: `onFocus`/`onBlur` (fokus keyboard/klik). Elemen biasa (img/div) baru bisa difokus kalau dikasih `tabIndex={0}`.
- ex19 Volume: `onKeyDown(e)` baca `e.key === "ArrowUp"`. Update state berdasarkan nilai lama pakai bentuk fungsi: `setVolume(prev => Math.min(prev + 5, 100))`.
- ex20 WaterFest: gabungan semua event di 2 tombol (click, mouse enter/leave, focus/blur, keydown/keyup). `e.target` = elemen yang kena event.

(Checkpoint Project setelah Bab 4 dilewati: submit project dikunci buat akun Student Pack.)

## Bab 5: Forms
- ex21: form dasar `<form>`, `<label htmlFor="email">` (di JSX `for` jadi `htmlFor`), `<input type="email">`, `<button type="submit">`.
- **Controlled input**: nilai input disimpan di state. `value={name}` + `onChange={handleChange}` dengan `setName(e.target.value)`. Jadi state = satu-satunya sumber kebenaran.
- ex23 `onSubmit` di `<form>`: wajib `e.preventDefault()` biar halaman nggak reload. Validasi: kalau nama > 3 huruf, `alert`, kalau nggak, kosongin.
- ex24 **state objek** buat banyak input: `useState({ name: "", email: "", ... })`. Satu handler buat semua: `const { name, value } = e.target; setFormData({ ...formData, [name]: value })`. `...formData` = salin isi lama, `[name]` = nama properti dinamis sesuai atribut `name` input. Radio button: `checked={formData.petPreference === "dog"}`.
- ex25: `<select value={theme} onChange=...>` + `<option>`, dan `<textarea placeholder=...>`.
- ex26 Travel Log: gabungan semua. `<select multiple>` dibaca pakai `Array.from(e.target.selectedOptions, o => o.value)`. Submit = reset semua state ke awal.

## Bab 6: Hooks
- **Hook** = fungsi khusus React berawalan `use...`, dipanggil di bagian atas komponen (nggak boleh di dalam if/loop).
- ex27 Cookie Clicker: `useState` lagi, klik gambar = `setClick(click + 1)`.
- **`useEffect(fn, [deps])`** = jalanin "efek samping" (ubah hal di luar React, timer, fetch) setelah render. Array dependensi nentuin kapan jalan ulang:
  - `[]` = sekali waktu pertama muncul
  - `[color]` = tiap `color` berubah
  - tanpa array = tiap render
- ex28: efek `document.body.style.backgroundColor = color` dengan dependensi `[color]`.
- ex29: kalau `toggle` true, `setInterval` tiap 2 detik ganti warna. Efek **return fungsi cleanup** `clearInterval(intervalID)` biar timer lama dimatiin waktu toggle berubah (kalau nggak, timernya numpuk).
- **Context** (ex30 Barbenheimer): biar data bisa diakses komponen dalam tanpa oper props berlapis-lapis ("prop drilling"). `export const ThemeContext = createContext()`, bungkus `<ThemeContext.Provider value={{ theme, toggleTheme }}>`, lalu di komponen mana pun `const { theme } = useContext(ThemeContext)`.
- ex31 Kanban: gabungan. Tugas di state array, `moveTask` ganti status pakai `map` + `{ ...task, status }`, dibagi kolom pakai `filter`, warna hijau buat yang Done pakai `useEffect`. Tugas contohku: Finish React course, Polish Frog Star Hop, Start p5.js.

## Bab 7: Data Fetching
- **fetch** ambil data dari API (internet). Pola standar di React: di dalam `useEffect(..., [])` bikin `async function`, `const response = await fetch(url)`, `const data = await response.json()`, lalu simpan ke state.
- `await` = tunggu Promise selesai. Promise punya status pending (lagi nunggu), fulfilled (berhasil), rejected (gagal).
- ex32 NASA APOD: `fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")`. Render pakai `{apodData && (...)}` karena awalnya `null`.
- ex33 Loading screen: `isLoading` true + "Loading…" di awal, lalu setelah 3 detik false + "Done loading!". Cleanup `clearTimeout`.
- ex34 Error: `try { ... if (!response.ok) throw new Error("...") } catch (err) { setError(err.message) }`. Fetch nggak otomatis error waktu 404, jadi harus cek `response.ok` sendiri. URL sengaja aku rusak (`posts/1oops`) biar meme "I am Error" muncul.
- ex35 Pokédex: fetch 25 Pokémon dari PokeAPI, simpan di 2 state (list asli + list hasil filter), search pakai `.filter(p => p.name.startsWith(searchTerm))`. List asli jangan diubah biar bisa balik.
- ex36 Book Finder (Google Books API): template string `` `...?q=${query}` ``, render kondisional loading dan error.

## Bab 8: Routing
- **Routing** = website punya banyak "halaman" (URL beda) tapi tetap 1 app React, jadi pindah halaman tanpa reload (client-side routing). Pakai library `react-router-dom`.
- ex38: bungkus `<App />` dengan `<BrowserRouter>` di `index.js` (wajib, biar router aktif).
- ex37 & ex39: di App, `<Routes>` berisi `<Route path="/garden" element={<Garden />} />`. Path `/` = halaman utama.
- ex40: `<Link to="/1986">The Legend of Zelda</Link>` = pengganti `<a href>` yang nggak reload halaman.
- ex41 PonoPlayer: gabungan BrowserRouter + Routes + NavBar berisi Link ke Home/About/Gallery/Customers.

## Status
- Semua 41 exercise React selesai (2026-11-23 malam). Checkpoint Project dan Final Project nggak bisa disubmit (akun Student Pack).

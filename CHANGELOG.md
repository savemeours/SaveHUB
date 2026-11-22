## Versi Linux 4.4.0

Build Linux x64 AppImage dan DEB sudah berhasil dibuat. Desktop entry, AppID, dan ikon SaveHUB diselaraskan; tutup ke tray dimatikan secara bawaan di Linux agar jendela tidak hilang jika tray tidak terlihat. Lihat **LINUX.md** untuk pemasangan dan batas dukungan desktop.

Skrip BUILD-LINUX.sh, JALANKAN-LINUX.sh, serta workflow Build SaveHUB Linux disertakan. Konfigurasi ARM64 tersedia, tetapi binary ARM64 belum dibuat. Source ini tetap mendukung konfigurasi Windows dan macOS yang sudah ada.

## Versi macOS 4.3.0

Target DMG/ZIP kini tersedia untuk Apple Silicon (arm64) dan Intel (x64), dengan ikon ICNS SaveHUB, kontrol jendela native, perilaku Dock, menu macOS, dan pintasan Command. Skrip BUILD-MACOS.command serta workflow Build SaveHUB macOS disertakan. Lihat **MACOS.md** untuk langkah build dan pemasangan.

DMG harus dibangun di Mac atau melalui runner macOS GitHub Actions. Paket ini masih berupa sumber; build DMG dan pengujian Mac asli belum dilakukan. Signing/notarization Apple serta pembaruan otomatis Mac belum dikonfigurasi. Notifikasi Mac mengikuti jalur sistem SaveHUB; relay Windows per platform tetap khusus Windows.

## Ikon taskbar Windows 4.2.2

Jendela utama dan popup kini menetapkan ikon ICO SaveHUB, AppUserModelID, nama peluncuran ulang, serta perintah peluncuran ulang Windows secara eksplisit sebelum ditampilkan. File ikon disalin ke lokasi nyata di profil SaveHUB sehingga Windows tidak perlu membacanya dari app.asar. Identitas taskbar tetap SaveHUB; identitas notifikasi tetap mengikuti platform.

JALANKAN-WINDOWS.bat sekarang mengutamakan release/win-unpacked/SaveHUB.exe jika hasil build tersedia. Tanpa hasil build, skrip tetap dapat menjalankan mode sumber. Untuk pemakaian harian, jalankan BUILD-WINDOWS.bat dan pasang installer dari folder release, lalu buka SaveHUB melalui shortcut instalasinya.

Jika ikon lama masih terpin: keluar melalui menu tray, klik kanan ikon Electron lama dan pilih **Unpin from taskbar**, buka SaveHUB versi baru, lalu pin kembali ikon SaveHUB. Pembaruan ini tidak menghapus pin atau cache ikon Windows secara otomatis. Lihat **TASKBAR-WINDOWS.md**.

## Perbaikan build Windows 4.2.1

Tes notifikasi sebelumnya mengharapkan URL logo berbentuk `file:///local/whatsapp.png`. Windows menghasilkan URL valid dengan huruf drive, seperti `file:///C:/local/whatsapp.png`, sehingga tahap npm test menghentikan build. Versi ini memeriksa URL file lokal dan kecocokan berkas logo sesuai OS, termasuk spasi dan karakter XML; tidak menonaktifkan tes atau mengubah mekanisme notifikasi.

Ekstrak seluruh paket 4.2.1 ke folder baru, lalu jalankan **BUILD-WINDOWS.bat**. Skrip kini menyebut tahap yang gagal: pemasangan dependensi, pengujian, atau pembuatan installer. Installer dan portable yang berhasil dibuat tersedia di folder release. Data login lama tetap menggunakan partisi yang sama.

## Splash screen dan perbaikan 4.2.0

Splash screen SaveHUB tampil sebagai jendela terpisah sebelum halaman utama dibuat. Logo, status persiapan, dan animasi ringan memakai aset lokal. Splash ditutup setelah jendela utama selesai digambar dan antarmuka mengirim sinyal siap; tidak menunggu login atau jaringan platform dan tidak menambahkan jeda minimum. Saat PIN aktif, halaman pertama tetap layar kunci.

Jika startup gagal, splash dibersihkan dan SaveHUB menampilkan pesan pemulihan. Penutupan splash membatalkan startup. Batas waktu startup 60 detik mencegah proses persiapan menunggu sinyal siap tanpa akhir selama proses utama masih merespons. Sinyal siap hanya diterima dari antarmuka utama, bukan halaman platform.

Perbaikan yang diuji:

- Perpindahan cepat antarplatform mengikuti pilihan terakhir, termasuk jika balasan layout tiba tidak berurutan.
- Entri akun dan preferensi yang berformat rusak dinormalisasi agar tidak menggagalkan startup. ID akun yang valid tetap dipertahankan; data login tidak dihapus.
- Izin notifikasi diperiksa kembali setelah dialog selesai, sehingga mode fokus yang baru diaktifkan tetap dihormati.
- Menu tray tidak dibuat ulang untuk perubahan pengaturan yang tidak memengaruhi menu. Status fokus dan kunci tetap memperbaruinya.
- Kegagalan pemuatan halaman startup ditangani, dan pesan PIN saat ini tetap memiliki petunjuk yang jelas.

## Pengalaman desktop 4.1.0

- Layar pembuka SaveHUB serta layar koneksi pertama menggantikan tampilan kosong. Jika persiapan gagal, aplikasi menjelaskan kondisinya dan menyediakan Coba lagi.
- Error koneksi, waktu tunggu, dan sertifikat memakai bahasa pemulihan yang jelas, tanpa kode Chromium, pesan IPC, nama framework, atau jalur berkas internal pada layar.
- Menu klik kanan memakai aksi edit biasa dalam bahasa Indonesia sesuai izin kolom teks. Menu aplikasi, dialog izin/konfirmasi, dan judul popup memakai identitas SaveHUB.
- Status pembaruan menjelaskan ketersediaan dengan bahasa pengguna. Fitur yang belum tersedia tetap disebut belum tersedia.
- Gaya macOS, login terpisah, blur, kunci PIN, fokus, serta identitas notifikasi platform tetap dipakai. Tidak ada fitur browser luar.

Aplikasi tetap memakai Electron. Perubahan ini menyelaraskan tampilan dan interaksi SaveHUB; lisensi serta atribusi dependensi tetap disertakan. Halaman platform dan login milik penyedia layanan tidak diganti atau diklaim sebagai klien resmi SaveHUB.

## Tampilan baru 4.0.0

Bingkai aplikasi kini terinspirasi tampilan macOS: kontrol jendela merah–kuning–hijau di kiri atas, toolbar ringkas, sidebar kaca netral, pilihan beraksen biru, dan halaman platform yang lebih teratur. Tema terang/gelap serta preferensi sidebar sebelumnya tetap dipakai. Font menggunakan font sistem yang tersedia; tidak menyertakan font atau aset milik Apple.

Tombol sidebar pada title bar memperluas/meringkas navigasi dan menyimpan pilihan tersebut. Dialog pengaturan, multiakun, privasi, unduhan, mode fokus, pembaruan, dan kunci PIN memakai sistem tampilan yang sama. Pada jendela pendek, daftar platform dan konten dapat digulir secara terpisah.

Fitur **Buka di browser** telah dihapus dari menu layanan, halaman error, preload, dan IPC proses utama. Tautan HTTPS dan popup login tetap dibuka di dalam SaveHUB dengan sesi akun yang sesuai; protokol non-HTTPS tidak diteruskan ke aplikasi luar. Pengelola unduhan tetap bisa membuka berkas/folder yang diunduh sesuai tindakan pengguna.

Perubahan 4.0 mengubah tampilan. Dukungan paket macOS ditambahkan pada 4.3.0 dan dijelaskan di MACOS.md.

## Perbaikan 3.1.0

Notifikasi Windows memakai nama dan logo platform masing-masing: WhatsApp, Telegram, Instagram, Facebook, Discord, TikTok, Threads, X, dan Reddit. Klik membuka platform dan akun asal; saat terkunci, pembukaan menunggu PIN. Blur aktif menyembunyikan nama kontak dan isi pesan pada notifikasi baru. Lihat **NOTIFIKASI-WINDOWS.md** untuk langkah memperbarui versi lama dan batas pengujian.

## Fitur baru 3.0

Multiakun, system tray, kunci PIN, mode fokus, pengelola unduhan, penghemat RAM, dan mekanisme pembaruan otomatis. Lihat **FITUR-3.0.md** untuk penggunaan, batas fitur, dan aktivasi rilis resmi.

Pembaruan otomatis belum terhubung ke rilis publik: penerbit harus menyiapkan repo GitHub resmi dan penandatanganan Windows. Tombol update menjelaskan kondisi ini, tidak menampilkan keberhasilan palsu. Sistem tray, login multiakun, dan integrasi Windows masih membutuhkan pengujian native.

## Antarmuka baru 2.0

- Desain ulang seluruh bingkai aplikasi: title bar, sidebar, halaman layanan, dialog, pencarian, pemulihan error, dan kontrol platform.
- Permukaan glassmorphism dengan aksen mint, tema terang sebagai bawaan pemasangan baru, serta tema gelap yang tetap didukung. Pilihan tema lama dipertahankan.
- Navigasi platform dikelompokkan menjadi Pesan dan Sosial. Sidebar memiliki scroll tersendiri pada jendela pendek agar menu tetap terjangkau.
- Bintang favorit dan filter Favorit; status kosong menyediakan jalan kembali ke semua platform.
- Ringkasan memakai jumlah platform yang benar-benar dibuka dan konfigurasi blur yang aktif, tanpa angka pesan atau status akun buatan.
- Tombol Lanjutkan kembali ke platform yang dibuka selama sesi aplikasi.
- Panel privasi tersendiri dengan contoh efek blur interaktif. Opsi navigasi, zoom, dan pemulihan berada di menu kontrol terpisah.
- Pengaturan memakai tab Tampilan dan Akun & sesi, dengan navigasi keyboard.
- Logo khusus SaveHUB menggantikan logo savemeours. Aset burung hantu tidak disertakan lagi.

## Private Mode = blur tampilan

Private Mode pada versi ini memburamkan konten sensitif pada layar. Mengubah tombol blur tidak mengganti akun, membuat sesi baru, atau menghapus cookie.

1. Buka platform lalu klik **Private** di kanan atas untuk menyalakan/mematikan blur.
2. Buka ikon **Pengaturan blur** di samping tombol **Blur tampilan** untuk mengatur bagian yang diburamkan:
   - Chat dan teks konten.
   - Nama dan identitas.
   - Foto profil.
   - Foto dan video.
3. Atur kekuatan blur 4–20 px.
4. **Tampilkan bagian saat disorot** membuka elemen yang sedang diarahkan kursor. Opsi ini mati secara bawaan.
5. **Blur seluruh halaman** memburamkan seluruh area platform sekaligus. Opsi hover tidak membuka mode seluruh halaman; matikan Private untuk menampilkan kembali.

Pengaturan tersimpan terpisah untuk setiap platform dan diterapkan ulang saat halaman dimuat. Akun yang sedang login tetap digunakan. Indikator perisai dan tulisan **Private · Blur aktif** menandai platform yang sedang diburamkan. SaveHUB menutup panel sementara ketika memasang ulang blur; jika pemasangan blur gagal, konten ditutup dan pesan pemulihan ditampilkan.

Blur selektif memakai struktur halaman masing-masing platform. Jika struktur berubah, beberapa bagian bisa tidak terjangkau, termasuk konten di shadow DOM. Gunakan **Blur seluruh halaman** bila ada bagian yang masih terlihat. Ketika root konten platform tidak ditemukan, aplikasi menerapkan blur halaman sebagai cadangan. Pemeriksaan langsung dengan akun nyata pada semua layanan masih diperlukan.

Efek ini menyamarkan tampilan dari pandangan orang di sekitar. Efek tidak menghapus pesan, mengubah visibilitas akun, mencegah situs menerima aktivitas, atau menyembunyikan data dari alat pengembang. Notifikasi baru melalui relay menyembunyikan judul dan isi ketika blur aktif; notifikasi lama dan berkas unduhan tetap dapat berisi informasi. Fitur membuka platform di browser luar telah dihapus.

## Menjalankan di Windows

1. Tutup SaveHUB versi lama.
2. Ekstrak seluruh ZIP ini ke folder biasa.
3. Pasang Node.js LTS 24 atau lebih baru dari https://nodejs.org/ jika belum ada.
4. Klik dua kali **JALANKAN-WINDOWS.bat**. Internet diperlukan untuk mengunduh dependensi saat pertama kali.

Alternatif terminal:

```sh
npm ci
npm start
```

Profil login normal menggunakan identitas aplikasi dan partisi yang sama seperti versi sebelumnya. Jangan memakai **Hapus sesi** kecuali memang ingin logout. Mode Private versi 1.0.2 tidak pernah disimpan permanen; sesi normal tetap menjadi sesi utama setelah pembaruan.

## Installer dan portable Windows

Jalankan **BUILD-WINDOWS.bat**, atau:

```sh
npm ci
npm test
npm run dist:win
```

Hasil pada folder `release`:

- `SaveHUB-Setup-4.3.0-x64.exe`
- `SaveHUB-Portable-4.3.0-x64.exe`

Paket ZIP ini berisi proyek sumber, belum EXE siap instal. Build Windows dan pengujian native belum dilakukan pada lingkungan ini karena runtime Electron tidak tersedia. Installer belum memakai sertifikat penerbit.

Untuk build GitHub Actions, unggah isi folder SaveHUB ke root repositori, lalu jalankan **Actions → Build SaveHUB Windows → Run workflow**. Unduh artifact **SaveHUB-Windows** setelah berhasil. Workflow disertakan; tidak ada repositori yang dibuat otomatis.

## Fitur lainnya

- Layanan dimuat saat dibuka dan tetap tersedia saat berpindah.
- Sesi login persisten yang terpisah per platform.
- Pencarian layanan, filter, tema gelap/terang, sidebar ringkas.
- Mute, zoom, navigasi, reload, serta pemulihan pemuatan di dalam aplikasi.
- **Perbaiki pemuatan layanan** membersihkan komponen cache dengan mempertahankan data login.
- **Hapus sesi** meminta konfirmasi sebelum menghapus seluruh data layanan.
- Profil browser menggunakan Chromium runtime sebenarnya untuk kompatibilitas situs.

| Pintasan | Fungsi |
| --- | --- |
| Ctrl+0 | Beranda |
| Ctrl+1–9 | Pilih platform sesuai urutan sidebar |
| Ctrl+K | Cari layanan |
| Ctrl+R | Muat ulang layanan |
| Ctrl+Shift+L | Kunci aplikasi |
| Ctrl+Shift+F | Mode fokus |
| Ctrl+Shift+B | Aktifkan / matikan blur |
| Ctrl+, | Pengaturan |
| F11 | Layar penuh |

## Pengembangan dan batas pengujian

`npm test` menguji kebijakan URL, panel native melalui adaptor simulasi, pengelolaan CSS blur, selector pada fixture WhatsApp, dan interaksi UI pada DOM simulasi. Lihat `VALIDASI.md`.

`src/privacy.cjs` memiliki profil selector dan pengelola stylesheet. `src/native-services.cjs` mengelola panel native. Konten layanan tetap memakai sandbox dan isolasi konteks tanpa akses Node.js. Tidak ada script yang membaca atau mengirim isi pesan untuk menjalankan blur; efek diterapkan menggunakan stylesheet lokal.

Dukungan panggilan, media, OAuth, CAPTCHA, notifikasi, serta login mengikuti kemampuan situs/Electron dan perlu diuji pada perangkat pengguna. Tema SaveHUB hanya mengubah bingkai aplikasi; efek blur mengubah penyajian konten di panel layanan. Aplikasi masih menggunakan Electron; metadata dan branding build memakai SaveHUB.

Logo SaveHUB: `assets/brand-logo.png`. Ikon aplikasi dan build: `assets/icon.png`, `assets/icon.ico`. Logo ini dirancang khusus untuk SaveHUB, bukan logo savemeours. Ikon layanan/kontrol: Font Awesome Free, CC BY 4.0; lihat `THIRD-PARTY-NOTICES.txt`.

Untuk melihat bingkai aplikasi secara lokal tanpa login, buka `src/index.html` di browser. Ini hanya pratinjau antarmuka; layanan akun membutuhkan aplikasi Electron.
